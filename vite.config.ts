import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  return {
    // For production, use VITE_APP_BASE_URL or fallback to root
    // For development, always use root
    base: isProduction ? (env.VITE_APP_BASE_URL || '/') : '/',
    
    server: {
      host: "::",
      port: 3000,
      strictPort: true,
      cors: true,
    },
    
    preview: {
      port: 3000,
      strictPort: true,
      cors: true,
    },
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      emptyOutDir: true,
    },
    
    plugins: [react()],
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
      // Ensure static assets are built with the correct paths
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          // This ensures consistent chunk names for better caching
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        },
      },
    },
  };
});
