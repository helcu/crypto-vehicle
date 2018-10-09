/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

/*
* #explanation:
*   etherCost = gas * gasPrice
    etherCost = 4712388 * (100 * 10^-9 ether)
    etherCost = 0.4712388 ether
*/
var path = require('path');
require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.ETHEREUM_ACCOUNT_MNEMONIC;

module.exports = {
  contracts_build_directory: path.join(__dirname, "./../client/src/buildContracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 6712388,
      gasPrice: 100000000000
      // gas      - gas limit (d. 4712388)
      // gasPrice - gas price (d. 100000000000, 100 Shannon, 100 GWei, 100 nanoEther)
      // from     - from address (d. first from Ethereum client)
      // provider - web3 provider instance. If exists, ignore host and port
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + process.env.INFURA_API_KEY);
      },
      network_id: 3
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
