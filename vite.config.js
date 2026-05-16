import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Dùng relative path để linh hoạt hơn nếu bạn đổi tên repo
})

