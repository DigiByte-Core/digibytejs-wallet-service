var digibyte = require('digibyte');
var _ = require('lodash');

function BCHAddressTranslator() {
};


BCHAddressTranslator.getAddressCoin = function(address) {
  try {
    new digibyte.Address(address);
    return 'legacy';
  } catch (e) {
    return;
  }
};


// Supports 3 formats:  legacy (1xxx, mxxxx); Copay: (Cxxx, Hxxx), Cashaddr(qxxx);
BCHAddressTranslator.translate = function(addresses, to, from) {
  var wasArray = true;
  if (!_.isArray(addresses)) {
    wasArray = false;
    addresses = [addresses];
  }


  from = from || BCHAddressTranslator.getAddressCoin(addresses[0]);
  if (from == to) return addresses;
  var ret =  _.map(addresses, function(x) {

    var orig = new digibyte.Address(x).toObject();

    return digibyte.Address.fromObject(orig).toString();
  });

  if (wasArray) 
    return ret;
  else 
    return ret[0];

};


module.exports = BCHAddressTranslator;
