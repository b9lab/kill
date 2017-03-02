pragma solidity ^0.4.5;

contract ValueStore {
    function ValueStore() payable {}

    function() payable {}

    function kill() {
        selfdestruct(msg.sender);
    }
}