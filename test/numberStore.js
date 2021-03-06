const NumberStore = artifacts.require("./NumberStore.sol");
web3.eth.makeSureAreUnlocked = require("../utils/makeSureAreUnlocked.js");
web3.eth.makeSureHasAtLeast = require("../utils/makeSureHasAtLeast.js");

contract('NumberStore', accounts => {

    let user1;

    before("should prepare accounts", () => {
        assert.isAtLeast(accounts.length, 1, "should have at least 1 account");
        user1 = accounts[0];
        return web3.eth.makeSureAreUnlocked([ user1 ])
            .then(() => web3.eth.makeSureHasAtLeast(user1, [ user1 ], web3.toWei(0.5)));
    });

    let instance;

    beforeEach("should deploy a new instance", () => {
        return NumberStore.new({ from: user1 })
            .then(created => {
                instance = created;
            });
    });

    it("should have 1 on construction", () => {
        return web3.eth.getCodePromise(instance.address)
            .then(code => {
                assert.isAbove(code.length, 100, "should have some code");
                return instance.number();
            })
            .then(number => {
                assert.strictEqual(number.toNumber(), 1, "should be set on constructor");
                return web3.eth.getStorageAtPromise(instance.address, 0);
            })
            .then(number => {
                assert.strictEqual(number, '0x01', "should be the same number set");
            });
    });

    it("should be possible to increment", () => {
        return instance.increment({ from: user1, gas: 3000000 })
            .then(txInfo => {
                assert.isBelow(txInfo.receipt.gasUsed, 3000000, "should not have used all the gas");
                return instance.number();
            })
            .then(number => {
                assert.strictEqual(number.toNumber(), 2, "should be incremented");
                return web3.eth.getStorageAtPromise(instance.address, 0);
            })
            .then(number => {
                assert.strictEqual(number, '0x02', "should be the same incremented number");
            });
    });

    it("should only emit event before selfdestruct", () => {
        return instance.kill({ from: user1, gas: 3000000 })
            .then(txInfo => {
                assert.isBelow(txInfo.receipt.gasUsed, 3000000, "should not have used all the gas");
                assert.strictEqual(txInfo.logs.length, 1, "should only emit the first event");
                assert.strictEqual(
                    txInfo.logs[0].event,
                    "LogBeforeKilled",
                    "should have the event right before killed");
            });        
    });

    it("should return 0 after kill", () => {
        return instance.kill({ from: user1, gas: 3000000 })
            .then(txInfo => web3.eth.getCodePromise(instance.address))
            .then(code => {
                assert.strictEqual(code.length, 3, "should no longer have any code");
                return instance.number();
            })
            .then(number => {
                assert.strictEqual(number.toNumber(), 0, "should return zero as a function");
                return web3.eth.getStorageAtPromise(instance.address, 0);
            })
            .then(number => {
                assert.strictEqual(number, '0x00', "should have been truncated");
            });
    });

    it("should not increment after kill", () => {
        return instance.kill({ from: user1, gas: 3000000 })
            .then(txInfo => {
                assert.isBelow(txInfo.receipt.gasUsed, 3000000, "should not have used all the gas");
                return instance.increment({ from: user1, gas: 3000000 });
            })
            .then(txInfo => {
                assert.isBelow(txInfo.receipt.gasUsed, 3000000, "should not have used all the gas");
                return instance.number();
            })
            .then(number => {
                assert.strictEqual(number.toNumber(), 0, "should be still zero");
                return web3.eth.getStorageAtPromise(instance.address, 0);
            })
            .then(number => {
                assert.strictEqual(number, '0x00', "should be still zero");
            });
    });

});