const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');
const isDesktop = process.argv.includes('--desktop')
|| (!process.argv.includes('--web') && !process.argv.includes('--desktop'));
const isWeb = process.argv.includes('--web');

const shared = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  external: ['vscode'],
  format: 'cjs',
  sourcemap: true,
  minify: false,
};

async function build() {
  if (isDesktop || (!isDesktop && !isWeb)) {
    console.log('Building desktop...');
    const ctx = await esbuild.context({
      ...shared,
      outfile: 'dist/extension.js',
      platform: 'node',
    });

    if (isWatch) {
      await ctx.watch();
      console.log('Watching desktop...');
    } else {
      await ctx.rebuild();
      await ctx.dispose();
    }
  }

  if (isWeb || (!isDesktop && !isWeb)) {
    console.log('Building web...');
    const ctx = await esbuild.context({
      ...shared,
      outfile: 'dist/extension.web.js',
      platform: 'browser',
      target: ['es2020'],
    });

    if (isWatch) {
      await ctx.watch();
      console.log('Watching web...');
    } else {
      await ctx.rebuild();
      await ctx.dispose();
    }
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});