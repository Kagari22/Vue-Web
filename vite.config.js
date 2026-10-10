import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// 本地开发与 Vercel 部署都使用根路径 '/'，不用改动
// GitHub Pages 是项目站点（地址形如 https://<用户名>.github.io/<仓库名>/），
// 由 .github/workflows/deploy.yml 在构建时通过 VITE_BASE 传入 '/Vue-Web/'
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
})
