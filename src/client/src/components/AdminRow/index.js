import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { TableRow, IconButton, TableCell } from '@material-ui/core';

class AdminRow extends React.Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts
    this.dataKey = this.contracts[this.props.contract].methods.getEmployee.cacheCall(this.props.address, { address: this.props.address });
    this.state = {
      employee: []
    }

    this.getEmployeeData();
  }
	/*displayData is an object made from the return of getEmployee function in the contract
	/*Therefore, calling displayData[0] will return dni, displyData[1] will return name and so on
  */

  getEmployeeData = async () => {
    const employee = await this.contracts[this.props.contract].methods.getEmployee(this.props.address).call();
    this.setState({
      employee: employee
    });
  }

  render() {
    
    if (!this.state.employee) {
      return (
        <TableRow>
          <TableCell>Loading...</TableCell>
          <TableCell>Loading...</TableCell>
          <TableCell>Loading...	</TableCell>
        </TableRow>
      )
    }

    if (this.state.employee.length !== 0) {

      var i = 0
      //this.displayData = this.props.contracts[this.props.contract]["getEmployee"][this.dataKey].value
      const displayObjectProps = []
      Object.keys(this.state.employee).forEach((key) => {
        if (i == key && i < 2) {
          displayObjectProps.push(
            <TableCell key={i}>{this.context.drizzle.web3.utils.toAscii(this.state.employee[key])}</TableCell>
          )
        }
        i++
      })
      displayObjectProps.push(
        <TableCell key="ico">
          <Link
            to={{
              pathname: 'admins/edit',
              state: {
                address: this.props.address,
                dni: this.context.drizzle.web3.utils.toUtf8(this.state.employee[0]),
                name: this.context.drizzle.web3.utils.toUtf8(this.state.employee[1])
              }
            }}>
            <IconButton aria-label="EDITAR">
              <Edit />
            </IconButton>
          </Link>
          <IconButton
            onClick={async () => {
              const cachedSend = await this.contracts[this.props.contract].methods.removeAdministrator.cacheSend(this.props.address);
              console.log("cachedSend", cachedSend);
              this.props.updateStates({
                stackId: cachedSend
              });
            }}
            aria-label="ELIMINAR">
            <Delete />
          </IconButton>
        </TableCell>
      )
      return (<TableRow>{displayObjectProps}</TableRow>);
    } else {
      return (
        null
      );
    }
  }
}

AdminRow.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    contracts: state.contracts,
    drizzleStatus: state.drizzleStatus,
    SimpleStorage: state.contracts.SimpleStorage
  }
}

export default drizzleConnect(AdminRow, mapStateToProps);