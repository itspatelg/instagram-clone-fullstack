import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Ye line 'global is not defined' wali error ko fix karti hai
    // Jo SockJS aur StompJS libraries ki wajah se aati hai
    global: 'window',
  },
  server: {
    port: 5173,
    // Agar future mein CORS error aaye toh yahan proxy add kar sakte hain
  }
})
