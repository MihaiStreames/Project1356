<div class="ambient">
  <div class="glow orb-one"></div>
  <div class="glow orb-two"></div>
  <div class="grid"></div>
</div>

<style>
  .ambient {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    z-index: 0;
  }

  .glow {
    position: absolute;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    opacity: 0.55;
    will-change: transform;
    transform: translateZ(0);
  }

  .orb-one {
    top: -200px;
    left: -140px;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--accent) 45%, transparent) 0%,
      color-mix(in srgb, var(--accent) 20%, transparent) 35%,
      transparent 70%
    );
    animation: drift 18s ease-in-out infinite;
  }

  .orb-two {
    bottom: -260px;
    right: -140px;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--accent-2) 40%, transparent) 0%,
      color-mix(in srgb, var(--accent-2) 18%, transparent) 35%,
      transparent 70%
    );
    animation: drift 22s ease-in-out infinite reverse;
  }

  .grid {
    --grid-line: color-mix(in srgb, var(--text-primary) 4%, transparent);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image:
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
    background-size: 80px 80px;
    opacity: 0.2;
  }

  @keyframes drift {
    0% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(30px, -20px) scale(1.05);
    }
    100% {
      transform: translate(0, 0) scale(1);
    }
  }

  @media (max-width: 720px) {
    .glow {
      width: 380px;
      height: 380px;
      opacity: 0.5;
    }

    .orb-one {
      top: -160px;
      left: -160px;
    }

    .orb-two {
      bottom: -220px;
      right: -160px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .glow {
      animation: none;
      transition: none;
    }
  }
</style>
