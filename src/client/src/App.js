import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {
  CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider,
  IconButton, Badge, Button, Popover, CircularProgress
} from '@material-ui/core';

import {
  ListItem, ListItemIcon, ListItemText
} from '@material-ui/core';

import ClassIcon from '@material-ui/icons/Class';
import BuildIcon from '@material-ui/icons/Build';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { dashboardListItems, mainListItems, secondaryListItems } from './components/ListItem';
import { Route, Switch, Redirect } from 'react-router-dom';

import RegisterView from './components/RegisterView'
import SearchView from './components/SearchView'
import HomeView from './components/HomeView'
import UpdateView from './components/UpdateView'
import AdminView from './components/AdminView';
import DrizzleMaterialForm from './components/DrizzleMaterialForm';
import EmployeeView from './components/EmployeeView';

import Particles from 'react-particles-js'

import getWeb3 from './utils/getWeb3'

import VehicleFactoryContract from './buildContracts/VehicleFactory.json'


const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  }
});

const operation = {
  status: {
    onPending: 'onPending',
    onSuccess: 'onSuccess'
  },
  eventType: {
    VehicleRegistered: 'VehicleRegistered',
    VehicleUpdated: 'VehicleUpdated'
  }
};


let firstImpression = true;

class Main extends React.Component {
  state = {
    open: true,
    openPopOver: false,
    home: false,
    stackId: -1,
    logs: [],
    web3: null,
    vehicleFactoryInstance: null
  };

  anchorEl = null;

  componentDidMount = async () => {
    let results = await getWeb3
      .catch(() => {
        console.warn('Error finding web3.')
      });

    await this.setState({
      web3: results.web3
    }, () => {
      this.initContracts();
    });
  }

  initContracts = async () => {
    const contract = require('truffle-contract');
    const vehicleFactory = contract(VehicleFactoryContract);
    vehicleFactory.setProvider(this.state.web3.currentProvider);
    const vehicleFactoryInstance = await vehicleFactory.deployed();
    await this.setState({
      vehicleFactoryInstance: vehicleFactoryInstance
    }, async () => {
      //this.watchForRegisterLog();
      //this.watchForUpdateLog();
      //this.watchForAllLog();

      var account = (await this.getAccounts())[0];
      setInterval(async () => {
        var accounts = await this.getAccounts();
        if (accounts[0] !== account) {
          window.location.reload();
        }
      }, 3000);
    });
  }

  getAccounts = async () => {
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getAccounts(async (error, accounts) => {
        if (error) {
          reject(error);
        }
        resolve(accounts);
      });
    });
  }

  watchForRegisterLog = async () => {
    const web3 = this.state.web3;
    var accounts = await this.getAccounts();
    console.log(accounts);

    if (!accounts || !accounts[0]) {
      console.log("There is no account.");
      this.setState({
        dialog: {
          open: true,
          title: 'Sin cuenta activa',
          description: 'Ninguna cuenta está conectada. Por favor, inicie sesión.'
        }
      });
      return false;
    }

    let vehicleRegisteredEvent = this.state.vehicleFactoryInstance.VehicleRegistered(
      { employeeAddress: accounts[0] },
      { toBlock: 'latest' }
    );

    vehicleRegisteredEvent.watch((error, log) => {
      if (error) {
        return;
      }

      if (firstImpression) {
        firstImpression = false;
        console.log(firstImpression);
        return;
      }

      const vehicle = log.args;
      const vehicleLogs = {
        event: log.event,
        blockHash: log.blockHash,
        transactionHash: log.transactionHash,
        vehicle: {
          numberPlate: web3.toAscii(vehicle.numberPlate),
          marca: web3.toAscii(vehicle.brand),
          modelo: web3.toAscii(vehicle.model),
          color: web3.toAscii(vehicle.color),
          serialNumber: web3.toAscii(vehicle.serialNumber),
          motorNumber: web3.toAscii(vehicle.motorNumber),
          reason: web3.toAscii(vehicle.reason),
          photos: vehicle.photos,
          documents: vehicle.documents,
          owners: this.getOwnersFromContract(this.elementsToAscii(vehicle.ownersId), this.elementsToAscii(vehicle.ownersNames)),
          employeeAdress: vehicle.employeeAddress
        }
      }

      this.setState({
        loading: false,
        success: true,
      });

      this.insertLog(log);

      console.log("watchForRegisterLog", vehicleLogs);
      //vehicleRegisteredEvent.stopWatching();
    });
  }

  watchForUpdateLog = async () => {
    const web3 = this.state.web3;
    const accounts = await this.getAccounts();

    if (!accounts || !accounts[0]) {
      console.log("There is no account.");
      this.setState({
        dialog: {
          open: true,
          title: 'Sin cuenta activa',
          description: 'Ninguna cuenta está conectada. Por favor, inicie sesión.'
        }
      });
      return false;
    }

    let vehicleUpdateEvent = this.state.vehicleFactoryInstance.VehicleUpdated(
      { employeeAddress: accounts[0] },
      { toBlock: 'pending' }
    );

    vehicleUpdateEvent.watch((error, log) => {
      if (error) {
        return;
      }

      if (firstImpression) {
        firstImpression = false;
        console.log(firstImpression);
        return;
      }

      const vehicle = log.args;
      const vehicleLogs = {
        event: log.event,
        blockHash: log.blockHash,
        transactionHash: log.transactionHash,
        vehicle: {
          numberPlate: web3.toAscii(vehicle.numberPlate),
          color: web3.toAscii(vehicle.color),
          serialNumber: web3.toAscii(vehicle.serialNumber),
          motorNumber: web3.toAscii(vehicle.motorNumber),
          reason: web3.toAscii(vehicle.reason),
          photos: vehicle.photos,
          documents: vehicle.documents,
          owners: this.getOwnersFromContract(this.elementsToAscii(vehicle.ownersId), this.elementsToAscii(vehicle.ownersNames)),
          employeeAdress: vehicle.employeeAddress
        }
      }

      this.setState({
        loading: false,
        success: true,
      });

      this.insertLog(log);

      console.log("watchForUpdateLog", vehicleLogs);
      //vehicleUpdateEvent.stopWatching();
    });
  }

  watchForAllLog = async () => {
    this.state.vehicleFactoryInstance.allEvents().watch(async (error, log) => {
      if (error) {
        return;
      }

      if (firstImpression) {
        firstImpression = false;
        console.log(firstImpression);
        return;
      }

      await this.insertLog(log);
    });
  }

  insertLog = async (log) => {
    return new Promise(async (resolve, reject) => {

      const sameTransaction = this.state.logs.filter((l) => {
        return l.transactionHash === log.transactionHash;
      });

      if (sameTransaction.length === 0) {
        this.setState({
          logs: [
            {
              numberPlate: log.numberPlate,
              event: log.event,
              status: operation.status.onPending,
              timestamp: this.getDateFormat(log.timestamp),
              transactionHash: log.transactionHash
            },
            ...this.state.logs]
        }, () => {
          console.log("insertLog: push: ", this.state);
          resolve();
        });
      } else {

        let logs = this.state.logs.map((l) => {
          if (l.transactionHash === log.transactionHash) {
            return {
              ...l,
              status: operation.status.onSuccess,
              timestamp: this.getDateFormat(log.timestamp)
            }
          } else {
            return l;
          }
        });

        this.setState({
          logs: logs
        }, () => {
          console.log("insertLog: updt: ", this.state);
          resolve();
        });
      }
    });
  }

  getInfoFromRegisterLog = async (log) => {
    const web3 = this.state.web3;
    const block = await this.getBlock(log.blockNumber);
    const vehicle = log.args;
    return {
      event: log.event,
      blockHash: log.blockHash,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      gasUsed: block.gasUsed,
      timestamp: block.timestamp,
      vehicle: {
        numberPlate: web3.toAscii(vehicle.numberPlate).replace(/ /g, ''),
        marca: web3.toAscii(vehicle.brand).replace(/ /g, ''),
        modelo: web3.toAscii(vehicle.model).replace(/ /g, ''),
        color: web3.toAscii(vehicle.color).replace(/ /g, ''),
        serialNumber: web3.toAscii(vehicle.serialNumber).replace(/ /g, ''),
        motorNumber: web3.toAscii(vehicle.motorNumber).replace(/ /g, ''),
        reason: web3.toAscii(vehicle.reason).replace(/ /g, ''),
        photos: vehicle.photos,
        documents: vehicle.documents,
        owners: this.getOwnersFromContract(this.elementsToAscii(vehicle.ownersId), this.elementsToAscii(vehicle.ownersNames)),
        employeeAddress: vehicle.employeeAddress
      }
    }
  }

  getInfoFromUpdateLog = async (log) => {
    const web3 = this.state.web3;
    const block = await this.getBlock(log.blockNumber);
    const vehicle = log.args;
    return {
      event: log.event,
      blockHash: log.blockHash,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      gasUsed: block.gasUsed,
      timestamp: block.timestamp,
      vehicle: {
        numberPlate: web3.toAscii(vehicle.numberPlate).replace(/ /g, ''),
        color: web3.toAscii(vehicle.color).replace(/ /g, ''),
        serialNumber: web3.toAscii(vehicle.serialNumber).replace(/ /g, ''),
        motorNumber: web3.toAscii(vehicle.motorNumber).replace(/ /g, ''),
        reason: web3.toAscii(vehicle.reason).replace(/ /g, ''),
        photos: vehicle.photos,
        documents: vehicle.documents,
        owners: this.getOwnersFromContract(this.elementsToAscii(vehicle.ownersId), this.elementsToAscii(vehicle.ownersNames)),
        employeeAddress: vehicle.employeeAddress
      }
    }
  }

  getBlock = async (blockNumber) => {
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getBlock(blockNumber, false, (error, block) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          gasUsed: block.gasUsed,
          timestamp: this.getDateFormat(block.timestamp)
        });
      })
    });
  }

  getDateFormat = (timestamp = 0) => {
    var x = new Date(timestamp * 1000);
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    var hh = x.getHours().toString();
    var mm = x.getMinutes().toString();
    var ss = x.getSeconds().toString();
    (d.length === 1) && (d = '0' + d);
    (m.length === 1) && (m = '0' + m);
    (hh.length === 1) && (hh = '0' + hh);
    (mm.length === 1) && (mm = '0' + mm);
    (ss.length === 1) && (ss = '0' + ss);
    return d + '/' + m + '/' + y + ' - ' + hh + ':' + mm + ':' + ss;
  }

  elementsToAscii = (_hexArray) => {
    return _hexArray.map((e) => {
      return this.state.web3.toAscii(e).replace(/ /g, '');
    });
  }

  getOwnersFromContract = (ownersId, ownersName) => {
    return ownersId.map((e, i) => {
      return {
        dni: e,
        name: ownersName[i]
      }
    });
  }

  updateLogState = async (log, callback) => {
    await this.insertLog(log);
  }

  updateStates = (newObject, callback) => {
    this.setState({
      ...newObject,
      disabled: false
    }, () => {
      if (callback) {
        callback();
      }
    });
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  setHomeFalse = () => {
    this.setState({ home: false });
  };

  handleNotificationsClickButton = () => {
    this.setState({
      openPopOver: true,
    });
  };

  handlePopOverClose = () => {
    this.setState({
      openPopOver: false,
    });
  };


  render() {
    const { classes } = this.props;
    const {
      openPopOver, logs
    } = this.state;


    if (this.state.home) {
      return (
        <div>
          <div id="particles-js">
            <Particles
              params={{
                particles: {
                  number: {
                    value: 25,
                    density: {
                      enable: true,
                      value_area: 800
                    }
                  }
                }
              }}
            />
          </div>
          <div id="message">
            <Typography variant="headline" align="center">CryptoVehicle</Typography>
            <br />
            <Typography variant="body2" align="center">¡Bienvenido!</Typography>
            <Button variant="contained" size="large" style={{ backgroundColor: "#3f51b5", color: "white" }} onClick={this.setHomeFalse}>
              Continuar
            </Button>
          </div>
        </div>
      )
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
            <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden,
                )}>
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap className={classes.title}>
                CryptoVehicle
              </Typography>
              <IconButton
                color="inherit"
                buttonRef={node => {
                  this.anchorEl = node;
                }}
                onClick={this.handleNotificationsClickButton}>
                <Badge
                  badgeContent={logs.length}
                  color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Popover
            open={openPopOver}
            anchorEl={this.anchorEl}
            anchorReference={'anchorEl'}
            anchorPosition={{ top: 200, left: 400 }}
            onClose={this.handlePopOverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}>

            <List>
              {
                this.state.logs.length === 0 ? (
                  <ListItem
                    button>
                    <ListItemIcon>
                      <BlurOnIcon />
                    </ListItemIcon>
                    <ListItemText primary={"-- Sin operaciones --"} />
                  </ListItem>
                ) :
                  this.state.logs.map((log, index) => (
                    <ListItem
                      key={log.numberPlate + log.transactionHash}
                      button>
                      <ListItemIcon>
                        {
                          log.status === operation.status.onPending ?
                            <CircularProgress
                              size={20}
                              thickness={5} /> :
                            log.event === 'VehicleRegistered' ?
                              <ClassIcon /> :
                              <BuildIcon />
                        }
                      </ListItemIcon>
                      {
                        log.status === operation.status.onPending ?
                          <ListItemText primary={log.numberPlate} secondary={'........... Pendiente ...........'} /> :
                          <ListItemText primary={log.numberPlate} secondary={log.timestamp} />
                      }
                    </ListItem>
                  ))
              }
            </List>
          </Popover>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}>
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            {dashboardListItems}
            <Divider />
            {mainListItems}
            <Divider />
            {secondaryListItems}
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Switch>
              <Route
                exact
                path="/home"
                component={HomeView} />
              <Route
                exact
                path="/register"
                render={(props) =>
                  <RegisterView {...props}
                    updateLogState={this.updateLogState} />} />
              <Route
                exact
                path="/search"
                component={SearchView} />
              <Route
                exact
                path="/update/:id"
                render={(props) => <UpdateView {...props}  />} />
              <Route
                exact
                name="adminEdit"
                path="/admins/edit"
                render={(state) =>
                  <DrizzleMaterialForm params={state} contract="VehicleFactory" method="setAdministrator"
                    title="Editar administrador" to="/admins" labels={["Address", "DNI", "Nombre"]}
                    inputTypes={["text", "text", "text"]} updateStates={this.updateStates}
                    disabled={true} />} />
              <Route
                exact
                path="/admins/add"
                render={() =>
                  <DrizzleMaterialForm contract="VehicleFactory" method="setAdministrator"
                    title="Registrar administrador" to="/admins" labels={["Address", "DNI", "Nombre"]}
                    inputTypes={["text", "text", "text"]} updateStates={this.updateStates} />} />
              <Route
                exact
                path="/admins"
                render={() =>
                  <AdminView contract="VehicleFactory" method="getEmployeesAdress"
                    stackId={this.state.stackId} updateStates={this.updateStates} />} />
              <Route
                exact
                path="/employees/edit"
                render={(state) =>
                  <DrizzleMaterialForm params={state} contract="VehicleFactory" method="setEmployee"
                    title="Editar trabajador" to="/employees" labels={["Address", "DNI", "Nombre"]}
                    inputTypes={["text", "text", "text"]} updateStates={this.updateStates}
                    disabled={true} />} />
              <Route
                exact
                path="/employees/add"
                render={() =>
                  <DrizzleMaterialForm contract="VehicleFactory" method="setEmployee"
                    title="Registrar trabajador" to="/employees" labels={["Address", "DNI", "Nombre"]}
                    inputTypes={["text", "text", "text"]} updateStates={this.updateStates} />} />
              <Route
                exact
                path="/employees"
                render={() =>
                  <EmployeeView contract="VehicleFactory" method="getEmployeesAdress"
                    stackId={this.state.stackId} updateStates={this.updateStates} />} />
              <Redirect
                exact
                from="/"
                to="/home" />
              <Route
                render={() => <p>  Error </p>} />
            </Switch>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);