<template>
</template>

<script>
export default {
  props: {
    enabled: {
      type: Boolean,
      default: true,
    },
    throttleMs: {
      type: Number,
      default: 40,
    },
  },
  data() {
    return {
      lastTrailAt: 0,
    }
  },
  mounted() {
    if (this.enabled) {
      this.bindTrail()
    }
  },
  watch: {
    enabled(next) {
      if (next) {
        this.bindTrail()
        return
      }

      this.unbindTrail()
      document.querySelectorAll('.trail').forEach((node) => node.remove())
    },
  },
  methods: {
    bindTrail() {
      document.removeEventListener('mousemove', this.createTrail)
      document.addEventListener('mousemove', this.createTrail)
    },
    unbindTrail() {
      document.removeEventListener('mousemove', this.createTrail)
    },
    createTrail(e) {
      const now = Date.now()
      if (now - this.lastTrailAt < this.throttleMs) {
        return
      }

      this.lastTrailAt = now
      const variants = ['sky', 'pink', 'gold']

      for (let i = 0; i < 3; i += 1) {
        const dot = document.createElement('div')
        const size = 5 + Math.random() * 2
        const rotation = Math.random() * 360
        const offsetX = (Math.random() - 0.5) * 22
        const offsetY = (Math.random() - 0.5) * 18
        const driftX = (Math.random() - 0.5) * 42
        const driftY = -20 - Math.random() * 34
        const hue = variants[Math.floor(Math.random() * variants.length)]
        const shape = Math.random() > 0.5 ? 'petal' : 'star'

        dot.className = `trail trail-${hue} trail-${shape}`
        dot.style.left = `${e.clientX + offsetX}px`
        dot.style.top = `${e.clientY + offsetY}px`
        dot.style.width = `${size}px`
        dot.style.height = `${size}px`
        dot.style.setProperty('--trail-rotate', `${rotation}deg`)
        dot.style.setProperty('--trail-x', `${driftX}px`)
        dot.style.setProperty('--trail-y', `${driftY}px`)
        dot.style.setProperty('--trail-scale', `${1.4 + Math.random() * 1.4}`)

        document.body.appendChild(dot)

        setTimeout(() => {
          dot.remove()
        }, 950)
      }
    },
  },
  beforeUnmount() {
    this.unbindTrail()
  },
}
</script>

<style>
.trail {
  --trail-rotate: 0deg;
  --trail-x: 0px;
  --trail-y: -24px;
  --trail-scale: 1.8;
  position: fixed;
  pointer-events: none;
  transform: translate(-50%, -50%) rotate(var(--trail-rotate));
  z-index: 3000;
  mix-blend-mode: screen;
  animation: sparkle 0.95s ease-out forwards;
}

.trail::before,
.trail::after {
  content: '';
  position: absolute;
  inset: 0;
}

.trail-star::before,
.trail-star::after {
  left: 50%;
  top: 50%;
  width: 2px;
  height: 100%;
  border-radius: 999px;
  transform-origin: center;
}

.trail-star::before {
  transform: translate(-50%, -50%) rotate(0deg);
}

.trail-star::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.trail-petal {
  width: 14px;
  height: 14px;
}

.trail-petal::before {
  border-radius: 70% 30% 70% 30% / 35% 65% 35% 65%;
  transform: rotate(22deg);
}


.trail-petal::after {
  border-radius: 30% 70% 30% 70% / 65% 35% 65% 35%;
  transform: rotate(-22deg) scale(0.72);
  opacity: 0.7;
}

.trail-sky::before,
.trail-sky::after {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(156, 230, 255, 0.82) 45%, rgba(59, 130, 246, 0));
  box-shadow: 0 0 10px rgba(125, 211, 252, 0.95), 0 0 22px rgba(125, 211, 252, 0.45);
}

.trail-pink::before,
.trail-pink::after {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 203, 229, 0.82) 45%, rgba(244, 114, 182, 0));
  box-shadow: 0 0 10px rgba(244, 114, 182, 0.95), 0 0 22px rgba(244, 114, 182, 0.42);
}

.trail-gold::before,
.trail-gold::after {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 233, 163, 0.82) 45%, rgba(251, 191, 36, 0));
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.95), 0 0 22px rgba(251, 191, 36, 0.42);
}

@keyframes sparkle {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--trail-rotate)) scale(0.35);
  }

  20% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--trail-x)), calc(-50% + var(--trail-y))) rotate(calc(var(--trail-rotate) + 35deg)) scale(var(--trail-scale));
  }
}
</style>
