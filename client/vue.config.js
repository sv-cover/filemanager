module.exports = {
  devServer: {
    proxy: {
      '^/': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  filenameHashing: false,
  outputDir: '../public',
  indexPath: '../views/fileman.html'
}
