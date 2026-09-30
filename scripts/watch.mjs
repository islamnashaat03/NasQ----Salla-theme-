import webpack from 'webpack';
import config from '../webpack.config.cjs';

const compiler = webpack(config, (error, stats) => {
  if (error) console.error(error.message);
  else console.log(stats.toString({ colors: true, assets: true, modules: false }));
});

process.once('SIGINT', () => compiler.close(() => process.exit(0)));
process.once('SIGTERM', () => compiler.close(() => process.exit(0)));
