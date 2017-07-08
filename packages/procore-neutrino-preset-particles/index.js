module.exports = ({ config, options }) => {
  config.output
    .filename('[name].js')
    .end()

  config.plugins.delete('chunk').end()

  config.plugins.delete('html').end()
}
