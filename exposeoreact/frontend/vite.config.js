import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/', // Wichtig f�r korrektes Laden von Assets beim Deployment
})