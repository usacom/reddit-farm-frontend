// vue.config.js
module.exports = {
  // options...
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    // allowedHosts: ['reddit-farm.test', 'api.reddit-farm.test'],
    // proxy: 'http://api.reddit-farm.test',
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    // },
  },
  // devServer: {
  //   host: '0.0.0.0',
  //   hot: true,
  //   https: false,
  //   allowedHosts: [
  //     'http://reddit-farm.test/',
  //   ],
  // },
};
