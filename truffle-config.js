const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MnemonicGanache = "wait essay vast quarter address second marble stand mutual puzzle shuffle congress";
const MnemonicRopsten = "old wheel indicate fit original include lawn hope gentle throw shoulder rifle";
const AccountIndex = 0;
const ropstenContractAddress = "0x6164652b9625f7aa83F5351027Be04C08C964929";

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
        return new HDWalletProvider(MnemonicGanache,"http://127.0.0.1:7545",AccountIndex);
      },
      network_id: "5777"
    },
    ropsten: {
      provider: function(){
        return new HDWalletProvider(MnemonicRopsten,"https://ropsten.infura.io/v3/13caeaf0bd844b3582928dbb33954b6f");
      },
      network_id: "3"
    }
  }
};
