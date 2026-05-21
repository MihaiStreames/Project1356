<script lang="ts">
  const {
    progress,
    status,
    text,
  }: {
    progress: number;
    status: string;
    text: string;
  } = $props();
</script>

<section class="progress-block panel">
  <div class="progress-bar">
    <div style:transform="scaleX({progress})" class="progress-fill"></div>
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
    width: 100%;
    background: var(--progress-fill);
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.35s var(--ease-standard);
    will-change: transform;
  }

  .progress-meta {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: baseline;
    margin-top: 1rem;
    color: var(--text-muted);
    min-width: 0;
  }

  .progress-meta-title {
    font-size: var(--text-micro-size);
    text-transform: uppercase;
    letter-spacing: var(--text-micro-letter);
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .progress-meta-count {
    font-variant-numeric: tabular-nums;
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
      font-size: calc(var(--text-micro-size) + 0.05rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .progress-fill {
      transition: none;
    }
  }
</style>
