module.exports = function (api) {
  api.cache(true);
  
  const isE2E = process.env.E2E === 'true';
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            'moti/skeleton': 'moti/skeleton/expo',
          },
        },
      ],
      'react-native-reanimated/plugin',
      ...(isE2E ? ['@babel/plugin-proposal-class-properties'] : []),
    ],
  };
};

