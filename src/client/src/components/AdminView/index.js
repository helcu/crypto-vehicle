import React from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';
import {
  Button, TableBody, Paper, Typography,
  Table, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import AdminRow from '../AdminRow/index.js';


class AdminView extends React.Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts
    //var methodArgs = this.props.methodArgs ? this.props.methodArgs : []

    this.state = {
      stackId: this.props.stackId,
      addresses: []
    };
  }

  componentDidMount = async () => {
    this.getEmployeesAddresses();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.stackId !== prevState.stackId) {
      return {
        stackId: nextProps.stackId
      };
    }
    else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.stackId !== this.state.stackId) {
      this.setState({
        ...prevProps,
        ...this.props
      }, async () => {
        var timer = setTimeout(
          async () => {
            const stackId = await this.watchChange();
            console.log("stackId", stackId);
            if (stackId === -1) {
              clearTimeout(timer);
            }
          }, 1000);
      });
    }
  }

  getEmployeesAddresses = async () => {
    const addresses = await this.contracts[this.props.contract].methods.getOnlyAdministratorsAddresses().call();
    this.setState({
      addresses: addresses
    });
  }

  watchChange = async () => {
    return new Promise((resolve, reject) => {
      var state = this.context.drizzle.store.getState();
      if (state.transactionStack[this.state.stackId]) {
        console.log(state.transactions[state.transactionStack[this.state.stackId]].status);
        if (state.transactions[state.transactionStack[this.state.stackId]].status === "success") {
          this.setState({
            stackId: -1
          }, async () => {
            console.log("watchChange: after", this.state.stackId);
            await this.getEmployeesAddresses();
            resolve(this.state.stackId);
          });
        }
        resolve(this.state.stackId);
      }
    });
  }

  render() {

    const displayListItems = this.state.addresses.map((datum, index) => (
      <AdminRow key={datum} contract="VehicleFactory" address={datum} updateStates={this.props.updateStates} />
    ));
    console.log(this.state.addresses);

    return (
      <Paper style={{ padding: 24, marginTop: 48, marginLeft: 144, marginRight: 144 }}>
        <Typography variant="title" color="primary"
          style={{ display: "inline-block", margin: "5px", width: "92%" }}>
          Administradores
        </Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
          <Button component={Link} to="admins/add" variant="contained"
            size="large" color="primary" style={{ marginBottom: 20 }}>
            AGREGAR
          </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#37474F' }}>
              <TableCell style={{ color: 'white' }}>DNI</TableCell>
              <TableCell style={{ color: 'white' }}>Nombre</TableCell>
              <TableCell style={{ width: 150, color: 'white', textAlign: 'center' }}>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayListItems}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

AdminView.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    contracts: state.contracts,
    drizzleStatus: state.drizzleStatus,
    SimpleStorage: state.contracts.SimpleStorage
  }
}

export default drizzleConnect(AdminView, mapStateToProps);