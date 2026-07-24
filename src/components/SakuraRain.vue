<template>
  <div class="sakura-rain" aria-hidden="true">
    <span
      v-for="petal in petals"
      :key="petal.id"
      class="sakura-petal"
      :style="petal.style"
    ></span>
  </div>
</template>

<script>
const randomBetween = (minimum, maximum) => minimum + Math.random() * (maximum - minimum)

const createPetal = (index) => ({
  id: index,
  style: {
    '--left': `${randomBetween(0, 100)}%`,
    '--width': `${randomBetween(9, 18)}px`,
    '--height': `${randomBetween(7, 14)}px`,
    '--duration': `${randomBetween(9, 17)}s`,
    '--delay': `${randomBetween(-17, 0)}s`,
    '--drift': `${randomBetween(-18, 18)}vw`,
    '--rotate-start': `${randomBetween(0, 360)}deg`,
    '--rotate-mid': `${randomBetween(120, 360)}deg`,
    '--rotate-end': `${randomBetween(360, 720)}deg`,
    '--opacity': randomBetween(0.45, 0.88).toFixed(2),
    '--blur': `${randomBetween(0, 1.2).toFixed(1)}px`,
  },
})

export default {
  name: 'SakuraRain',
  data() {
    return {
      petals: Array.from({ length: 32 }, (unusedValue, index) => createPetal(index)),
    }
  },
}
</script>

<style scoped>
.sakura-rain {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1100;
}

.sakura-petal {
  position: absolute;
  top: -12%;
  left: var(--left);
  width: var(--width);
  height: var(--height);
  border-radius: 100% 0 100% 0;
  background: linear-gradient(135deg, #fff1f7 0%, #f9a8d4 48%, #ec6fae 100%);
  box-shadow: 0 2px 8px rgba(244, 114, 182, 0.32);
  filter: blur(var(--blur));
  opacity: 0;
  will-change: transform, opacity;
  animation: sakura-fall var(--duration) linear var(--delay) infinite;
}

@keyframes sakura-fall {
  0% {
    opacity: 0;
    transform: translate3d(0, -12vh, 0) rotate(var(--rotate-start)) scale(0.8);
  }

  10% {
    opacity: var(--opacity);
  }

  50% {
    transform: translate3d(calc(var(--drift) * 0.45), 50vh, 0) rotate(var(--rotate-mid)) scale(1);
  }

  90% {
    opacity: var(--opacity);
  }

  100% {
    opacity: 0;
    transform: translate3d(var(--drift), 115vh, 0) rotate(var(--rotate-end)) scale(0.84);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sakura-rain {
    display: none;
  }
}
</style>
