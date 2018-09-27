import React, {Component} from 'react'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import web3 from 'web3'

class DrizzleMaterialForm extends React.Component {
	constructor(props, context){
		super(props);
		console.log(this.props)
        this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		// names is use to store the names of the properties of this.params.location.state
		this.names = ["address", "dni", "name"]
	    
	    this.contracts = context.drizzle.contracts;
	    const abi = this.contracts[this.props.contract].abi;

	    this.inputs = [];
	    var initialState = {};

	    for (var i = 0; i < abi.length; i++) {
	        if (abi[i].name === this.props.method) {
	            this.inputs = abi[i].inputs;
	            for (var i = 0; i < this.inputs.length; i++) {
					//If we have params we retrieve the data
	                initialState[this.inputs[i].name] = this.props.params?this.props.params.location.state[this.names[i]]:'';
	            }
	            break;
	        }
	    }

		this.state = initialState;
	}

	handleSubmit(e) {
		
		var errors = false;
		var message = "";
		for(var i = 0; i < this.inputs.length; i++){
			if(this.state[this.inputs[i].name] === '')
			{
				e.preventDefault();
				message += "Debes completar el campo " + this.names[i] + "\n";
				errors = true;
			}
		}
		if(!errors){
			if (this.props.sendArgs) {
			return this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(this.state), this.props.sendArgs);
			}
			this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(this.state));
		}else{
			alert(message)
		}
	}

	handleInputChange(event) {
		if(event.target.name === "_dni" || event.target.name === "_name"){
			this.setState({ [event.target.name]: this.context.drizzle.web3.utils.fromAscii(event.target.value, 32)});
		}else{
	    	this.setState({ [event.target.name]: event.target.value });
		}
	}


	render(){

		return (
			<div style={{width: "100%", textAlign: "center"}}>
			<Paper style={{ /*width: 500, height: 400,*/ padding: 0.25, display: "inline-block", textAlign: "initial" }} elevation={1}>
				<div style={{margin: 25}}>
					<Typography variant="title" align="center">
						{this.props.title}
					</Typography>
					{this.inputs.map((input,index) => {
						var inputType = this.props.inputTypes ? this.props.inputTypes[index] : input.name;
						var maxInputLength = this.props.lenghts ? this.props.lenghts[index] : 255;
						var inputLabel = this.props.labels ? this.props.labels[index] : input.name;
						var asciiValue = "";
						if(index === 0)
						  	asciiValue=this.state[input.name]
						else{
							if(this.state[input.name])
								asciiValue = this.context.drizzle.web3.utils.toUtf8(this.state[input.name])
							else
								asciiValue+"0x00000000000000000000"
						}
						return (
							<div key={index}>
							<TextField
							  required
							  type={inputType}
							  name={input.name}
					          id={input.name}
					          label={inputLabel}
					          placeholder={inputLabel}
					          margin="normal"
					          style={{margin: 10}}
					          inputProps={{
		    					maxLength: maxInputLength,
		  					  }}
		  					  helperText="32 char max"
		  					  margin="normal"
		  					  value={asciiValue}
		  					  onChange={this.handleInputChange}
			      			/>
			      			<br/>
			      			</div>
						)
					})}
	      			<Button key="submit" component={Link} to={this.props.to} variant="contained" size="large" color="primary" style={{marginRight: 20}} onClick={this.handleSubmit}>
          				Save
        			</Button>
	      			<Button component={Link} to={this.props.to} variant="contained" size="large" color="primary" style={{marginLeft: 20}}>
          				Cancel
        			</Button>
				</div>
			</Paper>
			</div>       
		)
	}
}

DrizzleMaterialForm.contextTypes = {
	drizzle: PropTypes.object
}

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
	}
}

export default drizzleConnect(DrizzleMaterialForm, mapStateToProps)