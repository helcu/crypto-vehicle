import React from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';
import Button from '@material-ui/core/Button';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import { Link } from 'react-router-dom';
import EmployeeRow from '../EmployeeRow/index.js';

class EmployeeView extends React.Component{
    constructor(props,context){
		super(props)
		this.contracts = context.drizzle.contracts
		var methodArgs = this.props.methodArgs ? this.props.methodArgs : []
		this.dataKey = this.contracts[this.props.contract].methods[this.props.method].cacheCall(...methodArgs)
	}
	
	render(){
		if(!(this.dataKey in this.props.contracts[this.props.contract][this.props.method])) {
			return (
			  <span>Fetching...</span>
			)
		  }
		var displayData = this.props.contracts[this.props.contract][this.props.method][this.dataKey].value

	    if (displayData instanceof Array){
	    	const displayListItems = displayData.map((datum, index) => (
	    		<EmployeeRow key={index} contract="Authorizable" address={datum}/>
	    	))

	    	return(
	    		<Paper style={{padding: 24}}>
					<Typography variant="title" color="primary" style={{display:"inline-block", margin: "5px", width: "92%"}}>Employees</Typography>
					<Button component={Link} to="employees/add" variant="outlined" color="primary" style={{margin: "5px"}}>
        				Add
      				</Button>
					  <Table>
						  <TableHead>
						  	<TableRow style={ {backgroundColor: '#3f51b5' }}>
								<TableCell style={{color: 'white'}}>dni</TableCell>
								<TableCell style={{color: 'white'}}>name</TableCell>
								<TableCell style={{ width: 150 }}></TableCell>
							</TableRow>
						  </TableHead>
						  <TableBody>
							  {displayListItems}
						  </TableBody>
					  </Table>
				</Paper>
	    	)
	    }
		return (null)
	}
}

EmployeeView.contextTypes = {
	drizzle: PropTypes.object
}

const mapStateToProps = state => {
	return{
		contracts: state.contracts
	}
}

export default drizzleConnect(EmployeeView,mapStateToProps);