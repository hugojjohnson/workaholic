import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// esnext is a recent addition so it won't work on old browsers. However it lets you use
// the bson library to create object ids. If you want to build for old browsers, just remove
// every instance of 'esnext' in this file and it should be all good.

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  build: {
    target: "esnext",
    outDir: 'build',
  },
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    open: ""
  }
})