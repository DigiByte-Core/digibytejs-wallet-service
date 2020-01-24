'use strict';

var request = require('request');
var _ = require('lodash');
var $ = require('preconditions').singleton();
var log = require('npmlog');
log.debug = log.verbose;

var Insight = require('./blockchainexplorers/insight');
var Common = require('./common');
var Constants = Common.Constants,
  Defaults = Common.Defaults,
  Utils = Common.Utils;

var PROVIDERS = {
  'insight': {
    'livenet': 'https://digiexplorer.info:443',
    'testnet': 'https://test-insight.bitpay.com:443',
  },
};

var URL = 'https://status.digibyteservers.io/v1/explorer/ready';

function BlockChainExplorer(opts) {
  $.checkArgument(opts);

  var provider = opts.provider || 'insight';
  var network = opts.network || 'livenet';

  $.checkState(PROVIDERS[provider], 'Provider ' + provider + ' not supported');
  $.checkState(_.contains(_.keys(PROVIDERS[provider]), network), 'Network ' + network + ' not supported by this provider');
};

BlockChainExplorer.prototype.getBestExplorer = function(opts, cb) {
  var provider = opts.provider || 'insight';
  var network = opts.network || 'livenet';

  request(URL, function(err, resp, body) {
    var json = JSON.parse(body);
    log.info('picking the best explorer instance from ' + URL + ' with a total of ' + json.length);
    return cb(null, new Insight({
      network: network,
      url: json[0].url,
      apiPrefix: opts.apiPrefix,
      userAgent: opts.userAgent,
      addressFormat: opts.addressFormat
    }));
  });  
}

module.exports = BlockChainExplorer;
