/*
* Vite config
*
* Used by:
*   $ npm run build:vite
*/
import {dirname} from 'path'
import {fileURLToPath} from 'url'

const myPath = dirname(fileURLToPath(import.meta.url));

import visualizer from 'rollup-plugin-visualizer'

import { manualChunks } from '../vite-and-roll/manualChunks.js'

const createStats = true;

export default {
  resolve: {
    dedupe: [
      'tslib'   // tbd. How should 'resolve.dedupe' be used?  Manual doesn't show. This does not seem to do it..
    ],
    // For dear Firebase
    mainFields: ["esm2017", "module"]
  },

  define: {     // "statically replaced" for production
    "_OPS_VERSION": "\"0.0.0\""
  },

  build: {
    //publicDir: myPath + "/../extras",
    outDir: myPath + "/out",    // must match 'hosting.public' in 'firebase.json'.
    assetsDir: '.',   // relative to 'outDir'

    //minify: true,
    sourcemap: true,
    target: 'esnext',   // assumes native dynamic imports
    //polyfillDynamicImport: false

    rollupOptions: {
      output: { manualChunks },

      plugins: [
        createStats && visualizer({
          sourcemap: true,
          template: 'sunburst',
          brotliSize: true,
          filename: 'stats.vite.html'
        })
      ]
    }
  }
}
