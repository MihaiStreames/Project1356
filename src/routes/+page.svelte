<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { analytics, countdownRef } from "$lib/firebase";
	import { logEvent } from "firebase/analytics";
	import { onValue } from "firebase/database";
	import type { Unsubscribe, DataSnapshot } from "firebase/database";
	import { pad2, clamp01 } from "$lib/utils";
	import Ambient from "$lib/components/Ambient.svelte";
	import Clock from "$lib/components/clock/Clock.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import JoinSection from "$lib/components/join/JoinSection.svelte";
	import ProgressBar from "$lib/components/ProgressBar.svelte";

	const DAYS = 1356;
	const TOTAL_MS = DAYS * 24 * 60 * 60 * 1000;

	let cachedStartTimestamp: number | null = $state(null);
	let status = $state("Waiting to start...");
	let progressWidth = $state("0%");
	let progressText = $state("0.00000000%");
	let days = $state("0000");
	let hours = $state("00");
	let minutes = $state("00");
	let seconds = $state("00");

	let rafId: number | undefined;
	let unsubCountdown: Unsubscribe | undefined;

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
			days = "0000";
			hours = "00";
			minutes = "00";
			seconds = "00";
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

		days = String(d).padStart(4, "0");
		hours = pad2(h);
		minutes = pad2(m);
		seconds = pad2(s);
	}

	function rafLoop(): void {
		tick();
		rafId = requestAnimationFrame(rafLoop);
	}

	onMount((): void => {
		if (analytics !== null) {
			logEvent(analytics, "page_view", { page: "countdown" });
		}

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

		rafId = requestAnimationFrame(rafLoop);
	});

	onDestroy((): void => {
		if (unsubCountdown !== undefined) unsubCountdown();
		if (rafId !== undefined) cancelAnimationFrame(rafId);
	});
</script>

<svelte:head>
	<title>Project 1356</title>
</svelte:head>

<Ambient />

<main class="wrap">
	<header class="hero">
		<p class="eyebrow">Global Countdown</p>
		<h1>Project 1356</h1>
	</header>

	<Clock {days} {hours} {minutes} {seconds} />
	<ProgressBar {status} text={progressText} width={progressWidth} />
	<JoinSection />
	<Footer />
</main>

<style>
	.wrap {
		width: min(980px, 100%);
		display: grid;
		gap: 2.5rem;
		position: relative;
		z-index: 1;
		animation: float-in 0.8s ease-out both;
	}

	@keyframes float-in {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hero {
		text-align: center;
		display: grid;
		gap: 0.5rem;
	}

	h1 {
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.4em;
		font-size: 0.7rem;
		color: var(--text-muted);
	}

	@media (max-width: 720px) {
		.wrap {
			gap: 2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wrap {
			animation: none;
			transition: none;
		}
	}
</style>
