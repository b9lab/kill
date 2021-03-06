const Promise = require("bluebird");
const ValueStoreTest = artifacts.require("../test/ValueStoreTest.sol");
web3.eth.makeSureAreUnlocked = require("../utils/makeSureAreUnlocked.js");
web3.eth.makeSureHasAtLeast = require("../utils/makeSureHasAtLeast.js");

if (typeof web3.eth.getAccountsPromise !== "function") {
    Promise.promisifyAll(web3.eth, { suffix: "Promise" });
}

let accounts, user1;

before("should prepare accounts", () => {
    return web3.eth.getAccountsPromise()
        .then(_accounts => {
            accounts = _accounts;
            assert.isAtLeast(accounts.length, 1, "should have at least 1 account");
            user1 = accounts[0];
            return web3.eth.makeSureAreUnlocked([ user1 ]);
        })
        .then(() => web3.eth.makeSureHasAtLeast(user1, [ user1 ], web3.toWei(0.5)));
});

describe('ValueStore', () => {
    it("should have saved balances", () => {
        return ValueStoreTest.new({ from: user1, value: web3.toWei(1, "finney") })
            .then(created => Promise.all([
                created.balanceBefore(),
                created.balanceAfter()
            ]))
            .then(balances => {
                assert.strictEqual(
                    balances[0].toString(10),
                    web3.toWei(1, "finney").toString(10),
                    "should be the sent balance");
                assert.strictEqual(
                    balances[1].toString(10),
                    "0",
                    "should be the destroyed balance");
            });
    });
});