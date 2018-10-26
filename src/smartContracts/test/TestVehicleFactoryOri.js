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
const assert = require('chai').assert;
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
let countExpected, instance;


describe('TestVehicleFactory', async () => {

  before(async function () {
    // Get default account
    // 0x85609a365F2A2c03AC56C71Ec93FC4f6cF81dA95
    // 0x85609a365f2a2c03ac56c71ec93fc4f6cf81da95
    //const accounts = await web3.eth.getAccounts();
    //web3.eth.defaultAccount = "0x85609a365f2a2c03ac56c71ec93fc4f6cf81da95"
    countExpected = 60;
    instance = await VehicleFactory.deployed();
  });

  // Generate Number plates
  /*for (var i = 0; i < numberPlateCount; i++) {
    const _numberPlate = guid();
    numberPlates.push(_numberPlate);
  }

  after(async function () {
    console.log(numberPlates, numberPlates.length);
  });*/

  /*
  numberPlates.forEach((_numberPlate, i) => {
    it('Register Vehicle: ' + i + ": " + _numberPlate, async () => {

      let _brand = "TOYOTA";
      let _model = "HILUX SURF SSR G WIDE";
      let _color = "DORADO";
      let _serialNumber = "KZN1859025037";
      let _motorNumber = "1KZ0558403";
      let _reason = "Registro de nuevo vehículo";

      var myContract = new web3.eth.Contract(contractJson.abi, contractAddress);

      let data = myContract.methods.addVehicle(
        web3.utils.utf8ToHex(_numberPlate), web3.utils.utf8ToHex(_brand), web3.utils.utf8ToHex(_model),
        web3.utils.utf8ToHex(_color), web3.utils.utf8ToHex(_serialNumber),
        web3.utils.utf8ToHex(_motorNumber), web3.utils.utf8ToHex(_reason)
      ).encodeABI();
      console.log(99, data);
      console.log(data.length, Buffer.from(data).length);

      const nonce = await web3.eth.getTransactionCount("0x85609a365f2a2c03ac56c71ec93fc4f6cf81da95");
      //const gasPrice = await web3.eth.getGasPrice();

      let rawTx = {
        nonce: nonce,
        gasPrice: 350000000000,
        gasLimit: 3000000,
        to: contractAddress,
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
          let instance = await VehicleFactory.deployed();

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

          return receipt;
        })
        .on('error', (e) => {
          console.error(103, e)
        });
    });
  });
  */

  it("Get Vehicles Filtered", async () => {
    const vehiclesFiltered = await instance.getVehicles.call();
    assert.equal(vehiclesFiltered.length, countExpected);
  });



  it("Get Vehicles Filtered 1", async (done) => {
    var promises = []
    for (var i = 0; i <= 1; i++) {
      promises.push(new Promise((resolve, reject) => {
        it("Get Vehicles Filtered", async () => {
          const vehiclesFiltered = await instance.getVehicles.call();
          console.log(vehiclesFiltered.length);
          assert.equal(vehiclesFiltered.length, countExpected);
          resolve();
        });
      }));
    }

    console.log(promises);
    Promise.all(promises).then(values => {
      console.log(values);
      assert.equal(promises.length, values.length);
      done();
    }).catch(reason => {
      console.log(reason)
    });
  });

  /*
  it("Get Vehicles Filtered 50", async () => {
    for (var i = 0; i <= 50; i++) {
      const vehiclesFiltered = await instance.getVehicles.call();
      assert.equal(vehiclesFiltered.length, countExpected);
    }
  });
  */

});


getVehiclesFiltered = () => {
  return new Promise((resolve, reject) => {
    try {
      it("Get Vehicles Filtered", async () => {
        const vehiclesFiltered = await instance.getVehicles.call();
        console.log(vehiclesFiltered.length);
        assert.equal(vehiclesFiltered.length, countExpected);
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}
