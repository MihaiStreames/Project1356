<script lang="ts">
	const {
		width,
		status,
		text,
	}: {
		width: string;
		status: string;
		text: string;
	} = $props();
</script>

<section class="progress-block panel">
	<div class="progress-bar">
		<div style:width class="progress-fill"></div>
	</div>
	<div class="progress-meta">
		<p class="progress-meta-title">{status}</p>
		<span class="progress-meta-count">{text}</span>
	</div>
</section>

<style>
	.progress-bar {
		height: 10px;
		background: var(--progress-bg);
		border-radius: 999px;
		overflow: hidden;
		position: relative;
	}

	.progress-fill {
		height: 100%;
		width: 0%;
		background: var(--progress-fill);
		border-radius: 999px;
		transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 0 12px rgba(255, 209, 102, 0.4);
	}

	.progress-meta {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 0.75rem 1rem;
		margin-top: 1rem;
		color: var(--text-muted);
		min-width: 0;
	}

	.progress-meta-title {
		font-size: var(--text-micro-size);
		text-transform: uppercase;
		letter-spacing: var(--text-micro-letter);
		color: var(--text-muted);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.progress-meta-count {
		font-size: var(--text-micro-size);
		text-transform: uppercase;
		letter-spacing: var(--text-micro-letter-tight);
		color: var(--text-muted);
		white-space: nowrap;
		justify-self: end;
	}

	@media (max-width: 520px) {
		.progress-block {
			padding: 1.25rem;
		}

		.progress-meta {
			gap: 0.5rem;
			font-size: calc(var(--text-micro-size) + 0.05rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.progress-fill {
			animation: none;
			transition: none;
		}
	}
</style>
