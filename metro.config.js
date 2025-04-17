/**
 * Metro configuration for React Native
 * https://github.com/facebook/metro
 *
 * This configuration extends from '@expo/metro-config' as recommended.
 *
 * @format
 */

const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  };
})();
