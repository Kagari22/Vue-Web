<template>
  <div class="links-content route-panel">
    <div class="links-card">
      <header class="links-header">
        <div>
          <p class="eyebrow">KAGARI'S TOOLBOX</p>
          <h1>常用链接</h1>
          <p class="links-summary">已收录 {{ filteredLinks.length }} 个链接，收藏的项目会优先显示。</p>
        </div>

        <label class="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
          </svg>
          <input v-model.trim="keyword" type="search" placeholder="搜索名称、网址或说明" aria-label="搜索常用链接" />
        </label>
      </header>

      <div class="filter-bar" aria-label="链接筛选">
        <div class="category-list">
          <button
            v-for="category in categories"
            :key="category"
            class="filter-chip"
            :class="{ active: activeCategory === category }"
            type="button"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <button
          class="favorites-filter"
          :class="{ active: favoritesOnly }"
          type="button"
          @click="favoritesOnly = !favoritesOnly"
        >
          <span aria-hidden="true">★</span>
          {{ favoritesOnly ? '仅看收藏中' : `收藏 ${favoriteNames.length}` }}
        </button>
      </div>

      <template v-if="paginatedLinks.length">
        <div class="link-list">
          <article v-for="link in paginatedLinks" :key="link.name" class="link-item">
            <button
              class="favorite-button"
              :class="{ active: isFavorite(link.name) }"
              type="button"
              :aria-label="isFavorite(link.name) ? `取消收藏 ${link.name}` : `收藏 ${link.name}`"
              :aria-pressed="isFavorite(link.name)"
              @click="toggleFavorite(link.name)"
            >
              {{ isFavorite(link.name) ? '★' : '☆' }}
            </button>
            <div class="link-main">
              <a class="link-name" :href="link.url" target="_blank" rel="noopener noreferrer">
                {{ link.name }}
              </a>
              <span class="link-category">{{ link.category }}</span>
            </div>
            <a class="link-url" :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.url }}</a>
            <span class="link-note">{{ link.note }}</span>
          </article>
        </div>

      </template>

      <div v-else class="empty-state">
          <span aria-hidden="true">⌕</span>
          <h2>没有找到匹配的链接</h2>
          <p>试试更换关键词或筛选条件。</p>
          <button type="button" @click="clearFilters">清除筛选</button>
      </div>

      <div v-if="totalPages > 1" class="pagination" aria-label="链接分页">
        <button class="pagination-button" type="button" :disabled="currentPage === 1" @click="currentPage -= 1">上一页</button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="pagination-button page-number"
          :class="{ active: currentPage === page }"
          type="button"
          :aria-label="`第 ${page} 页`"
          :aria-current="currentPage === page ? 'page' : undefined"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button class="pagination-button" type="button" :disabled="currentPage === totalPages" @click="currentPage += 1">下一页</button>
      </div>
    </div>
  </div>
</template>

<script>
const FAVORITES_STORAGE_KEY = 'kagari-links-favorites'

export default {
  name: 'LinksView',
  data() {
    return {
      pageSize: 12,
      currentPage: 1,
      keyword: '',
      activeCategory: '全部',
      favoritesOnly: false,
      favoriteNames: [],
      linkItems: [
        { name: '原题库', url: 'http://yuantiji.ac/zh/', note: '搜索比赛原题', category: '题库与评测' },
        { name: 'CPC Finder', url: 'https://cpcfinder.com/', note: '查找 XCPC 选手和区域赛信息', category: '榜单与选手' },
        { name: 'XCPC ELO', url: 'https://zzzzzzyt.github.io/xcpc-elo/', note: '查看 XCPC 选手与 ELO 分数', category: '榜单与选手' },
        { name: 'RankLand', url: 'https://rl.algoux.org/', note: '历年赛事榜单合集', category: '榜单与选手' },
        { name: 'XCPCIO', url: 'https://board.xcpcio.com/', note: '部分 XCPC 榜单', category: '榜单与选手' },
        { name: 'PTA 榜单', url: 'https://pintia.cn/competitions/public', note: 'PTA 上的部分 XCPC 榜单', category: '榜单与选手' },
        { name: 'Virtual Judge', url: 'https://vjudge.net/', note: '通过 VJ 提交各大 OJ 的题目', category: '题库与评测' },
        { name: 'Codeforces Randomizer', url: 'https://karimelghamry.github.io/Codeforces-Randomizer/', note: '随机跳转 Codeforces 题目', category: '训练工具' },
        { name: 'Jiangly 算法模板', url: 'https://www.cnblogs.com/WIDA/p/17633758.html#06a---%E6%9C%80%E5%A4%A7%E6%B5%81flow-%E6%97%A7%E7%89%88%E5%85%B6%E4%B8%80%E6%95%B4%E6%95%B0%E5%BA%94%E7%94%A8', note: 'Jiangly 的部分算法模板', category: '学习资料' },
        { name: 'AtCoder Problems', url: 'https://kenkoooo.com/atcoder/#/table/', note: 'AtCoder 训练辅助工具', category: '训练工具' },
        { name: 'Rating Converter', url: 'https://silverfoxxxy.github.io/rating-converter', note: '转换 AtCoder 与 Codeforces 分数', category: '训练工具' },
        { name: 'Carbon', url: 'https://carbon.now.sh/', note: '将代码转换为图片', category: '训练工具' },
        { name: 'STL 笔记', url: 'https://www.fynote.com/d/2747', note: 'C++ STL 容器学习笔记', category: '学习资料' },
        { name: 'OI Wiki', url: 'https://oi-wiki.org/', note: '算法竞赛知识整合站点', category: '学习资料' },
        { name: 'XCPC 模板库', url: 'https://github.com/hh2048/XCPC/tree/main', note: 'WIDA 算法模板', category: '学习资料' },
        { name: 'QOJ', url: 'https://qoj.ac/', note: '覆盖较全面的 XCPC 题型', category: '题库与评测' },
        { name: 'Graph Editor', url: 'https://csacademy.com/app/graph_editor/', note: '在线图结构可视化工具', category: '训练工具' },
        { name: 'Codeforces Problems', url: 'https://cf.kira924age.com/#/table/', note: 'Codeforces 训练辅助工具', category: '训练工具' },
        { name: 'OEIS', url: 'https://oeis.org/', note: '整数数列数据库', category: '学习资料' },
        { name: 'GeoGebra', url: 'https://www.geogebra.org/calculator', note: '动态数学可视化工具', category: '训练工具' },
        { name: 'unordered_map 哈希攻击', url: 'https://blog.rosemoe.cyou/2023/08/09/codeforces-hacks-on-unordered-map/index.html', note: 'Codeforces 中的哈希攻击与规避方式', category: '学习资料' },
        { name: 'OIerDB', url: 'https://www.xn--vuqs4zq3d.com/', note: '查找 OIer 信息', category: '榜单与选手' },
        { name: '洛谷云剪切板', url: 'https://www.luogu.com.cn/paste', note: '代码和文本临时分享工具', category: '训练工具' },
        { name: 'ACMer Info', url: 'https://acmer.info/', note: '面向 ACMer 的信息汇总', category: '榜单与选手' },
        { name: 'Learn Binary Search', url: 'https://codeforces.com/blog/entry/92248', note: '二分学习资料', category: '学习资料' },
        { name: 'Aizu Online Judge', url: 'https://onlinejudge.u-aizu.ac.jp/courses/list', note: '入门题单', category: '题库与评测' },
        { name: 'ACDLadders', url: 'https://www.acodedaily.com/', note: 'Codeforces 不同难度精选题', category: '训练工具' },
        { name: 'DP 专题（AtCoder）', url: 'https://atcoder.jp/contests/dp/tasks', note: 'AtCoder DP 专题训练', category: '题库与评测' },
        { name: 'CCPCOJ 外榜', url: 'https://cpc.csgrandeur.cn/outrank', note: 'CCPC 外榜', category: '榜单与选手' },
      ],
    }
  },
  computed: {
    categories() {
      return ['全部', ...new Set(this.linkItems.map((link) => link.category))]
    },
    filteredLinks() {
      const normalizedKeyword = this.keyword.toLowerCase()
      return this.linkItems
        .map((link, index) => ({ ...link, index }))
        .filter((link) => {
          const matchesCategory = this.activeCategory === '全部' || link.category === this.activeCategory
          const searchableText = `${link.name} ${link.url} ${link.note} ${link.category}`.toLowerCase()
          const matchesKeyword = !normalizedKeyword || searchableText.includes(normalizedKeyword)
          const matchesFavorite = !this.favoritesOnly || this.isFavorite(link.name)
          return matchesCategory && matchesKeyword && matchesFavorite
        })
        .sort((left, right) => {
          const favoriteOrder = Number(this.isFavorite(right.name)) - Number(this.isFavorite(left.name))
          return favoriteOrder || left.index - right.index
        })
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredLinks.length / this.pageSize))
    },
    paginatedLinks() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredLinks.slice(start, start + this.pageSize)
    },
  },
  watch: {
    keyword() { this.currentPage = 1 },
    activeCategory() { this.currentPage = 1 },
    favoritesOnly() { this.currentPage = 1 },
    favoriteNames() { this.currentPage = 1 },
  },
  mounted() {
    try {
      const savedFavorites = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]')
      if (Array.isArray(savedFavorites)) {
        this.favoriteNames = savedFavorites.filter((name) => typeof name === 'string')
      }
    } catch {
      window.localStorage.removeItem(FAVORITES_STORAGE_KEY)
    }
  },
  methods: {
    isFavorite(name) {
      return this.favoriteNames.includes(name)
    },
    toggleFavorite(name) {
      this.favoriteNames = this.isFavorite(name)
        ? this.favoriteNames.filter((favoriteName) => favoriteName !== name)
        : [...this.favoriteNames, name]
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(this.favoriteNames))
    },
    clearFilters() {
      this.keyword = ''
      this.activeCategory = '全部'
      this.favoritesOnly = false
    },
  },
}
</script>

<style scoped>
.links-content {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.links-card {
  width: min(1940px, 100%);
  height: min(1080px, calc(100vh - 138px));
  min-height: 0;
  padding: clamp(24px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  color: #f8fafc;
  overflow: hidden;
}

.links-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: rgba(253, 230, 138, 0.9);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.links-card h1,
.links-summary {
  margin: 0;
}

.links-card h1 {
  font-size: clamp(32px, 4vw, 44px);
}

.links-summary {
  margin-top: 10px;
  color: rgba(248, 250, 252, 0.68);
}

.search-box {
  width: min(360px, 100%);
  min-height: 48px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 15px;
  background: rgba(15, 23, 42, 0.24);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.search-box:focus-within {
  border-color: rgba(196, 181, 253, 0.8);
  background: rgba(15, 23, 42, 0.42);
  box-shadow: 0 0 0 4px rgba(196, 181, 253, 0.12);
}

.search-box svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  color: rgba(248, 250, 252, 0.7);
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #f8fafc;
  background: transparent;
  font: inherit;
}

.search-box input::placeholder {
  color: rgba(248, 250, 252, 0.5);
}

.filter-bar {
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.filter-chip,
.favorites-filter,
.favorite-button,
.empty-state button,
.pagination-button {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(248, 250, 252, 0.9);
  background: rgba(255, 255, 255, 0.08);
  font: inherit;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.filter-chip,
.favorites-filter {
  min-height: 36px;
  padding: 0 13px;
  border-radius: 999px;
  font-size: 14px;
}

.filter-chip:hover,
.filter-chip.active,
.favorites-filter:hover,
.favorites-filter.active {
  border-color: rgba(196, 181, 253, 0.74);
  background: rgba(167, 139, 250, 0.2);
}

.favorites-filter {
  flex-shrink: 0;
}

.favorites-filter span {
  margin-right: 5px;
  color: #fde68a;
}

.link-list {
  margin-top: 24px;
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 8px;
  scrollbar-color: rgba(196, 181, 253, 0.58) transparent;
  scrollbar-width: thin;
}

.link-list::-webkit-scrollbar {
  width: 8px;
}

.link-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(196, 181, 253, 0.5);
}

.link-item {
  display: grid;
  grid-template-columns: 34px minmax(155px, 0.85fr) minmax(250px, 1.65fr) minmax(180px, 1.2fr);
  align-items: center;
  gap: 16px;
  min-height: 72px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 17px;
  background: rgba(15, 23, 42, 0.18);
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.link-item:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 181, 253, 0.46);
  background: rgba(255, 255, 255, 0.12);
}

.favorite-button {
  width: 32px;
  height: 32px;
  padding: 0;
  border-color: transparent;
  border-radius: 10px;
  color: rgba(248, 250, 252, 0.54);
  background: transparent;
  font-size: 22px;
  line-height: 1;
}

.favorite-button:hover,
.favorite-button.active {
  color: #fde68a;
  background: rgba(253, 230, 138, 0.12);
}

.favorite-button.active {
  border-color: rgba(253, 230, 138, 0.28);
}

.link-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.link-name,
.link-url {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-name {
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  text-decoration: none;
}

.link-name:hover,
.link-url:hover {
  color: #c4b5fd;
}

.link-category {
  padding: 3px 8px;
  border-radius: 999px;
  color: rgba(221, 214, 254, 0.95);
  background: rgba(167, 139, 250, 0.16);
  font-size: 12px;
}

.link-url,
.link-note {
  min-width: 0;
  color: rgba(248, 250, 252, 0.7);
  font-size: 14px;
}

.link-url {
  text-decoration: none;
}

.link-note {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  min-height: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(248, 250, 252, 0.72);
  text-align: center;
}

.empty-state > span {
  margin-bottom: 12px;
  color: rgba(196, 181, 253, 0.8);
  font-size: 54px;
}

.empty-state h2,
.empty-state p {
  margin: 0;
}

.empty-state h2 {
  color: #fff;
  font-size: 22px;
}

.empty-state p {
  margin-top: 8px;
}

.empty-state button {
  margin-top: 20px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 10px;
}

.pagination {
  margin-top: auto;
  padding-top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.pagination-button {
  min-width: 44px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 10px;
}

.pagination-button:hover:not(:disabled),
.pagination-button.active {
  border-color: rgba(196, 181, 253, 0.7);
  background: rgba(167, 139, 250, 0.24);
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

@media (max-width: 900px) {
  .links-header,
  .filter-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .favorites-filter {
    align-self: flex-start;
  }

  .link-item {
    grid-template-columns: 34px minmax(0, 1fr) minmax(0, 1.35fr);
  }

  .link-note {
    grid-column: 2 / -1;
    white-space: normal;
  }
}

@media (max-width: 620px) {
  .links-content {
    padding: 0;
  }

  .links-card {
    height: calc(100vh - 120px);
    border-radius: 22px;
  }

  .link-item {
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 8px 12px;
  }

  .link-main,
  .link-url,
  .link-note {
    grid-column: 2;
  }

  .link-url,
  .link-note {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .favorite-button {
    grid-row: 1 / span 3;
  }
}
</style>
