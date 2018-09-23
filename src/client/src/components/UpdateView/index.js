import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';

import VehicleInfo from '../Steps/VehicleInfo';
import ImagesVehicle from '../Steps/ImagesVehicle';
import DocumentsVehicle from '../Steps/DocumentsVehicle';
import OwnersVehicle from '../Steps/OwnersVehicle';
import getWeb3 from '../../utils/getWeb3'
import ipfs from './../../utils/ipfs';

import VehicleFactoryContract from './../../buildContracts/VehicleFactory.json'


const styles = theme => ({
  appBar: {
    position: 'relative',
  },
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
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
});

const steps = ['Datos', 'Fotos', 'Documentos', 'Propietarios'];


class UpdateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      numberPlate: props.numberPlate,
      marca: '',
      modelo: '',
      color: '',
      serialNumber: '',
      motorNumber: '',
      reason: '',
      images: [],
      documents: [],
      owners: [],
      disabled: true,
      web3: null,
      vehicleFactoryInstance: null
    };
    this.vehicleInfoChild = React.createRef();
  }

  elementsToHex = (_asciiArray) => {
    return _asciiArray.map((e) => {
      return this.state.web3.fromAscii(e);
    });
  }

  elementsToAscii = (_hexArray) => {
    return _hexArray.map((e) => {
      return this.state.web3.toAscii(e);
    });
  }

  componentWillMount = async () => {
    let results = await getWeb3
      .catch(() => {
        console.log('Error finding web3.')
      });

    await this.setState({ web3: results.web3 }, () => {
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
    });


    const web3 = this.state.web3;
    const _numberPlate = this.props.numberPlate;
    const vehicle = await this.execGetVehicleDetail(_numberPlate);
    this.setState({
      numberPlate: web3.toAscii(vehicle[0]).replace(/ /g, ''),
      marca: web3.toAscii(vehicle[1]).replace(/ /g, ''),
      modelo: web3.toAscii(vehicle[2]).replace(/ /g, ''),
      color: web3.toAscii(vehicle[3]).replace(/ /g, ''),
      serialNumber: web3.toAscii(vehicle[4]).replace(/ /g, ''),
      motorNumber: web3.toAscii(vehicle[5]).replace(/ /g, ''),
      reason: web3.toAscii(vehicle[6]).replace(/ /g, ''),
      images: this.getUrlFromContract(vehicle[7]),
      documents: this.getUrlFromContract(vehicle[8]),
      owners: this.mappingOwnersFromContract(vehicle[9], vehicle[10]),
      employeeAddress: vehicle[11],
      disabled: true
    });
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return <VehicleInfo ref={this.vehicleInfoChild} {...this.state} update={this.updateStates} />;
      case 1:
        return <ImagesVehicle {...this.state} update={this.updateStates} />;
      case 2:
        return <DocumentsVehicle {...this.state} update={this.updateStates} />;
      case 3:
        return <OwnersVehicle {...this.state} update={this.updateStates} />;
      default:
        throw new Error('Unknown step');
    }
  }

  execGetVehicleDetail = async (_numberPlate) => {
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;

    let vehicle = await vehicleFactoryInstance.getVehicle(_numberPlate);
    let vehicleDetail = await vehicleFactoryInstance.getVehicleDetail(_numberPlate);
    vehicle.push(...vehicleDetail);
    return vehicle;
  }

  execUpdateVehicle = async (
    _numberPlate,
    _color, _serialNumber, _motorNumber, _reason,
    _photos, _documents, _ownersId, _ownersNames,
    _userAddress
  ) => {
    const web3 = this.state.web3;
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;

    _ownersId = this.elementsToHex(_ownersId);
    _ownersNames = this.elementsToHex(_ownersNames);

    var wasUpdated = false;
    try {
      wasUpdated = await vehicleFactoryInstance.updateVehicle(
        web3.fromAscii(_numberPlate),
        web3.fromAscii(_color), web3.fromAscii(_serialNumber), web3.fromAscii(_motorNumber), web3.fromAscii(_reason),
        _photos, _documents, _ownersId, _ownersNames,
        { from: _userAddress }
      );
    } catch (e) {
      console.log(e);
    }

    if (wasUpdated) {
      this.watchForUpdateLog(_numberPlate);
    } else {
      console.log("execUpdateVehicle: failed");
    }

    return wasUpdated;
  }

  watchForUpdateLog = async (_numberPlate) => {
    const web3 = this.state.web3;
    const accounts = await web3.eth.accounts;

    if (!accounts || !accounts[0]) {
      console.log("There is no account.");
      return false;
    }

    let vehicleUpdateEvent = this.state.vehicleFactoryInstance.VehicleUpdated(
      { numberPlate: web3.fromAscii(_numberPlate), employeeAddress: accounts[0] },
      { toBlock: 'latest' }
    );

    vehicleUpdateEvent.watch((error, log) => {
      if (error) {
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
      console.log("watchForUpdateLog", vehicleLogs);
      vehicleUpdateEvent.stopWatching();
    });
  }
  /*-------------------------- HANDLERS ------------------------------------*/

  updateStates = (newObject) => {
    this.setState({
      ...newObject,
      disabled: true
    });
  }

  validateVehicleExists = async (_numberPlate) => {
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;
    return await vehicleFactoryInstance.vehicleExists(this.state.web3.fromAscii(_numberPlate));
  }

  validateSerialNumberExists = async (_serialNumber) => {
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;
    return await vehicleFactoryInstance.serialNumberExists(this.state.web3.fromAscii(_serialNumber));
  }

  validateMotorNumberExists = async (_motorNumber) => {
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;
    return await vehicleFactoryInstance.motorNumberExists(this.state.web3.fromAscii(_motorNumber));
  }

  validateSerialNumberSelfExists = async (_numberPlate, _serialNumber) => {
    const web3 = this.state.web3;
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;
    return await vehicleFactoryInstance.serialNumberSelfExists(web3.fromAscii(_numberPlate), web3.fromAscii(_serialNumber));
  }

  validateMotorNumberSelfExists = async (_numberPlate, _motorNumber) => {
    const web3 = this.state.web3;
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;
    return await vehicleFactoryInstance.motorNumberSelfExists(web3.fromAscii(_numberPlate), web3.fromAscii(_motorNumber));
  }

  handleUpdateVehicle = async () => {
    const web3 = this.state.web3;
    const accounts = await web3.eth.accounts;

    if (!accounts || !accounts[0]) {
      console.log("There is no account.");
      return false;
    }

    let _numberPlate = this.state.numberPlate;
    let _color = this.state.color;
    let _serialNumber = this.state.serialNumber;
    let _motorNumber = this.state.motorNumber;
    let _reason = this.state.reason;
    let _photos = await this.imageToIpfsString(this.state.images).catch(e => console.log(e)); //"QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm";
    let _documents = await this.imageToIpfsString(this.state.documents).catch(e => console.log(e));//"QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm";
    let _owners = this.getOwnersDetail(this.state.owners);
    let _ownersId = _owners[0];
    let _ownersNames = _owners[1];

    return await this.execUpdateVehicle(
      _numberPlate,
      _color, _serialNumber, _motorNumber, _reason,
      _photos, _documents, _ownersId, _ownersNames,
      accounts[0]
    );
  }

  imageToIpfsString = async (images) => {
    let promises = [];
    let ipfsArray = "";

    try {
      images.map(async (file) => {
        promises.push(this.getIpfsString(file));
      });

      ipfsArray = await Promise.all(promises);
    } catch (e) {
      console.warn(e.message);
    }

    return ipfsArray.join();
  }

  getIpfsString = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {

      if (!file.preview) {
        resolve(file);
      }

      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      reader.onload = async () => {
        const fileAsBinaryString = reader.result;
        let buffer = new Buffer(fileAsBinaryString, "binary");
        let ipfsResponse = await ipfs.add(buffer);
        resolve(ipfsResponse[0].hash);
      };

      reader.readAsBinaryString(file);
    });
  };

  getOwnersDetail = (owners) => {
    let ownersId = [];
    let ownersName = [];

    owners.map(o => {
      ownersId.push(o.dni);
      ownersName.push(o.name);
      return o;
    });
    return [ownersId, ownersName];
  }

  getOwnersFromContract = (ownersId, ownersName) => {
    return ownersId.map((e, i) => {
      return {
        dni: e,
        name: ownersName[i]
      }
    });
  }

  getUrlFromContract = (url) => {
    return url.length === 0 ? [] : url.split(",");
  }

  manageVehiclesDetail = async (vehicles) => {
    let promises = [];

    try {
      vehicles.map((e) => {
        return promises.push(this.execGetVehicleDetail(e));
      });

      const vehiclesDetail = await Promise.all(promises);
      console.log(vehiclesDetail);
      //this.setState({ vehiclesDetail: vehiclesDetail });
    } catch (e) {
      console.log(e);
    }
  }


  handleNext = async () => {
    const activeStep = this.state.activeStep;
    let goToNext = false;
    let message = "";

    switch (activeStep) {
      case 0:

        const inputs = this.state.inputs;
        if (!inputs) {
          message = "Los campos son obligatorios.";
          break;
        }

        await this.vehicleInfoChild.current.validateInputs();

        const invalidInputs = Object.entries(inputs.errors).filter((e) => {
          return e[1] === true;
        });

        if (invalidInputs.length > 0) {
          message = "Algunos campos no cumplen con el formato."
          break;
        }

        const vehicleExists = await this.validateVehicleExists(this.state.numberPlate);
        if (!vehicleExists) {
          message = "La placa del vehículo no está registrada.";
          break;
        }

        const serialNumberExists = await this.validateSerialNumberExists(this.state.serialNumber);
        const serialNumberSelfExists = await this.validateSerialNumberSelfExists(this.state.numberPlate, this.state.serialNumber);
        if (!serialNumberSelfExists && serialNumberExists) {
          message = "El número de serie ya está registrado.";
          break;
        }

        const motorNumberExists = await this.validateMotorNumberExists(this.state.motorNumber);
        const motorNumberSelfExists = await this.validateMotorNumberSelfExists(this.state.numberPlate, this.state.motorNumber);
        if (!motorNumberSelfExists && motorNumberExists) {
          message = "El número de motor ya está registrado.";
          break;
        }

        goToNext = true;
        break;
      case 1:
        goToNext = true;
        break;
      case 2:
        goToNext = true;
        break;
      case 3:
        goToNext = await this.handleUpdateVehicle();
        break;
      default:
        break;
    }

    if (goToNext) {
      console.log(this.state);
      this.setState({
        activeStep: activeStep + 1,
        disabled: true
      }, () => {
        console.log(this.state);
      });
    } else {
      alert(message);
    }
  };

  handleBack = () => {
    console.log(this.state);
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    }, () => {
      console.log(this.state);
    });
  };

  mappingOwnersFromContract = (ownersIds, ownersNames) => {
    const web3 = this.state.web3;
    return ownersIds.map((o, i) => {
      return {
        id: i,
        dni: web3.toAscii(o),
        name: web3.toAscii(ownersNames[i])
      };
    });
  }


  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

    return (
      <div>
        <CssBaseline />

        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="headline" gutterBottom>
                    Has completado el ingreso de datos
                  </Typography>
                  <Typography variant="subheading">
                    En breve, el vehículo será registrado en el sistema.
                  </Typography>
                </React.Fragment>
              ) : (
                  <React.Fragment>
                    {this.getStepContent(activeStep)}
                    <div className={classes.buttons}>
                      {
                        activeStep !== 0 &&
                        (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleBack}
                            className={classes.button}>
                            Regresar
                          </Button>
                        )
                      }
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}>
                        {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
                      </Button>
                    </div>
                  </React.Fragment>
                )}
            </React.Fragment>
          </Paper>
        </main>
      </div>
    );
  }
}

UpdateView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateView);