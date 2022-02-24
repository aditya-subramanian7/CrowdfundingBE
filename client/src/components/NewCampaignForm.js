import React,{Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

class NewCampaignForm extends Component{
    render(){
        return(
            <div className = "App">
                <TextField
                    id="outlined-multiline-static"
                    label="Campaign Name"
                    multiline
                    rows={4}
                    // defaultValue="Campaign Name"
                    variant="outlined"
                />
            </div>
        );
    }
}

export default NewCampaignForm;