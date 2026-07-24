<template>
  <div class="card-container route-panel">
    <div class="card card-large">
      <div class="profile-card-content">
        <div class="card-title-row">
          <div class="meme1">
            <img
              src="/images/达妮娅表情包1.webp"
              alt="达妮娅表情包1"
              width="594"
              height="593"
              decoding="async"
              fetchpriority="high"
            />
          </div>
          <h2>Kagari's Web</h2>
        </div>

        <p>算法竞赛爱好者 | XCPCer | 全栈开发学习中</p>

        <div class="social-links">
          <a class="social-button" href="https://github.com/Kagari22" target="_blank" rel="noopener noreferrer" aria-label="Open Kagari22 GitHub profile">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="brand-svg">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.699-2.782.605-3.369-1.344-3.369-1.344-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.033 1.532 1.033.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .269.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z" />
            </svg>
          </a>

          <a class="social-button" href="https://clist.by/coder/Kagari22/" target="_blank" rel="noopener noreferrer" aria-label="Open Kagari22 Clist profile">
            <img src="/images/clist.png" alt="Clist" class="social-icon-image" decoding="async" />
          </a>

          <a class="social-button" href="https://www.cnblogs.com/Kagari22" target="_blank" rel="noopener noreferrer" aria-label="Open Kagari22 CNBlogs profile">
            <img src="/images/博客园.png" alt="博客园" class="social-icon-image" decoding="async" />
          </a>

          <a class="social-button" href="https://blog.csdn.net/Kagari22" target="_blank" rel="noopener noreferrer" aria-label="Open Kagari22 CSDN profile">
            <img src="/images/csdn.png" alt="CSDN" class="social-icon-image" decoding="async" />
          </a>
        </div>
      </div>
    </div>

    <div class="card card-small">
      <div class="time-panel">
        <div class="time-label">Current Time</div>
        <h3>{{ currentTime }}</h3>
        <p class="time-date">{{ currentDate }}</p>
      </div>
    </div>
  </div>

  
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      currentTime: '',
      currentDate: '',
      clockTimer: null,
    }
  },
  mounted() {
    this.updateClock()
    this.clockTimer = setInterval(this.updateClock, 1000)
  },
  beforeUnmount() {
    if (this.clockTimer) clearInterval(this.clockTimer)
  },
  methods: {
    updateClock() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      this.currentDate = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })
    },
  },
}
</script>
