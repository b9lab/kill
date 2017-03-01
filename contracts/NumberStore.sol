pragma solidity ^0.4.5;

contract NumberStore {
    uint public number;

    function NumberStore() {
        number = 1;
    }

    function increment() {
        number++;
    }

    function kill() {
        selfdestruct(msg.sender);
    }
}