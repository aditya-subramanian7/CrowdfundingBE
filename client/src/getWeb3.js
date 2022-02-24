import Web3 from 'web3';

let web3;
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {

	const getProvider = async () => {
    await window.web3.currentProvider.enable(); // request authentication
  };
  
	getProvider();
	
	// we are in the browser and metamask is running
	web3 = new Web3(window.web3.currentProvider);
} else {
	// We are on the server *or* the user is not using metamask
	const provider = new Web3.providers.HttpProvider(
		"http://127.0.0.1:8545"
	);
	web3 = new Web3(provider);
}

export default web3;

// import Web3 from 'web3';

// if (window.ethereum) {
//   window.web3 = new Web3(ethereum);
//   try {
//     // Request account access if needed
//     ethereum.enable();
//   } catch (error) {
//     // User denied account access...
//   }
// } else if (window.web3){
//   // Legacy dapp browsers...
//    window.web3 = new Web3(web3.currentProvider);
//  //window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//   //web3.eth.defaultAccount = web3.eth.accounts[0];
// } else {
//     const provider = new Web3.providers.HttpProvider(
//       "http://127.0.0.1:8545"
//     );
//     const web3 = new Web3(provider);
//     console.log("No web3 instance injected, using Local web3.");
// }

// export default web3;