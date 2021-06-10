import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'fileCache',
});

// (async () => {
//   await fileCache.setItem('color', 'red');
// })();

// (async () => {
//   const color = await fileCache.getItem('color');
//   console.log(color);
// })();

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }
        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            // path: new URL(args.path, args.importer + '/').href,
            path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`)
              .href,
          };
        }
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            /**
             * tiny-test-pkg
             * medium-test-pkg
             * nested-test-pkg
             * react
             * react-dom
             * axios
             * lodash
             * var react = require("react")
             * var reactDOM = require("react-dom")
             */
            contents: `
              import React, {useState} from "react"
              console.log(React)
            `,
          };
        }

        /**
         * Check to see if we have already fetched
         * this file and if it is in the cache
         */
        const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        /** if it is, return it immediately */
        if (cacheResult) {
          return cacheResult;
        }

        /** store response in cache */

        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: `
            ${data}
          `,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        /**
         * store response in cache
         */
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
