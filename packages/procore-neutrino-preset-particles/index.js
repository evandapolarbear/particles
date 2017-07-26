module.exports = ({ config }) => {
  config.output
    .filename('[name].js')
    .libraryTarget('commonjs2')
    .end();

  config.plugins.delete('chunk').end();

  config.plugins.delete('html').end();
};
