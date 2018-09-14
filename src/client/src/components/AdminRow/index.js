import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import web3 from 'web3';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import TableRow from '@material-ui/core/TableRow';

class AdminRow extends React.Component {
	constructor(props, context){
		super(props);
		this.strorage = context
		this.contracts = context.drizzle.contracts
		this.displayData = {};
		this.dataKey = this.contracts[this.props.contract].methods.getEmployee.cacheCall(this.props.address,{address:this.props.address});
		this.state = this.displayData;
	}
	/*displayData is an object made from the return of getEmployee function in the contract
	/*Therefore, calling displayData[0] will return dni, displyData[1] will return name and so on
	*/
	render(){
		if(!(this.dataKey in this.props.contracts[this.props.contract]["getEmployee"])) {
			return (
			  <TableRow>
				  <TableCell>Loading...</TableCell>
				  <TableCell>Loading...</TableCell>
				  <TableCell>Loading...	</TableCell>
			  </TableRow>
			)
		  }
	  var i = 0
	  this.displayData = this.props.contracts[this.props.contract]["getEmployee"][this.dataKey].value
	  const displayObjectProps = []
		if(this.displayData[2]){
			Object.keys(this.displayData).forEach((key) => {
				if (i == key && i < 2) {
					displayObjectProps.push(
						<TableCell key={i}>{web3.utils.toAscii(this.displayData[key])}</TableCell>
						)
				}
				i++
			})
			displayObjectProps.push(
				<TableCell key="ico">
					<Link to={{pathname: 'admins/edit',state: {address: this.props.address, dni: this.displayData[0], name: this.displayData[1]}}}>
						<IconButton  aria-label="Edit"> 	
	        				<Edit />
	      				</IconButton>
					</Link>
	      			<IconButton onClick={() => {
					  this.contracts[this.props.contract].methods.removeAdministrator(this.props.address).send().then(()=>{
					  	})
					  }} 
					  aria-label="Delete">
	        			<Delete />
	      			</IconButton>
				</TableCell>
			)
			return(<TableRow>{displayObjectProps}</TableRow>)
		}else{
			return (null)
		}
	}
}

AdminRow.contextTypes = {
	drizzle: PropTypes.object
}

const mapStateToProps = state => {
	return{
		contracts: state.contracts,
		drizzleStatus: state.drizzleStatus,
    	SimpleStorage: state.contracts.SimpleStorage
	}
}

export default drizzleConnect(AdminRow,mapStateToProps);