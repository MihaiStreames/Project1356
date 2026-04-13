<script lang="ts">
	const { label, value }: { label: string; value: string } = $props();

	let prevValue = "";
	let oldValue = $state("");
	let rolling = $state(false);

	// trigger roll animation whenever the displayed value changes
	$effect((): void => {
		if (value !== prevValue) {
			oldValue = prevValue;
			prevValue = value;

			if (oldValue !== "") {
				rolling = true;

				setTimeout((): void => {
					rolling = false;
				}, 400);
			}
		}
	});
</script>

<div class="time-slab">
	<div class="digits-wrapper">
		{#if rolling}
			<div class="digit-old">{oldValue}</div>
		{/if}
		<div class="digit-current" class:rolling>{value}</div>
	</div>
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

	.digits-wrapper {
		position: relative;
		overflow: hidden;
		height: 1.2em;
		font-family: "Share Tech Mono", "SFMono-Regular", monospace;
		font-size: clamp(2.2rem, 4vw, 3.8rem);
		letter-spacing: 0.08em;
		font-weight: 400;
	}

	.digit-current {
		position: relative;
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.digit-current.rolling {
		animation: roll-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	.digit-old {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		animation: roll-out 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	@keyframes roll-in {
		0% {
			transform: translateY(100%);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes roll-out {
		0% {
			transform: translateY(0);
			opacity: 1;
		}
		100% {
			transform: translateY(-100%);
			opacity: 0;
		}
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
		.digits-wrapper {
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
		.digit-current {
			animation: none;
			transition: none;
		}

		.digit-old {
			animation: none;
			transition: none;
		}
	}
</style>
