<script lang="ts">
	import type { DigitState } from "$lib/types";
	import TimeSlab from "./TimeSlab.svelte";

	const {
		days,
		hours,
		minutes,
		seconds,
		updatingDigits,
	}: {
		days: string;
		hours: string;
		minutes: string;
		seconds: string;
		updatingDigits: DigitState;
	} = $props();
</script>

<section class="clock panel">
	<TimeSlab label="Days" updating={updatingDigits.days} value={days} />
	<span class="divider">:</span>
	<TimeSlab label="Hours" updating={updatingDigits.hours} value={hours} />
	<span class="divider">:</span>
	<TimeSlab label="Minutes" updating={updatingDigits.minutes} value={minutes} />
	<span class="divider">:</span>
	<TimeSlab label="Seconds" updating={updatingDigits.seconds} value={seconds} />
</section>

<style>
	.clock {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.divider {
		font-family: "Share Tech Mono", monospace;
		font-size: 2.5rem;
		color: var(--text-muted);
	}

	@media (max-width: 900px) {
		.divider {
			display: none;
		}
	}

	@media (max-width: 720px) {
		.clock {
			flex-wrap: wrap;
		}
	}

	@media (max-width: 520px) {
		.clock {
			padding: 1.25rem;
		}
	}
</style>
