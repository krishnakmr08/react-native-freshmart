module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],

        alias: {
          '@assets': './src/assets',
          '@features': './src/features',
          '@service': './src/service',
          '@styles': './src/styles',
          '@navigation': './src/navigation',
          '@components': './src/components',
          '@state': './src/state',
          '@utils': './src/utils',
        },

        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],

    'react-native-reanimated/plugin',
  ],
};
