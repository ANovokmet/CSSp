import { Plugin } from 'vite';
import fs from 'fs/promises';

import * as CSSp from './index';

export default function cssp(): Plugin {
  const virtualSuffix = '\0virtual-css:'; // suffix

  return {
    name: 'vite-plugin-cssp',
    enforce: 'pre',

    resolveId(source, importer) {
      if (source.endsWith('.css')) {
        // Resolve to a virtual ID to mark that this plugin owns it
        return this.resolve(source, importer, { skipSelf: true }).then((resolved) => {
          if (!resolved) return null;
          return resolved.id + virtualSuffix;
        });
      }
    },

    async load(id) {
      if (!id.endsWith(virtualSuffix)) return null;

      const cssPath = id.slice(0, -virtualSuffix.length);
      const css = await fs.readFile(cssPath, 'utf8');
      return css;
    },

    async transform(code, id) {
      if (!id.endsWith(virtualSuffix)) {
        return;
      }

      const jsTarget = await CSSp.parse(code);

      return {
        code: jsTarget,
        map: null,
      };
    },

    handleHotUpdate(ctx) {
      if (!ctx.file.endsWith('.css')) return;

      const virtualId = ctx.file + virtualSuffix;
      const mod = ctx.server.moduleGraph.getModuleById(virtualId);

      if (mod) {
        ctx.server.moduleGraph.invalidateModule(mod);
        ctx.server.ws.send({
          type: 'full-reload',
          path: ctx.file + virtualSuffix,
        });
      }

      return [];
    },
  };
}