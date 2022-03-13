import CampaignFactory from "./CampaignFactory.json";
import web3 from "../getWeb3";

// const networkId = web3.eth.net.getId();
// const deployedNetwork = CampaignFactory.networks[networkId];
// const campaign = new web3.eth.Contract(
//     CampaignFactory.abi,
//     deployedNetwork && deployedNetwork.address,
// );

// const CampaignFactoryInstance = campaign;
// console.log(campaign);

const CampaignFactoryInstance = async () => {

    try {
        // console.log("WEB3");
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = CampaignFactory.networks[networkId];
        const campaign = new web3.eth.Contract(
            CampaignFactory.abi,
            deployedNetwork && deployedNetwork.address,
        );

        // console.log(campaign);
        return campaign;
    } catch (error) {
        console.log(error);
    }
};

export default CampaignFactoryInstance;