const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Mnemonic = "wait essay vast quarter address second marble stand mutual puzzle shuffle congress";
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    ganache_local:{
      provider: function(){
        return new HDWalletProvider(Mnemonic,"http://127.0.0.1:7545",AccountIndex)
      },
      network_id: "5777"
    }
  },
  compilers: {
    solc: {
      version: "0.6.1"
    }
  }
};
