<template>
  <div :class="['page-shell', { 'dark-mode': darkMode }]">
    <CursorTrail :enabled="trailEnabled" />
    <SakuraRain />

    <nav class="navbar">
      <div class="logo">
        <img
          src="/images/BgSub_Kagari_logo.webp"
          alt="Kagari logo"
          width="1740"
          height="904"
          decoding="async"
          fetchpriority="high"
        />
      </div>

      <ul class="nav-links" :class="{ 'nav-links-locked': routeLocked }">
        <li>
          <a
            :href="baseUrl"
            :class="{ active: $route.path === '/' }"
            @click.prevent="handleNavClick('/')"
          >
            首页
          </a>
        </li>
        <li>
          <a
            href="/links"
            :class="{ active: $route.path === '/links' }"
            @click.prevent="handleNavClick('/links')"
          >
            常用链接
          </a>
        </li>
      </ul>
    </nav>

    <main class="app-bg">
      <div class="bg-layer bg-layer-sharp"></div>
      <div :class="['bg-layer', 'bg-layer-dark', { active: darkMode }]"></div>
      <div :class="['bg-layer', 'bg-layer-blur', { active: glassEnabled }]"></div>
      <div class="bg-shade"></div>

      <section class="overlay">
        <div class="route-stage">
          <router-view v-slot="{ Component, route }">
            <transition name="route-fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </router-view>
        </div>
      </section>
    </main>

    <div
      v-if="liquidActive"
      class="theme-liquid"
      :class="{
        'theme-liquid-active': liquidActive,
        'theme-liquid-to-dark': liquidTargetDark,
      }"
      :style="liquidOriginStyle"
      aria-hidden="true"
    >
      <span class="theme-liquid-glow"></span>
      <span class="theme-liquid-ripple theme-liquid-ripple-one"></span>
      <span class="theme-liquid-ripple theme-liquid-ripple-two"></span>
    </div>

    <div class="tool-dock">
      <button class="tool-toggle" type="button" @click="toolsOpen = !toolsOpen" aria-label="切换工具栏">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <transition name="tool-panel">
        <section v-if="toolsOpen" class="tool-panel">
          <button class="tool-item" type="button" @click="trailEnabled = !trailEnabled">
            <span>拖尾效果</span>
            <strong>{{ trailEnabled ? '开启' : '关闭' }}</strong>
          </button>
          <button class="tool-item" type="button" @click="glassEnabled = !glassEnabled">
            <span>背景毛玻璃</span>
            <strong>{{ glassEnabled ? '开启' : '关闭' }}</strong>
          </button>
          <button class="tool-item" type="button" @click="toggleDarkMode($event)">
            <span>深色模式</span>
            <strong>{{ darkMode ? '开启' : '关闭' }}</strong>
          </button>
        </section>
      </transition>
    </div>
  </div>
</template>

<script>
import CursorTrail from './components/CursorTrail.vue'
import SakuraRain from './components/SakuraRain.vue'
import './assets/home.css'

export default {
  name: 'App',
  components: {
    CursorTrail,
    SakuraRain,
  },
  data() {
    return {
      baseUrl: import.meta.env.BASE_URL,
      toolsOpen: false,
      trailEnabled: true,
      glassEnabled: true,
      darkMode: false,
      liquidActive: false,
      liquidTargetDark: false,
      liquidX: '50vw',
      liquidY: '50vh',
      themeModeTimer: null,
      liquidCleanupTimer: null,
      routeLocked: false,
      routeLockTimer: null,
      routeLockMs: 300,
    }
  },
  beforeUnmount() {
    if (this.routeLockTimer) {
      clearTimeout(this.routeLockTimer)
    }
    if (this.themeModeTimer) {
      clearTimeout(this.themeModeTimer)
    }
    if (this.liquidCleanupTimer) {
      clearTimeout(this.liquidCleanupTimer)
    }
  },
  computed: {
    liquidOriginStyle() {
      return {
        '--liquid-x': this.liquidX,
        '--liquid-y': this.liquidY,
      }
    },
  },
  methods: {
    toggleDarkMode(event) {
      if (this.liquidActive) {
        return
      }

      const target = event.currentTarget
      const { left, top, width, height } = target.getBoundingClientRect()
      this.liquidX = `${left + width / 2}px`
      this.liquidY = `${top + height / 2}px`
      this.liquidTargetDark = !this.darkMode
      this.liquidActive = true

      this.themeModeTimer = setTimeout(() => {
        this.darkMode = this.liquidTargetDark
        this.themeModeTimer = null
      }, 780)

      this.liquidCleanupTimer = setTimeout(() => {
        this.liquidActive = false
        this.liquidCleanupTimer = null
      }, 1260)
    },
    handleNavClick(targetPath) {
      if (this.routeLocked || this.$route.path === targetPath) {
        return
      }

      this.routeLocked = true
      this.$router.push(targetPath).finally(() => {
        if (this.routeLockTimer) {
          clearTimeout(this.routeLockTimer)
        }

        this.routeLockTimer = setTimeout(() => {
          this.routeLocked = false
          this.routeLockTimer = null
        }, this.routeLockMs)
      })
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
}

html {
  overflow-y: scroll;
  scrollbar-gutter: stable;
}

body {
  font-family: "LXGW WenKai", "Microsoft YaHei", sans-serif;
  background: #070b14;
  overflow-x: hidden;
}
</style>
