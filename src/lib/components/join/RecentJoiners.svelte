<script lang="ts">
	import type { Joiner } from "$lib/types";

	const {
		count,
		joiners,
	}: {
		count: string;
		joiners: Joiner[];
	} = $props();

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
</script>

<div class="join-recent">
	<div class="join-recent-header">
		<p class="join-recent-title">Recent joiners</p>
		<span id="joinCount">{count}</span>
	</div>
	<ul class="join-list">
		{#if joiners.length === 0}
			<li class="join-item placeholder">Waiting for the first joiner...</li>
		{:else}
			{#each joiners as joiner (joiner.joinedAt)}
				<li class="join-item join-item-animate">
					<span class="join-name">{joiner.name !== "" ? joiner.name : "Anonymous"}</span>
					<span class="join-time">{formatDate(joiner.joinedAt)}</span>
				</li>
			{/each}
		{/if}
	</ul>
</div>

<style>
	.join-recent {
		border-top: 1px solid var(--border);
		padding-top: 1rem;
	}

	.join-recent-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 0.75rem 1rem;
		margin-bottom: 0.75rem;
		min-width: 0;
	}

	.join-recent-title {
		font-size: var(--text-micro-size);
		text-transform: uppercase;
		letter-spacing: var(--text-micro-letter);
		color: var(--text-muted);
		margin-bottom: 0;
		min-width: 0;
		white-space: nowrap;
	}

	.join-recent-header #joinCount {
		font-size: var(--text-micro-size);
		text-transform: uppercase;
		letter-spacing: var(--text-micro-letter-tight);
		color: var(--text-muted);
		white-space: nowrap;
		justify-self: end;
	}

	.join-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.join-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--control-pad-y) var(--control-pad-x);
		min-height: var(--control-height);
		background: rgba(0, 0, 0, 0.2);
		border-radius: var(--radius-md);
		font-size: 0.9rem;
	}

	.join-item-animate {
		animation: join-slide 420ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
	}

	@keyframes join-slide {
		0% {
			opacity: 0;
			transform: translateY(-6px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.join-item.placeholder {
		color: var(--text-muted);
		font-style: italic;
		justify-content: center;
	}

	.join-name {
		color: var(--text-primary);
		font-weight: 600;
	}

	.join-time {
		color: var(--text-muted);
		font-size: var(--text-micro-size);
	}

	@media (prefers-reduced-motion: reduce) {
		.join-item-animate {
			animation: none;
			transition: none;
		}
	}
</style>
