import path from 'path';

function fixLocalImport() {
  return {
    name: 'fix-local-import',
    resolveId(source, importer) {
      if (source.startsWith('/web_modules')) {
        return path.resolve(__dirname, source.slice(1));
      }
      return null;
    },
  };
}

export default {
  input: 'src/index.js',
  output: {
    file: "dist/bundle_nomodule.js",
    format: 'iife'
  },
  plugins: [fixLocalImport()]
};
