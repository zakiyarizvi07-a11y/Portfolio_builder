import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'node:os'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  // Store Vite's dep cache outside OneDrive-synced folders to prevent EPERM locks
  cacheDir: path.join(os.tmpdir(), 'portfolio-builder-vite-cache'),
})
