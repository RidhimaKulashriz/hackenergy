import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // This ensures that the app works when served from a subdirectory
    base: env.VITE_APP_BASE_URL || '/',
    
    server: {
      host: "::",
      port: 3000,
      strictPort: true,
      // Enable CORS in development
      cors: true,
    },
    
    preview: {
      port: 3000,
      strictPort: true,
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
