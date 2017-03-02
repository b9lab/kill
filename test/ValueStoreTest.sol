pragma solidity ^0.4.5;

import "../contracts/ValueStore.sol";

contract ValueStoreTest {
    uint public balanceBefore;
    uint public balanceAfter;

    function ValueStoreTest() payable {
        uint sent = msg.value;
        ValueStore valueStore = (new ValueStore).value(sent)();
        balanceBefore = valueStore.balance;
        valueStore.kill();
        balanceAfter = valueStore.balance;
    }
}