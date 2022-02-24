import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card,Table } from 'semantic-ui-react';

class CampaignRow extends Component{

    constructor(props){
        super(props);
    }

    renderCampaigns(){
        return (
            <div>
            <br></br>
                {this.props.campaigns.map((campaign,index)=>{
                    return (
                        <div>
                        
                            <Card fluid
                                href={`/campaign/${campaign}`}
                                header={this.props.names[index]}
                                description={this.props.descriptions[index]}
                            />

                            <br></br>
                                
                        </div>
                    );
                })}
            </div>
        );
    }
    
    render(){
        return (
            <div>
                {this.renderCampaigns()}
            </div>
        );
    }
}

export default CampaignRow;