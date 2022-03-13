import Campaign from "./Crowdfunding.json";

const getCampaignInstance = async (web3,address) => {

    try {
        // console.log("WEB3");
        const campaign = new web3.eth.Contract(
            Campaign.abi,
            address
        );

        // console.log(campaign);
        return campaign;
    } catch (error) {
        console.log(error);
    }
};

export default getCampaignInstance;