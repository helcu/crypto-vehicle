import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InfoIcon from '@material-ui/icons/Info';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import Grid from '@material-ui/core/Grid';

import getWeb3 from '../../utils/getWeb3'

import VehicleFactoryContract from './../../buildContracts/VehicleFactory.json'


const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '20%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '50%',
    color: theme.palette.text.secondary,
  },
  tertiaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  header: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '20%',
    flexShrink: 0,
  },
  secondaryHeader: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '50%'
  },
  tertiaryHeader: {
    fontSize: theme.typography.pxToRem(15)
  }
});

let vehicleRegisteredEventWatcher, vehicleUpdateEventWatcher, vehicleAllEventWatcher;

const events = {
  names: {
    VehicleRegistered: 'REGISTRO',
    VehicleUpdated: 'ACTUALIZACIÓN'
  },
  realNames: {
    VehicleRegistered: 'VehicleRegistered',
    VehicleUpdated: 'VehicleUpdated'
  }
};

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


class HomeView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      expanded: null,
      value: 0,
      logs: [],
      web3: null,
      vehicleFactoryInstance: null
    };
  }

  componentDidMount = async () => {
    let results = await getWeb3
      .catch(() => {
        console.log('Error finding web3.')
      });

    await this.setState({ web3: results.web3 }, () => {
      this.initContracts();
    });
  }

  componentWillUnmount = () => {
    if (vehicleRegisteredEventWatcher) {
      console.log("vehicleRegisteredEventWatcher: stopWatching");
      vehicleRegisteredEventWatcher.stopWatching();
    }
    if (vehicleUpdateEventWatcher) {
      console.log("vehicleUpdateEventWatcher: stopWatching");
      vehicleUpdateEventWatcher.stopWatching();
    }
    if (vehicleAllEventWatcher) {
      console.log("vehicleAllEventWatcher: stopWatching");
      vehicleAllEventWatcher.stopWatching();
    }
  }

  initContracts = async () => {
    const contract = require('truffle-contract');
    const vehicleFactory = contract(VehicleFactoryContract);
    vehicleFactory.setProvider(this.state.web3.currentProvider);
    const vehicleFactoryInstance = await vehicleFactory.deployed();
    await this.setState({
      vehicleFactoryInstance: vehicleFactoryInstance
    });

    // SearchView.js
    //const _numberPlate = 'AWS-321';
    //await this.getRegisterLogs(_numberPlate);
    //await this.getUpdateLogs(_numberPlate);
    await this.getAllLogs();
    //await this.watchForAllLog();
  }

  elementsToAscii = (_hexArray) => {
    return _hexArray.map((e) => {
      return this.state.web3.toAscii(e);
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

  getRegisterLogs = async (_numberPlate) => {
    const web3 = this.state.web3;
    const accounts = await web3.eth.accounts;

    if (!accounts || !accounts[0]) {
      console.log("There is no account.");
      return false;
    }

    let vehicleRegisteredEvent = this.state.vehicleFactoryInstance.VehicleRegistered(
      { numberPlate: web3.fromAscii(_numberPlate) },
      { fromBlock: 0, toBlock: 'latest' }
    );
    vehicleRegisteredEvent.get((error, logs) => {
      if (error) {
        console.warn(error);
        return;
      }
      logs.map(async (log) => {
        await this.insertLog(log);
      });
      vehicleRegisteredEvent.stopWatching();
    });
  }

  getUpdateLogs = async (_numberPlate) => {
    const web3 = this.state.web3;
    const accounts = await web3.eth.accounts;

    if (!accounts || !accounts[0]) {
      console.log("There is no account.");
      return false;
    }

    let vehicleUpdatedEvent = this.state.vehicleFactoryInstance.VehicleUpdated(
      { numberPlate: web3.fromAscii(_numberPlate) },
      { fromBlock: 0, toBlock: 'latest' }
    );
    vehicleUpdatedEvent.get((error, logs) => {
      if (error) {
        console.warn(error);
        return;
      }
      logs.map(async (log) => {
        await this.insertLog(log);
      });
      vehicleUpdatedEvent.stopWatching();
    });
  }

  getAllLogs = async () => {
    let vehicleAllEvent = this.state.vehicleFactoryInstance.allEvents(
      { fromBlock: 0, toBlock: 'latest' }
    );
    vehicleAllEvent.get(async (error, logs) => {
      if (error) {
        return;
      }
      logs.forEach(async (log, i) => {
        await this.insertLog(log);
      });
      vehicleAllEvent.stopWatching();
    });
  }

  watchForRegisterLog = async () => {
    vehicleRegisteredEventWatcher = this.state.vehicleFactoryInstance.VehicleRegistered(
      {},
      { toBlock: 'latest' }
    );
    vehicleRegisteredEventWatcher.watch(async (error, log) => {
      if (error) {
        return;
      }

      await this.insertLog(log);
    });
  }

  watchForUpdateLog = async () => {
    vehicleUpdateEventWatcher = this.state.vehicleFactoryInstance.VehicleUpdated(
      {},
      { toBlock: 'latest' }
    );
    vehicleUpdateEventWatcher.watch(async (error, log) => {
      if (error) {
        return;
      }

      await this.insertLog(log);
    });
  }

  watchForAllLog = async () => {
    vehicleAllEventWatcher = this.state.vehicleFactoryInstance.allEvents(
      { toBlock: 'latest' }
    );
    vehicleAllEventWatcher.watch(async (error, log) => {
      if (error) {
        return;
      }

      console.log("STATE: ", this.state);
      await this.insertLog(log);
    });
  }

  insertLog = async (log) => {
    return new Promise(async (resolve, reject) => {
      const isUnique = this.state.logs.filter((l) => {
        return l.transactionHash === log.transactionHash;
      });

      if (isUnique.length === 0) {
        switch (log.event) {
          case 'VehicleRegistered':
            log = await this.getInfoFromRegisterLog(log);
            break;
          case 'VehicleUpdated':
            log = await this.getInfoFromUpdateLog(log);
            break;
          default:
            reject();
            break;
        }

        let logs = this.state.logs;
        logs.unshift(log);

        this.setState({
          logs: logs
        }, () => {
          //console.log("STATE: ", this.state);
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
        numberPlate: web3.toAscii(vehicle.numberPlate),
        color: web3.toAscii(vehicle.color),
        serialNumber: web3.toAscii(vehicle.serialNumber),
        motorNumber: web3.toAscii(vehicle.motorNumber),
        reason: web3.toAscii(vehicle.reason),
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

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleTabsChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    const { value } = this.state;

    return (
      <div>
        <CssBaseline />

        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <ExpansionPanel>
              <ExpansionPanelSummary>
                <Typography className={classes.header}>
                  Placa
              </Typography>
                <Typography className={classes.secondaryHeader}>
                  Acción
              </Typography>
                <Typography className={classes.tertiaryHeader}>
                  Fecha
              </Typography>
              </ExpansionPanelSummary>
            </ExpansionPanel>
            {
              this.state.logs.map((log) => {
                return (
                  <ExpansionPanel
                    key={log.transactionHash}
                    expanded={expanded === log.transactionHash}
                    onChange={this.handleChange(log.transactionHash)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>
                        {log.vehicle.numberPlate}
                      </Typography>
                      <Typography className={classes.secondaryHeading}>
                        {events.names[log.event]}
                      </Typography>
                      <Typography className={classes.tertiaryHeading}>
                        {log.timestamp}
                      </Typography>
                    </ExpansionPanelSummary>
                    <Divider />
                    <ExpansionPanelDetails>
                      <div style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Tabs
                          centered
                          value={this.state.value}
                          onChange={this.handleTabsChange}
                          fullWidth
                          indicatorColor="primary"
                          textColor="primary">
                          <Tab icon={<DirectionsCarIcon />} label="Vehículo" />
                          <Tab icon={<InfoIcon />} label="Transacción" />
                        </Tabs>

                        {value === 0 &&
                          <TabContainer>
                            <Grid container>
                              <Grid item xs={2}>
                                {log.event === events.realNames['VehicleRegistered'] ?
                                  (<div>Modelo < br /></div>) :
                                  (<div></div>)}
                                Nº serie <br />
                                Nº motor <br />
                                Color<br />
                                Razón
                              </Grid>
                              <Grid item xs={10}>
                                {log.event === events.realNames['VehicleRegistered'] ?
                                  (<div>{log.vehicle.marca} / {log.vehicle.modelo} <br /></div>) :
                                  (<div></div>)}
                                {log.vehicle.serialNumber} <br />
                                {log.vehicle.motorNumber} <br />
                                {log.vehicle.color} <br />
                                {log.vehicle.reason}
                              </Grid>
                            </Grid>
                          </TabContainer>
                        }
                        {value === 1 &&
                          <TabContainer>
                            <Grid container>
                              <Grid item xs={2}>
                                TxT Hash <br />
                                Block Hash <br />
                                Block Number <br />
                                Gas empleado <br />
                                Encargado
                            </Grid>
                              <Grid item xs={10}>
                                {log.transactionHash} <br />
                                {log.blockHash} <br />
                                {log.blockNumber} <br />
                                {log.gasUsed}  <br />
                                {log.vehicle.employeeAddress}
                              </Grid>
                            </Grid>
                          </TabContainer>
                        }
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                );
              })
            }
          </Paper>
        </main>
      </div>
    )
  }
}

HomeView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HomeView);