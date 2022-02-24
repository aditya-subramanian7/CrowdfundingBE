import React,{Component} from 'react';
import CampaignRow from './CampaignRow';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { Button, Container, FormControlLabel } from '@material-ui/core';


class Home extends Component{

    constructor(props){
        super(props)

        this.state = {
            minContribution: null,
            campaignName: "",
            description: ""
        };
    }

    async createCampaign() {
        const {
            accounts,
            contract,
        } = this.props;

        await contract.methods.createCampaign(this.state.minContribution,this.state.campaignName,this.state.description).send({
            from: accounts[0]
        });
        const responseCampaigns = await contract.methods.getDeployedCampaigns().call();

        this.setState({
            campaigns: responseCampaigns
        });
    };

    render() {
        return (
            <div className = "App">
                <div className= "">
                    <form onSubmit={(event)=>{
                        event.preventDefault();
                        this.createCampaign();
                    }}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Campaign Name"
                            variant = "outlined"
                            multiline
                            fullWidth
                            maxRows={4}
                            onChange = {(e)=>{
                                this.setState({campaignName:e.target.value});
                            }}
                            required
                        />
                        <br></br>
                        <br></br>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Min Contribution (Wei)"
                            variant = "outlined"
                            multiline
                            maxRows={4}
                            onChange = {(e)=>{
                                this.setState({minContribution:e.target.value});
                            }}
                            required
                        />
                        <br></br>
                        <br></br>
                        <TextField
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            fullWidth
                            rows={4}
                            onChange = {(e)=>{
                                this.setState({description:e.target.value});
                            }}
                            variant="outlined"
                            required
                        />
                        <br></br>
                        <br></br>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            align="left"
                        >
                            Create Campaign
                        </Button>
                        <br></br>

                    </form>
                </div>  
                <br></br>
                <h1>Campaigns</h1>
                <CampaignRow campaigns = {this.props.campaigns} names = {this.props.names} descriptions = {this.props.descriptions}/>
            </div>
           
        );
    }
}

export default Home;