import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue2';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import stylelint from 'vite-plugin-stylelint';

const PROJECT_ROOT_PATH = path.resolve(__dirname, '../../');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, PROJECT_ROOT_PATH, '');

  const plugins: PluginOption = [
    vue(),
    stylelint({
      files: ['**/*.{vue,scss,sass}'],
      exclude: ['node_modules', 'dist'],
      fix: true,
      lintInWorker: true,
    }),
    mkcert({ hosts: ['local.sdk.finance'], force: true, savePath: path.join(PROJECT_ROOT_PATH, '.certs') }),
  ];

  if (env.LEGACY_BUILD === 'true') {
    plugins.push(
      legacy({
        targets: '> 1%, not dead, last 2 versions',
      }),
    );
  }

  return {
    plugins,
    envDir: PROJECT_ROOT_PATH,
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url)),
        },
        {
          find: '~@',
          replacement: fileURLToPath(new URL('./src', import.meta.url)),
        },
        {
          find: /^~/,
          replacement: '',
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/tools/index.scss";',
          quietDeps: true,
        },
      },
    },
    cacheDir: path.resolve(__dirname, '../../node_modules/.vite'),
    build: {
      cssCodeSplit: true,
      emptyOutDir: true,
      chunkSizeWarningLimit: 600,
      outDir: path.resolve(PROJECT_ROOT_PATH, 'dist'),
      rollupOptions: {
        output: {
          manualChunks(id: string): string | undefined {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            const chunkNames = [
              'element-ui',
              'lodash',
              'chart.js',
              'gmap-vue',
              'vue',
              'axios',
              'async-validator',
              'babel-runtime',
              'core-js',
              'file-saver',
              'v-calendar',
            ];
            const chunkNameId = chunkNames.findIndex((packageName) => id.includes(packageName));

            if (chunkNameId === -1) {
              return 'vendors';
            }

            return chunkNames[chunkNameId];
          },
        },
      },
    },
    envPrefix: 'VUE_APP_',
    server: {
      port: 8080,
      host: '127.0.0.1',
      proxy: {
        '/api/v1': {
          target: env.BACKEND_HOST,
          secure: false,
          changeOrigin: true,
          headers: {
            origin: env.BACKEND_HOST,
          },
        },
      },
      fs: {
        cachedChecks: false,
      },
    },
  };
});
