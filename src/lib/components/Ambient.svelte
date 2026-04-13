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
    width: 360px;
    height: 360px;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    will-change: transform;
  }

  .orb-one {
    top: -120px;
    left: -60px;
    background: rgba(255, 209, 102, 0.4);
    animation: drift 18s ease-in-out infinite;
  }

  .orb-two {
    bottom: -180px;
    right: -60px;
    background: rgba(6, 214, 160, 0.35);
    animation: drift 22s ease-in-out infinite reverse;
  }

  .grid {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
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
      width: 280px;
      height: 280px;
      filter: blur(60px);
      opacity: 0.45;
    }

    .orb-one {
      top: -140px;
      left: -120px;
    }

    .orb-two {
      bottom: -200px;
      right: -120px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .glow {
      animation: none;
      transition: none;
    }
  }
</style>
