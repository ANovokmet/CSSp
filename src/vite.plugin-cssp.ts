import { Plugin } from 'vite';

import * as CSSp from './index';

export default function cssp(): Plugin {
  return {
    name: 'vite-plugin-cssp',
    enforce: 'pre',

    options(options) {
      return {
        ...options,
        css: {
          transformer: 'no',
        },
      }
    },

    resolveId(source, importer, options) {
        console.log('resolve', source, importer);
    },

    load(id) {
      console.log('load', id);
    },

    async transform(code, id) {
      console.log('transform', id);
      if (!id.endsWith('.css')) {
        return;
      }

      const jsTarget = await CSSp.parse(code);
      console.log(jsTarget);

      return {
        code: jsTarget + '\nconsole.log(\'module\');\nexport default {};',
        map: null,
      };
    },
  };
}