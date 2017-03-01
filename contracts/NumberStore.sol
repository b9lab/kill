pragma solidity ^0.4.5;

contract NumberStore {
    uint public number;

    event LogBeforeKilled();
    event LogAfterKilled();

    function NumberStore() {
        number = 1;
    }

    function increment() {
        number++;
    }

    function kill() {
        LogBeforeKilled();
        selfdestruct(msg.sender);
        LogAfterKilled();
    }
}