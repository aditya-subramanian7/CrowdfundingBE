import React, {
    Component
} from "react";

//Blockchain

import web3 from "./getWeb3";

import CampaignFactoryInstance from "./contracts/getCampaignFactoryInstance";

//css

import "./App.css";

//Compnents

// import NewCampaignForm from "./components/NewCampaignForm";
// import DisplayCampaignDetails from "./components/DisplayCampaignDetails";
import getCampaignInstance from "./contracts/getCampaignInstance";

//Pages

import Campaign from "./components/Camapign/Campaign";
import Home from "./components/Home";

//Router

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            campaigns: [],
            web3: null,
            accounts: null,
            contract: null,
            loading : true,
            names: [],
            descriptions: []
        };
    }

    async componentDidMount() {
        await this.loadBlockChainData();
    };
    
    async loadBlockChainData(){
        try {
            const accounts = await web3.eth.getAccounts();

            const campaign = await CampaignFactoryInstance();

            this.setState({
                web3,
                accounts,
                contract: campaign
            });

            this.setState({
                campaigns: await this.state.contract.methods.getDeployedCampaigns().call()
            });

            // const responseOwners = [];
            const responseNames = [];
            const responseDescription = [];
        
            for(let i = 0;i<this.state.campaigns.length;i++){
                const currCampaignInstance = await getCampaignInstance(web3,this.state.campaigns[i]);
                // responseOwners.push(await currCampaignInstance.methods.owner().call());
                responseNames.push(await currCampaignInstance.methods.campaignName().call());
                responseDescription.push(await currCampaignInstance.methods.description().call());
            }

            this.setState({
                // owners: responseOwners,
                names: responseNames,
                descriptions : responseDescription
            });

            this.setState({loading:false});

            console.log(this.state);
            console.log(campaign.address);

        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    render() {
        // console.log(this.state.loading);
        if (this.state.loading) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <Router>
                <div className = "App">
                    <Switch>
                        <Route path = "/" exact>
                            <Home 
                                loading = {this.state.loading}
                                accounts = {this.state.accounts}
                                campaigns = {this.state.campaigns}
                                contract = {this.state.contract}
                                names = {this.state.names}
                                descriptions = {this.state.descriptions}
                            />
                        </Route>
                        <Route path = "/campaign/:id" component = {Campaign}/>
                    </Switch> 
                </div>
            </Router>
        );
    }
}

export default App;
