var NumberStore = artifacts.require("./NumberStore.sol");

module.exports = function(deployer) {
  deployer.deploy(NumberStore);
};
