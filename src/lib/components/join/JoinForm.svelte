<script lang="ts">
	const {
		disabled,
		onJoin,
	}: {
		disabled: boolean;
		onJoin: (name: string) => Promise<void>;
	} = $props();

	let nameValue = $state("");
	// guards against double-submit while the join request is in-flight
	let joinInFlight = $state(false);

	async function handleSubmit(e: Event): Promise<void> {
		e.preventDefault();
		if (joinInFlight) return;
		joinInFlight = true;

		try {
			await onJoin(nameValue.trim());
		} finally {
			joinInFlight = false;
		}
	}
</script>

<form class="join-form" class:is-disabled={disabled} onsubmit={handleSubmit}>
	<input
		aria-label="Your name (optional)"
		{disabled}
		maxlength={32}
		placeholder="Name (optional)"
		type="text"
		bind:value={nameValue}
	/>
	<button {disabled} type="submit">{disabled ? "Joined" : "Join"}</button>
</form>

<style>
	.join-form {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 1rem;
		max-height: 160px;
		transition: opacity 240ms ease, max-height 240ms ease;
	}

	.join-form.is-disabled {
		opacity: 0;
		max-height: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.join-form input:focus {
		outline: none;
		border-color: rgba(255, 209, 102, 0.6);
		box-shadow: 0 0 0 3px rgba(255, 209, 102, 0.15);
		background: rgba(0, 0, 0, 0.4);
	}

	.join-form button {
		background: var(--accent-2);
		color: #02130d;
		box-shadow: 0 10px 20px rgba(6, 214, 160, 0.25);
		width: auto;
	}

	.join-form button:hover {
		transform: translateY(-2px) scale(1.01);
		box-shadow: 0 12px 26px rgba(6, 214, 160, 0.35);
	}

	.join-form button:active {
		transform: translateY(0);
	}

	.join-form button:focus-visible {
		outline-color: var(--accent-2);
	}

	@media (max-width: 720px) {
		.join-form {
			grid-template-columns: 1fr;
		}

		.join-form button {
			width: 100%;
		}
	}
</style>
