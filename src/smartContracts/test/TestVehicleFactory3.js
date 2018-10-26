// Include web3 library so we can query accounts.
const Web3 = require('web3')
var HDWalletProvider = require("truffle-hdwallet-provider");
// Instantiate new web3 object pointing toward an Ethereum node.
//let web3 = new web3(new web3.providers.HttpProvider("http://localhost:7545"))
let web3 = new Web3(new HDWalletProvider("major second already unfair stem inform valve ethics frost garlic drift bird", "https://ropsten.infura.io/v3/d5308cb5cbd847429d6ae7bab1b916b6"));
//var web3 = new web3();

//web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/v3/d5308cb5cbd847429d6ae7bab1b916b6'));
//const VehicleFactory = artifacts.require("VehicleFactory");

/*var CryptoJS = require('crypto-js');*/
const Tx = require('ethereumjs-tx');
var privateKey = Buffer.from("9D5CB4F202F6EB0F2F515C00E0375ACB20E6D6A2497ECF0DCE37F404AD414C4D", 'hex')
//const assert = require('chai').assert;
const contract = require("truffle-contract");
const contractJson = require("../build/contracts/VehicleFactory.json");
const VehicleFactory = contract(contractJson);
VehicleFactory.setProvider(web3.currentProvider);
const contractAddress = "0x74bf7f464c110001a1d622412e279856323f7724";
/*VehicleFactory.currentProvider.sendAsync = function () {
  return VehicleFactory.currentProvider.send.apply(VehicleFactory.currentProvider, arguments);
};*/


const guid = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < 3; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  possible = "1234567890";
  for (var i = 0; i < 3; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text.slice(0, 3) + "-" + text.slice(3);
}

var numberPlates = [];
const numberPlateCount = 7;
//let countExpected, instance;


describe('TestVehicleFactory', async () => {

  before(async function () {
    // Get default account
    // 0x85609a365F2A2c03AC56C71Ec93FC4f6cF81dA95
    // 0x85609a365f2a2c03ac56c71ec93fc4f6cf81da95
    //const accounts = await web3.eth.getAccounts();
    web3.eth.defaultAccount = "0x85609a365f2a2c03ac56c71ec93fc4f6cf81da95"
    //countExpected = 60;
    instance = await VehicleFactory.deployed();
  });

  // Generate Number plates
  for (var i = 0; i < numberPlateCount; i++) {
    const _numberPlate = guid();
    numberPlates.push(_numberPlate);
  }

  after(async function () {
    console.log(numberPlates, numberPlates.length);
  });


  numberPlates.forEach((_numberPlate, i) => {
    it('Register Vehicle: ' + i + ": " + _numberPlate, async () => {

      let _brand = "T";
      let _model = "H";
      let _color = "";
      let _serialNumber = "";
      let _motorNumber = "";
      let _reason = "";
      let _photos = "QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P,QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,P";
      let _documents = "";
      let _ownersId = [web3.utils.utf8ToHex("80088008")];
      let _ownersNames = [web3.utils.utf8ToHex("ISAAC")];

      var myContract = new web3.eth.Contract(contractJson.abi, contractAddress);

      let data = myContract.methods.registerVehicle(
        web3.utils.utf8ToHex(_numberPlate), web3.utils.utf8ToHex(_brand), web3.utils.utf8ToHex(_model),
        web3.utils.utf8ToHex(_color), web3.utils.utf8ToHex(_serialNumber),
        web3.utils.utf8ToHex(_motorNumber), web3.utils.utf8ToHex(_reason),
        _photos, _documents, _ownersId, _ownersNames,
      ).encodeABI();
      //console.log(99, data);
      console.log(data.length, Buffer.from(data).length);

      const nonce = await web3.eth.getTransactionCount("0x85609a365f2a2c03ac56c71ec93fc4f6cf81da95");
      //const gasPrice = await web3.eth.getGasPrice();

      let rawTx = {
        nonce: nonce,
        gasPrice: 350000000000,
        gasLimit: 4712388,
        to: contractAddress,
        //value: web3.utils.toWei('5', 'ether'),
        data: data
      }

      var tx = new Tx(rawTx)
      tx.sign(privateKey)
      var serializedTx = '0x' + tx.serialize().toString('hex')

      const res = await web3.eth.sendSignedTransaction(serializedTx)
        .on('transactionHash', function (hash) {
          console.log(100, hash)
        })
        .on('receipt', function (receipt) {
          console.log(101, receipt.transactionHash)
        })
        .on('confirmation', async function (confirmationNumber, receipt) {
          //console.log(102, confirmationNumber, receipt)
          /*let instance = await VehicleFactory.deployed();

          let vehicle = {};
          [
            vehicle.numberPlate, vehicle.brand, vehicle.model,
            vehicle.color, vehicle.serialNumber, vehicle.motorNumber, vehicle.reason
          ] = await instance.getVehicle.call(web3.utils.utf8ToHex(_numberPlate));

          assert.equal(web3.utils.hexToUtf8(vehicle.numberPlate), _numberPlate);
          assert.equal(web3.utils.hexToUtf8(vehicle.brand), _brand);
          assert.equal(web3.utils.hexToUtf8(vehicle.model), _model);
          assert.equal(web3.utils.hexToUtf8(vehicle.color), _color);
          assert.equal(web3.utils.hexToUtf8(vehicle.serialNumber), _serialNumber);
          assert.equal(web3.utils.hexToUtf8(vehicle.motorNumber), _motorNumber);
          assert.equal(web3.utils.hexToUtf8(vehicle.reason), _reason);
          console.log(vehicle);*/
          return receipt;
        })
        .on('error', (e) => {
          console.error(103, e)
        });
    });
  });

  /*it("Get Vehicles Filtered", async () => {
    const vehiclesFiltered = await instance.getVehicles.call();
    assert.equal(vehiclesFiltered.length, countExpected);
  });*/
});