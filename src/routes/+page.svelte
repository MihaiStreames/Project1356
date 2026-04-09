<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { database, analytics, countdownRef, participantsRef } from "$lib/firebase";
	import { onValue, get, set, child, ref, serverTimestamp } from "firebase/database";
	import { logEvent } from "firebase/analytics";
	import type { Unsubscribe, DataSnapshot } from "firebase/database";

	const DAYS = 1356;
	const TOTAL_MS = DAYS * 24 * 60 * 60 * 1000;

	const pad2 = (n: number): string => String(n).padStart(2, "0");
	const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
	}

	function getClientId(): string {
		const stored = localStorage.getItem("project1356-client-id");
		if (stored !== null) return stored;

		const bytes = new Uint8Array(8);
		crypto.getRandomValues(bytes);
		const id = `client_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
		localStorage.setItem("project1356-client-id", id);
		return id;
	}

	interface Joiner {
		name: string;
		joinedAt: number;
	}

	interface DigitState {
		days: boolean;
		hours: boolean;
		minutes: boolean;
		seconds: boolean;
	}

	let cachedStartTimestamp: number | null = $state(null);
	const previousValues: Record<string, string | null> = {
		days: null,
		hours: null,
		minutes: null,
		seconds: null,
	};
	let joinInFlight = $state(false);
	let status = $state("Waiting to start...");
	let progressWidth = $state("0%");
	let progressText = $state("0.00000000%");
	let days = $state("0000");
	let hours = $state("00");
	let minutes = $state("00");
	let seconds = $state("00");
	let joinCountText = $state("0 joined");
	let recentJoiners: Joiner[] = $state([]);
	let isJoined = $state(false);
	let isDisabled = $state(false);
	let btnText = $state("Join");
	let nameInputDisabled = $state(false);
	// tracks which digit keys are currently animating
	const updatingDigits: DigitState = $state({
		days: false,
		hours: false,
		minutes: false,
		seconds: false,
	});

	let nameValue = $state("");

	let tickInterval: ReturnType<typeof setInterval> | undefined;
	let unsubCountdown: Unsubscribe | undefined;
	let unsubParticipants: Unsubscribe | undefined;

	function updateDigit(key: keyof DigitState, newValue: string): void {
		if (previousValues[key] === newValue) return;
		previousValues[key] = newValue;
		updatingDigits[key] = true;
		setTimeout((): void => {
			updatingDigits[key] = false;
		}, 400);
	}

	function tick(): void {
		const startTimestamp = cachedStartTimestamp;
		if (startTimestamp === null) {
			progressWidth = "0%";
			progressText = "0.00000000%";
			days = "0000";
			hours = "00";
			minutes = "00";
			seconds = "00";
			status = "Waiting to start...";
			return;
		}

		const now = Date.now();
		const remaining = startTimestamp + TOTAL_MS - now;
		const elapsed = now - startTimestamp;
		const progress = clamp01(elapsed / TOTAL_MS);

		progressWidth = `${(progress * 100).toFixed(8)}%`;
		progressText = `${(progress * 100).toFixed(8)}%`;

		if (remaining <= 0) {
			status = "Countdown complete";
			const z = "0000";
			const zz = "00";
			days = z;
			hours = zz;
			minutes = zz;
			seconds = zz;
			updateDigit("days", z);
			updateDigit("hours", zz);
			updateDigit("minutes", zz);
			updateDigit("seconds", zz);
			progressWidth = "100%";
			progressText = "100.00000000%";
			return;
		}

		status = "IN PROGRESS";

		const totalSeconds = Math.floor(remaining / 1000);
		const d = Math.floor(totalSeconds / 86400);
		const h = Math.floor((totalSeconds % 86400) / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = totalSeconds % 60;

		const dStr = String(d).padStart(4, "0");
		const hStr = pad2(h);
		const mStr = pad2(m);
		const sStr = pad2(s);

		days = dStr;
		hours = hStr;
		minutes = mStr;
		seconds = sStr;
		updateDigit("days", dStr);
		updateDigit("hours", hStr);
		updateDigit("minutes", mStr);
		updateDigit("seconds", sStr);
	}

	async function joinCountdown(name: string): Promise<string> {
		const clientId = getClientId();
		const displayName = name !== "" ? name : "Anonymous";

		const snapshot = await get(child(ref(database), `participants/${clientId}`));
		const existingVal: unknown = snapshot.val();
		if (existingVal !== null) {
			return "already";
		}

		await set(child(ref(database), `participants/${clientId}`), {
			name: displayName,
			joinedAt: serverTimestamp(),
		});

		if (analytics !== null) {
			logEvent(analytics, "joined_countdown", { named: displayName !== "Anonymous" });
		}
		return "joined";
	}

	function disableJoinForm(): void {
		isJoined = true;
		isDisabled = true;
		btnText = "Joined";
		nameInputDisabled = true;
	}

	function enableJoinForm(): void {
		isJoined = false;
		isDisabled = false;
		btnText = "Join";
		nameInputDisabled = false;
	}

	async function handleSubmit(e: Event): Promise<void> {
		e.preventDefault();
		if (joinInFlight) return;
		joinInFlight = true;
		disableJoinForm();

		try {
			await joinCountdown(nameValue.trim());
			disableJoinForm();
		} catch (err: unknown) {
			console.error("error joining:", err);
			enableJoinForm();
		} finally {
			joinInFlight = false;
		}
	}

	onMount((): void => {
		// realtime countdown listener
		unsubCountdown = onValue(
			countdownRef,
			(snap: DataSnapshot): void => {
				// firebase val() returns unknown at runtime
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const data: { startTimestamp?: number } | null = snap.val();
				cachedStartTimestamp = data?.startTimestamp ?? null;
				tick();
			},
			(err: Error): void => {
				console.error("countdown listener error:", err);
				status = "Connection error";
			},
		);

		tickInterval = setInterval(tick, 250);

		// realtime participants listener
		unsubParticipants = onValue(
			participantsRef,
			(snap: DataSnapshot): void => {
				// firebase val() returns unknown at runtime
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const data: Record<string, unknown> = snap.val() ?? {};
				const count = Object.keys(data).length;
				joinCountText = `${String(count)} joined`;

				const entries: Joiner[] = [];
				snap.forEach((childSnap: DataSnapshot): void => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const val: Joiner | null = childSnap.val();
					if (val !== null && typeof val.joinedAt === "number") entries.push(val);
				});
				entries.sort((a, b) => a.joinedAt - b.joinedAt);
				recentJoiners = entries.slice(-5).reverse();
			},
			(err: Error): void => {
				console.error("participants count error:", err);
			},
		);

		// check if already joined
		const clientId = getClientId();
		void get(child(ref(database), `participants/${clientId}`))
			.then((snap: DataSnapshot): void => {
				const val: unknown = snap.val();
				if (val !== null) disableJoinForm();
			})
			.catch((err: unknown): void => {
				console.error("failed to check join status:", err);
			});
	});

	onDestroy((): void => {
		if (unsubCountdown !== undefined) unsubCountdown();
		if (unsubParticipants !== undefined) unsubParticipants();
		if (tickInterval !== undefined) clearInterval(tickInterval);
	});
</script>

<svelte:head>
	<title>Project 1356</title>
</svelte:head>

<div class="ambient">
	<div class="glow orb-one"></div>
	<div class="glow orb-two"></div>
	<div class="grid"></div>
</div>

<main class="wrap">
	<header class="hero">
		<p class="eyebrow">Global Countdown</p>
		<h1>Project 1356</h1>
	</header>

	<section class="clock">
		<div class="time-slab">
			<div class="digits" class:updating={updatingDigits.days}>{days}</div>
			<div class="label">Days</div>
		</div>
		<div class="divider">:</div>
		<div class="time-slab">
			<div class="digits" class:updating={updatingDigits.hours}>{hours}</div>
			<div class="label">Hours</div>
		</div>
		<div class="divider">:</div>
		<div class="time-slab">
			<div class="digits" class:updating={updatingDigits.minutes}>{minutes}</div>
			<div class="label">Minutes</div>
		</div>
		<div class="divider">:</div>
		<div class="time-slab">
			<div class="digits" class:updating={updatingDigits.seconds}>{seconds}</div>
			<div class="label">Seconds</div>
		</div>
	</section>

	<section class="progress-block">
		<div class="progress-bar">
			<div style:width={progressWidth} class="progress-fill"></div>
		</div>
		<div class="progress-meta">
			<p class="progress-meta-title">{status}</p>
			<span class="progress-meta-count">{progressText}</span>
		</div>
	</section>

	<section class="join" class:is-joined={isJoined}>
		<div class="join-copy">
			<h2>Join the countdown</h2>
			<p>Add your name to the timeline. Optional, but nice for the record.</p>
		</div>
		<form class="join-form" class:is-disabled={isDisabled} onsubmit={handleSubmit}>
			<input
				aria-label="Your name (optional)"
				disabled={nameInputDisabled}
				maxlength={32}
				placeholder="Name (optional)"
				type="text"
				bind:value={nameValue}
			/>
			<button disabled={nameInputDisabled} type="submit">{btnText}</button>
		</form>
		<div class="join-recent">
			<div class="join-recent-header">
				<p class="join-recent-title">Recent joiners</p>
				<span id="joinCount">{joinCountText}</span>
			</div>
			<ul class="join-list">
				{#if recentJoiners.length === 0}
					<li class="join-item placeholder">Waiting for the first joiner...</li>
				{:else}
					{#each recentJoiners as joiner (joiner.joinedAt)}
						<li class="join-item join-item-animate">
							<span class="join-name">{joiner.name !== "" ? joiner.name : "Anonymous"}</span>
							<span class="join-time">{formatDate(joiner.joinedAt)}</span>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
	</section>

	<footer class="footer">
		<a href="https://github.com/MihaiStreames/Project1356" rel="noopener noreferrer" target="_blank"
			>MihaiStreames - 2026</a
		>
	</footer>
</main>
