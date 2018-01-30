'use strict';

const Config = require('./lib/config');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-service-worker-index',

  included: function(app) {
    this._super.included && this._super.included.apply(this, arguments);
    this.app = app;
    this.app.options = this.app.options || {};
    this.app.options['esw-prember'] = this.app.options['esw-prember'] || {};
  },

  treeForServiceWorker(swTree, appTree) {
    const premberOptions = this.app.options['prember'];
    let premberUrls = [];
    if (premberOptions && premberOptions.urls && Array.isArray(premberOptions.urls)) {
      premberOptions.urls.forEach((url) => {
        let urlForPremberRoute = url;
        if (url === '/') {
          urlForPremberRoute = 'index.html';
        }
        else if (url.charAt(0) === '/') {
          urlForPremberRoute = `${url.substr(1)}/index.html`;
        }
        premberUrls.push(urlForPremberRoute);
      });
    }
    // We default to the urls you pass to prember, but you can override
    const eswPremberOptions = Object.assign({ urls: premberUrls }, this.app.options['esw-prember']);
    const configFile = new Config([appTree], eswPremberOptions);

    return mergeTrees([swTree, configFile]);
  }
};
