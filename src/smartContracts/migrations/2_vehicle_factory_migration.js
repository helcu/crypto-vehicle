var VehicleFactory = artifacts.require("./VehicleFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(
    [
      VehicleFactory
    ]
  );
};