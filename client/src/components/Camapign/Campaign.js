import React,{Component} from 'react';
import web3 from '../../getWeb3';
import getCampaignInstance from '../../contracts/getCampaignInstance';
import { TextField,Button } from '@material-ui/core';
import { Card,Grid } from 'semantic-ui-react';

class Campaign extends Component{

    constructor(props){
        super(props);

        this.state = {
            campaign: this.props.match.params.id,
            name: "",
            totalContribution: "",
            contributionAmount: "",
            owner: null,
            minContribution: "",
            withdrawals: [],
            description: "",
            withdrawalValue: null,
            recipient: null,
            account: null,
            contributors: null,
            campaignDescription: "",
        }
    }

    async componentDidMount(){
        await this.loadCampaignDetails();
    }

    async loadCampaignDetails(){
        const currCampaignInstance = await getCampaignInstance(web3,this.state.campaign);
        const responseName = await currCampaignInstance.methods.campaignName().call();
        const responseDescription = await currCampaignInstance.methods.description().call();
        const responseOwner = await currCampaignInstance.methods.owner().call();
        const responseTotalContribution = await currCampaignInstance.methods.totalContribution().call();
        const totalContributionInEth = web3.utils.fromWei(responseTotalContribution, 'ether');
        const responseMinContribution = await currCampaignInstance.methods.minimumContribution().call();
        const accounts = await web3.eth.getAccounts(); 
        const withdrawalCount = await currCampaignInstance.methods.withdrawalCount().call();
        const contributorsCount = await currCampaignInstance.methods.contributorsCount().call();
        const responseWithdrawals = [];
        const responseContributors = [];
        
        for(var i = 0;i<withdrawalCount;i++){
            responseWithdrawals.push(await currCampaignInstance.methods.withdrawals(i).call());
        }

        for(var i = 0;i<contributorsCount;i++){
            responseContributors.push(await currCampaignInstance.methods.contributorAddresses(i).call());
        }

        this.setState({
            name: responseName,
            totalContribution: totalContributionInEth,
            owner: responseOwner,
            minContribution: responseMinContribution,
            account: accounts[0],
            withdrawals: responseWithdrawals,
            contributors: responseContributors,
            campaignDescription: responseDescription
        });

        // console.log(await currCampaignInstance.methods.contributors(responseContributors[0]).call());

        console.log(this.state);
    }

    async contribute(){
        
        const currCampaignInstance = await getCampaignInstance(web3,this.state.campaign);

        await currCampaignInstance.methods.contribute().send({
            from: this.state.account,
            value : this.state.contributionAmount
        }); 
    }

    async createWithdrawal(){
        
        const currCampaignInstance = await getCampaignInstance(web3,this.state.campaign);
        const invalid = await currCampaignInstance.methods.contributors(this.state.recipient).call()

        if(this.state.recipient === this.state.owner || invalid==true){
            console.log("Recipient address is same as the owner or donor");
        }
        else{
            const currCampaignInstance = await getCampaignInstance(web3,this.state.campaign);
            const accounts = await web3.eth.getAccounts();


            await currCampaignInstance.methods.createWithdrawal(
                this.state.description,
                this.state.withdrawalValue,
                this.state.recipient
            )
            .send({from : accounts[0]});
        }
        
    }

    renderSpendingRequest(){
        if(this.state.account === this.state.owner){
            return(
                <div>
                    <h1>Create Withdrawal Requests</h1>
                    <form onSubmit={(event)=>{
                        event.preventDefault();
                        this.createWithdrawal();
                    }}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Amount (In Wei)"
                            multiline
                            maxRows={4}
                            onChange = {(e)=>{
                                this.setState({
                                    withdrawalValue: e.target.value
                                });
                            }}
                            required
                        />
                        <br></br>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Description"
                            multiline
                            fullWidth
                            maxRows={4}
                            onChange = {(e)=>{
                                this.setState({
                                    description: e.target.value
                                });
                            }}
                            required
                        />
                        <br></br>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Recipient Address"
                            multiline
                            maxRows={4}
                            onChange = {(e)=>{
                                this.setState({
                                    recipient: e.target.value
                                });
                            }}
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
                            Request
                        </Button>

                    </form>  
                </div>
            );
        }
        
    }

    renderWithdrawalRequests(){

        return(
            <div>
                <h1>Withdrawal Requests</h1>
                {this.state.withdrawals.map((withdrawal,index)=>{
                    console.log("index "+index);
                    return (
                        <div> 
                            <h3>Withdrawal Amount : {withdrawal.value}</h3>
                            <h3>Description : {withdrawal.description}</h3>
                            <h3>Approval Percentage : {withdrawal.approvalCount}</h3>
                            <h3>Recipient : {withdrawal.recipient}</h3>
                            {this.renderStatus(withdrawal.complete)}
                            {this.renderApprove(index)}
                            <br></br>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderStatus(complete){
        if(complete){
            return (
                <h3>Status: Complete</h3>
            );
        }
        else{
            return (
                <h3>Status: Pending</h3>
            );
        }
    }

    renderApprove(index){
        if(this.state.owner==this.state.account){
            return(
                <div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        align="left"
                        onClick={(event)=>{
                            event.preventDefault();
                            this.finalize(index);
                        }}
                    >
                        Finalize
                    </Button>
                </div>
            );
        }
        else{
            return(
                <div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        align="left"
                        onClick={(event)=>{
                            event.preventDefault();
                            this.approve(index);
                        }}
                    >
                        Approve
                    </Button>
                </div>
            );
        }
    }

    async approve(index){
        const currCampaignInstance = await getCampaignInstance(web3,this.state.campaign);
        const accounts = await web3.eth.getAccounts();

        await currCampaignInstance.methods.approveWithdrawal(index).send({from:accounts[0]});
    }

    async finalize(index){
        const currCampaignInstance = await getCampaignInstance(web3,this.state.campaign);
        const accounts = await web3.eth.getAccounts();

        await currCampaignInstance.methods.finalizeWithdrawal(index).send({from:accounts[0]});
    }

    render(){
        return (
            <div className = "App">
                <h1>{this.state.name}</h1>
                <br></br>

                <Grid columns={3}>
                    <Grid.Row>
                        <Grid.Column>
                            <Card>
                                <Card.Content>
                                    <Card.Header>{this.state.owner}</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Address of the owner</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        The owner created the campaign and can create requests to withdraw money
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>

                        <Grid.Column>
                            <Card>
                                <Card.Content>
                                    <Card.Header>{this.state.minContribution}</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Minimum contribution amount</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        This is the minimum amount of money that can be donated to the campaign
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column>
                            <Card>
                                <Card.Content>
                                    <Card.Header>{this.state.totalContribution} (ETH)</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Campaign Balance</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        The total amount that has been contributed to the campaign until now
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>Description</Card.Header>
                        <Card.Description>
                            {this.state.campaignDescription}
                        </Card.Description>
                    </Card.Content>
                </Card>

                <br></br>
                <br></br>
                <br></br>
                
                <div>
                    <h1>Contribute</h1>
                    <form onSubmit={(event)=>{
                        event.preventDefault();
                        this.contribute();
                    }}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Amount (In Wei)"
                            multiline
                            maxRows={4}
                            onChange = {(e)=>{
                                this.setState({
                                    contributionAmount: e.target.value
                                });
                            }}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            align="left"
                        >
                            Contribute
                        </Button>

                    </form>  
                </div>
                <br></br>

                
                {this.renderSpendingRequest()}

                <br></br>

                {this.renderWithdrawalRequests()}

            </div>
        );
    }
}

export default Campaign;