const path = require('node:path');
const { execFileSync } = require('node:child_process');
const TwilightWatcher = require('@salla.sa/twilight/watcher');

class ValidationGate {
  apply(compiler) {
    compiler.hooks.beforeCompile.tap('NasqValidationGate', () => {
      execFileSync(process.execPath, ['scripts/validate-salla-contract.mjs'], { stdio: 'inherit' });
      execFileSync(process.execPath, ['scripts/validate-theme.mjs'], { stdio: 'inherit' });
    });
  }
}

module.exports = {
  mode: 'development',
  watch: true,
  entry: { app: ['./src/assets/js/app.js', './src/assets/styles/app.css'] },
  output: { path: path.resolve(__dirname, 'public'), filename: '[name].js' },
  module: { rules: [{ test: /\.css$/, type: 'asset/resource', generator: { filename: 'app.css' } }] },
  plugins: [new ValidationGate(), new TwilightWatcher()],
  watchOptions: { aggregateTimeout: 1000, ignored: /node_modules/ },
};
