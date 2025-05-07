import webpack from 'webpack';

export default function override(config, env) {
  // Change devtool based on environment
  if (env === 'production') {
    // Use source-map for production (smaller but still debuggable)
    config.devtool = 'source-map';

    // Enable production optimizations
    config.optimization = {
      ...config.optimization,
      // Enable tree shaking
      usedExports: true,
      // Minimize output
      minimize: true,
      // Split chunks for better caching
      splitChunks: {
        chunks: 'all',
        name: false,
        cacheGroups: {
          // Create a vendors chunk for node_modules
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          // Create a commons chunk for shared code
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 5
          }
        }
      },
      // Extract webpack runtime to a separate file
      runtimeChunk: 'single'
    };
  } else {
    // Use cheap-module-source-map for development (faster rebuilds)
    config.devtool = 'cheap-module-source-map';
  }

  // Initialize resolve if it doesn't exist
  if (!config.resolve) config.resolve = {};

  // Configure resolve with both fallback (recommended for Webpack 5) and alias (for backward compatibility)
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve.fallback,
      path: 'path-browserify',
      os: 'os-browserify/browser',
      util: 'util/',
      fs: 'browserify-fs',
      buffer: 'buffer/',
      process: 'process/browser',
      stream: 'stream-browserify',
      assert: 'assert/',
      events: 'events/',
      zlib: 'browserify-zlib',
    },
    alias: {
      ...config.resolve.alias,
      process: 'process/browser',
      path: 'path-browserify',
      os: 'os-browserify/browser',
      util: 'util',
      fs: 'browserify-fs',
      buffer: 'buffer',
      stream: 'stream-browserify',
      assert: 'assert',
      events: 'events',
      zlib: 'browserify-zlib',
    },
    extensions: ['.js', '.jsx', '.json'],
  };

  // Add plugins for process and Buffer
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    // Define process.env for axios
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ];

  // Fix for mini-css-extract-plugin compatibility issue
  config.plugins.forEach((plugin) => {
    if (plugin.constructor.name === 'MiniCssExtractPlugin') {
      plugin.options.ignoreOrder = true;
    }
  });

  // Enable React Fast Refresh in development
  if (env === 'development') {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
  }

  // Ensure postcss is properly configured
  if (config.module && config.module.rules) {
    config.module.rules.forEach(rule => {
      if (rule.oneOf) {
        rule.oneOf.forEach(oneOfRule => {
          if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
            oneOfRule.use.forEach(loader => {
              if (loader.loader && loader.loader.includes('postcss-loader')) {
                if (!loader.options) loader.options = {};
                if (!loader.options.postcssOptions) loader.options.postcssOptions = {};
                loader.options.postcssOptions.config = false;
              }
            });
          }
        });
      }
    });
  }

  return config;
};
