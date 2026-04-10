<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { participantsRef } from "$lib/firebase";
	import { onValue } from "firebase/database";
	import type { Unsubscribe, DataSnapshot } from "firebase/database";
	import type { Joiner } from "$lib/types";
	import { joinCountdown } from "$lib/participants";
	import { checkAlreadyJoined } from "$lib/participants";
	import JoinForm from "./JoinForm.svelte";
	import RecentJoiners from "./RecentJoiners.svelte";

	let isJoined = $state(false);
	let joinCountText = $state("0 joined");
	let recentJoiners: Joiner[] = $state([]);

	let unsubParticipants: Unsubscribe | undefined;

	async function handleJoin(name: string): Promise<void> {
		try {
			await joinCountdown(name);
			isJoined = true;
		} catch (err: unknown) {
			console.error("error joining:", err);
		}
	}

	onMount((): void => {
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
		void checkAlreadyJoined()
			.then((joined: boolean): void => {
				if (joined) isJoined = true;
			})
			.catch((err: unknown): void => {
				console.error("failed to check join status:", err);
			});
	});

	onDestroy((): void => {
		if (unsubParticipants !== undefined) unsubParticipants();
	});
</script>

<section class="join panel" class:is-joined={isJoined}>
	<div class="join-copy">
		<h2>Join the countdown</h2>
		<p>Add your name to the timeline. Optional, but nice for the record.</p>
	</div>
	<JoinForm disabled={isJoined} onJoin={handleJoin} />
	<RecentJoiners count={joinCountText} joiners={recentJoiners} />
</section>

<style>
	.join {
		display: grid;
		gap: 1.5rem;
		transition: gap 240ms ease;
	}

	.join.is-joined {
		gap: 0;
	}

	.join-copy {
		max-height: 200px;
		overflow: hidden;
		transition: opacity 240ms ease, max-height 240ms ease;
	}

	.join-copy h2 {
		font-size: 1.4rem;
		margin-bottom: 0.4rem;
	}

	.join-copy p {
		color: var(--text-muted);
	}

	.join.is-joined .join-copy {
		opacity: 0;
		max-height: 0;
		pointer-events: none;
	}

	.join.is-joined :global(.join-recent) {
		border-top: none;
		padding-top: 0;
	}

	@media (max-width: 520px) {
		.join {
			padding: 1.25rem;
		}
	}
</style>
