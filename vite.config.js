import { fileURLToPath, URL } from 'node:url'
import stylus from 'stylus'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 设置环境变量以禁用警告
process.env.SASS_SILENCE_DEPRECATION_WARNINGS = 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 添加构建优化选项
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'] // 根据您的项目依赖调整
        }
      }
    },
    chunkSizeWarningLimit: 1000 // 调整分块大小警告限制
  },
  // 添加性能优化选项
  optimizeDeps: {
    include: ['vue', 'vue-router'] // 根据您的项目依赖调整
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      scss: {
        // 确保使用现代 API  additionalData: `@use "sass:math";`,
        // 禁用警告
        silenceDeprecations: ['legacy-js-api'],
      },
      stylus: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
    },
  },
})