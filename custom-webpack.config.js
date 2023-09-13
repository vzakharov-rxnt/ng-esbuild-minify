const { merge } = require('webpack-merge');
const { EsbuildPlugin } = require("esbuild-loader");

module.exports = (config, options) => {
  console.log("Using custom-webpack.config.js.");

  if (options.optimization) {
    // https://how-to.dev/how-to-speed-up-angular-cli-app-with-esbuild-loader
    // remove 2 first minimizers, hoping they are the TerserPlugin
    config.optimization.minimizer.shift();
    config.optimization.minimizer.shift();

    config.optimization.minimizer.unshift(
      new EsbuildPlugin(),
    );

    // Replacing TerserPlugin with ESBuildMinifyPlugin minimizer
    // speeds up the prod build time from 40-80 seconds down to 8-18 seconds
    // but bundle size is roughly 5% larger, worth the trade-off?
    // on small apps the size diff is 3x
  }

  const newConfig = {
    devtool: 'source-map', // only required if using ESBuildMinifyPlugin, otherwise no source maps
    output: {
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].js'
    },
    externals: { // prevent these libs from being included in the build
      "html2canvas": "html2canvas",
      "canvg": "canvg"
    }
  }

  return merge(config, newConfig);
}
