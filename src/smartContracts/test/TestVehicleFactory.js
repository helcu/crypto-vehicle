var parallel = require('mocha.parallel');
const fetch = require('node-fetch')

parallel('Partially Decentralized', async function () {
  for (var i = 0; i < 750; i++) {
    it('Test ' + (i + 100000), async function () {
      return fetch('http://crypto-vehicle.appspot.com/api/transactions/')
        .catch(e => console.error(e));
      /*.then(e => { return e.json() })
      .then(e => console.log(e.data))
      .catch(e => console.error(e))*/
    });
  }
});