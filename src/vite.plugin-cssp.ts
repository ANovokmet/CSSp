import { Plugin } from 'vite';
import fs from 'fs/promises';

import * as CSSp from './index';

export default function cssp(): Plugin {
  const virtualSuffix = "\0virtual-css:";

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
      if (source.endsWith(".css")) {
        // Resolve to a virtual ID to mark that this plugin owns it
        return this.resolve(source, importer, { skipSelf: true }).then((resolved) => {
          if (!resolved) return null;
          return resolved.id + virtualSuffix;
        });
      }
    },

    async load(id) {
      if (!id.endsWith(virtualSuffix)) return null;

      console.log('load', id);
      const cssPath = id.slice(0, -virtualSuffix.length);
      const css = await fs.readFile(cssPath, "utf8");
      return css;
    },

    async transform(code, id) {
      console.log('transform', id);
      if (!id.endsWith(virtualSuffix)) {
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