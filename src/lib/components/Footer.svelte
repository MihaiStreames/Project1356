<script lang="ts">
	import { analytics } from "$lib/firebase";
	import { logEvent } from "firebase/analytics";

	function handleFooterClick(): void {
		if (analytics !== null) {
			logEvent(analytics, "footer_link_click", { url: "github" });
		}
	}
</script>

<footer class="footer">
	<a
		href="https://github.com/MihaiStreames/Project1356"
		onclick={handleFooterClick}
		rel="noopener noreferrer"
		target="_blank">MihaiStreames - 2026</a
	>
</footer>

<style>
	.footer {
		text-align: center;
	}

	.footer a {
		text-transform: uppercase;
		letter-spacing: 0.4em;
		font-size: 0.7rem;
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.footer a:hover {
		color: var(--accent);
	}
</style>
