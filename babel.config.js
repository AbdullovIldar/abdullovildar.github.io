module.exports = {
    presets: [
      ['@babel/env', {
        targets: {
          node: 'current',
          firefox: '1',
          chrome: '1',
          safari: '11',
        },
      }],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };