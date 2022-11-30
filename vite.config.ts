import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import dts from "vite-plugin-dts";
import path from 'path';

export default defineConfig({
  server: {
    port: 3004,
  },
  optimizeDeps: {},
  plugins: [
    reactRefresh(), 
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.tsx'),
      name: 'react-nodetoy',
      fileName: (format) => `react-nodetoy.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom', 'three', '@react-three/fiber'],
      output: {
        // Override dist folder because root is in the example/ folder
        dir: 'dist',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
        },
      },
    },
  },
})
