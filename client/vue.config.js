module.exports = {
  devServer: {
    proxy: {
      '^/fileman': {
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
