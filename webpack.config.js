module.exports = {
  entry: './Main.js',
  output: {
    filename: 'subpage.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/env', {
                'useBuiltIns': 'entry'
              }]
            ]
          }
        }
      }
    ]
  }
}
