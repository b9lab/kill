pragma solidity ^0.4.5;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/NumberStore.sol";

contract NumberStoreTest {
    function testHaveInitialValue() {
        NumberStore numberStore = new NumberStore();
        Assert.equal(numberStore.number(), 1, "should be set in constructor");
    }

    function testCanIncrement() {
        NumberStore numberStore = new NumberStore();
        numberStore.increment();
        Assert.equal(numberStore.number(), 2, "should increment");
    }

    function testValueAfterKill() {
        NumberStore numberStore = new NumberStore();
        numberStore.kill();
        Assert.equal(numberStore.number(), 1, "should still be set within the transaction");
    }

    function testCanIncrementAfterKill() {
        NumberStore numberStore = new NumberStore();
        numberStore.kill();
        numberStore.increment();
        Assert.equal(numberStore.number(), 2, "should still increment within the transaction");
    }
}