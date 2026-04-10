<script lang="ts">
	const {
		label,
		updating,
		value,
	}: {
		label: string;
		updating: boolean;
		value: string;
	} = $props();
</script>

<div class="time-slab">
	<div class="digits" class:updating>{value}</div>
	<div class="label">{label}</div>
</div>

<style>
	.time-slab {
		background: var(--panel-strong);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.25rem 1rem;
		flex: 1;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.digits {
		font-family: "Share Tech Mono", "SFMono-Regular", monospace;
		font-size: clamp(2.2rem, 4vw, 3.8rem);
		letter-spacing: 0.08em;
		font-weight: 400;
		transition: transform 0.4s ease, opacity 0.4s ease;
	}

	.digits.updating {
		transform: translateY(-6px);
		opacity: 0.4;
	}

	.label {
		text-transform: uppercase;
		letter-spacing: 0.4em;
		font-size: 0.7rem;
		color: var(--text-muted);
		margin-top: 0.6rem;
	}

	@media (max-width: 720px) {
		.time-slab {
			flex: 1 1 45%;
			min-width: 140px;
		}
	}

	@media (max-width: 520px) {
		.digits {
			font-size: clamp(1.7rem, 8vw, 2.6rem);
			letter-spacing: 0.05em;
		}

		.label {
			letter-spacing: var(--text-micro-letter);
		}

		.time-slab {
			padding: 1rem 0.75rem;
			min-width: 120px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.digits {
			animation: none;
			transition: none;
		}
	}
</style>
