var Authorizable = artifacts.require("./Authorizable.sol");
var VehicleFactory = artifacts.require("./VehicleFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(
    [
      Authorizable,
      VehicleFactory
    ]
  );
};