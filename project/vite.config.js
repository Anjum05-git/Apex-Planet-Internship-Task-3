// vite.config.js
export default {
  // Configure the root directory
  root: '.',
  
  // Configure base path
  base: '/',
  
  // Configure server options
  server: {
    port: 3000,
    open: true, // Open browser on start
    cors: true, // Enable CORS
  },
  
  // Build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  
  // Plugins
  plugins: []
}