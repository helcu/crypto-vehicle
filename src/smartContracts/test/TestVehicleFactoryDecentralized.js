// Include web3 library so we can query accounts.
const Web3 = require('web3')
var HDWalletProvider = require("truffle-hdwallet-provider");
// Instantiate new web3 object pointing toward an Ethereum node.
//let web3 = new web3(new web3.providers.HttpProvider("http://localhost:7545"))
let web3 = new Web3(new HDWalletProvider("major second already unfair stem inform valve ethics frost garlic drift bird", "https://ropsten.infura.io/v3/d5308cb5cbd847429d6ae7bab1b916b6"));
//var web3 = new web3();

//web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/v3/d5308cb5cbd847429d6ae7bab1b916b6'));
//const VehicleFactory = artifacts.require("VehicleFactory");

/*var CryptoJS = require('crypto-js');
const Tx = require('ethereumjs-tx');
var privateKey = Buffer.from("9D5CB4F202F6EB0F2F515C00E0375ACB20E6D6A2497ECF0DCE37F404AD414C4D", 'hex')*/
const contract = require("truffle-contract");
const contractJson = require("../build/contracts/VehicleFactory.json");
const VehicleFactory = contract(contractJson);
VehicleFactory.setProvider(web3.currentProvider);
//const contractAddress = "0xab9a3a499cc71435d9f9e77f3ab0af603271ebc1";
/*VehicleFactory.currentProvider.sendAsync = function () {
  return VehicleFactory.currentProvider.send.apply(VehicleFactory.currentProvider, arguments);
};*/


/*const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + s4() + s4() + '-' + s4() + s4();
}

var numberPlates = [];
const numberPlateCount = 10;*/
let instance; //countExpected


var parallel = require('mocha.parallel');
/*const Promise = require('bluebird');
var f = 0;*/


let _search = "A";
parallel('Totally Decentralized', async function () {

  before(async function () {
    console.log(web3);
    instance = await VehicleFactory.deployed();
  });

  for (var i = 0; i < 5; i++) {
    it('Test ' + (i + 10000), async function () {
      return instance.getVehiclesFilteredWithContains(_search, _search, _search, _search);
    });
  }
});

/*describe('TestVehicleFactory', async () => {

  before(async function () {
    countExpected = 60;
    //instance = await VehicleFactory.deployed();
  });

  

  /*it('Get Vehicles Filtered 1500', async function () {
    var promises = [];
    instance = await VehicleFactory.deployed();
    let _search = "A";

    for (var i = 0; i < 1500; i++) {
      promises.push(
        instance.getVehiclesFilteredWithContains(_search, _search, _search, _search)
          .then(() => console.log(f++))
          .catch(() => console.error("err", new Date()))
      );
    }

    /*return Promise.map(
      promises,
      e => {
        console.log(new Date())
        return e.length;
      }
    );/
    return Promise.all(promises)
      .then(() => console.log("Owari", new Date()));
  });/

});*/


/*const getVehiclesFiltered = new Promise(async (resolve, reject) => {
  try {
    const vehiclesFiltered = await instance.getVehicles.call();
    resolve(vehiclesFiltered);
  } catch (e) {
    reject(e);
  }
});*/