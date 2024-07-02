module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: '3.37.1',
      modules: false
    }]
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ]
};
