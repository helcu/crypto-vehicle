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


class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      numberPlate: '',
      marca: '',
      modelo: '',
      color: '',
      serialNumber: '',
      motorNumber: '',
      reason: '',
      images: [],
      documents: [],
      owners: [],
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

  componentDidMount = async () => {
    let results = await getWeb3
      .catch(() => {
        console.log('Error finding web3.')
      });

    await this.setState({ web3: results.web3 }, () => {
      this.initContracts();
    });


    //await this.manageVehicles();
    //await this.getHistocalData();
  }

  initContracts = async () => {
    const contract = require('truffle-contract');
    const vehicleFactory = contract(VehicleFactoryContract);
    vehicleFactory.setProvider(this.state.web3.currentProvider);
    const vehicleFactoryInstance = await vehicleFactory.deployed();
    await this.setState({ vehicleFactoryInstance: vehicleFactoryInstance });

    var filter = this.state.web3.eth.filter('pending');
    filter.watch(async (error, log) => {
      console.log("error", error);
      console.log("log", log);

      let _numberPlate = "";//this.state.vehicle.numberPlate + "dd";
      let _brand = "";
      let _model = "";
      let _color = "";

      let vehicles = await this.state.vehicleFactoryInstance.getVehiclesFilteredWithContains(
        _numberPlate,
        _brand, _model,
        _color
      );

      await this.manageVehiclesDetail(vehicles);
    });

    let _numberPlate = "";//this.state.vehicle.numberPlate + "dd";
    let _brand = "";
    let _model = "";
    let _color = "";

    let vehicles = await this.state.vehicleFactoryInstance.getVehiclesFilteredWithContains(
      _numberPlate,
      _brand, _model,
      _color
    );

    await this.manageVehiclesDetail(vehicles);
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

  execRegisterVehicle = async (
    _numberPlate, _brand, _model,
    _color, _serialNumber, _motorNumber, _reason,
    _photos, _documents, _ownersId, _ownersNames,
    _userAddress
  ) => {
    const web3 = this.state.web3;
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;

    let exists = await vehicleFactoryInstance.vehicleExists(web3.fromAscii(_numberPlate));
    if (exists) {
      /*this.setState({ 
        operation: {
          status: "onValidation",
          message: "La placa del vehículo ya está registrada."
        }
      });*/
      console.log("La placa del vehículo ya está registrada.");
      return false;
    }

    exists = await vehicleFactoryInstance.serialNumberExists(web3.fromAscii(_serialNumber));
    if (exists) {
      /*this.setState({ 
        operation: {
          status: "onValidation",
          message: "El número de serie ya está registrado."
        }
      });*/
      console.log("El número de serie ya está registrado.");
      return false;
    }

    exists = await vehicleFactoryInstance.motorNumberExists(web3.fromAscii(_motorNumber));
    if (exists) {
      /*this.setState({ 
        operation: {
          status: "onValidation",
          message: "El número de motor ya está registrado."
        }
      });*/
      console.log("El número de motor ya está registrado.");
      return false;
    }

    //_photos = "QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm";
    _documents = "QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm";
    _ownersId = this.elementsToHex(_ownersId);
    _ownersNames = this.elementsToHex(_ownersNames);

    let wasVehicleAdded = await vehicleFactoryInstance.registerVehicle(
      web3.fromAscii(_numberPlate), web3.fromAscii(_brand), web3.fromAscii(_model),
      web3.fromAscii(_color), web3.fromAscii(_serialNumber), web3.fromAscii(_motorNumber), web3.fromAscii(_reason),
      _photos, _documents, _ownersId, _ownersNames,
      { from: _userAddress }
    );

    /*if(wasVehicleAdded) {
      this.setState({ 
        operation: {
          status: "onPending",
          message: "Procesando el registro del vehículo."
        }
      });
    } else {
      this.setState({ 
        operation: {
          status: "onError",
          message: "Ocurrió un error al registrar el vehículo."
        }
      });
    }*/

    return wasVehicleAdded;
  }
  /*-------------------------- HANDLERS ------------------------------------*/

  updateStates = (newObject) => {
    console.log(newObject);
    this.setState(newObject, () => { console.log(this.state); });
  }

  validateVehicleExists = async (_numberPlate) => {
    const web3 = this.state.web3;
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;

    return await vehicleFactoryInstance.vehicleExists(web3.fromAscii(_numberPlate));
  }

  validateSerialNumberExists = async (_serialNumber) => {
    const web3 = this.state.web3;
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;

    return await vehicleFactoryInstance.serialNumberExists(web3.fromAscii(_serialNumber));
  }

  validateMotorNumberExists = async (_motorNumber) => {
    const web3 = this.state.web3;
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;

    return await vehicleFactoryInstance.motorNumberExists(web3.fromAscii(_motorNumber));
  }

  handleRegisterVehicle = async () => {
    const web3 = this.state.web3;
    const accounts = await web3.eth.accounts;

    if (!accounts || !accounts[0]) {
      console.log("There is no account.");
      return false;
    }

    let _numberPlate = this.state.numberPlate;
    let _brand = this.state.marca;
    let _model = this.state.modelo
    let _color = this.state.color;
    let _serialNumber = this.state.serialNumber;
    let _motorNumber = this.state.motorNumber;
    let _reason = this.state.reason;
    let _photos = await this.imageToIpfsString(this.state.images).catch(e => console.log(e));
    let _documents = ["Doc1", "Doc2"];
    let _owners = this.getOwnersDetail(this.state.owners);
    let _ownersId = _owners[0];
    let _ownersNames = _owners[1];

    return await this.execRegisterVehicle(
      _numberPlate, _brand, _model,
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
    const activeStep = 2;//this.state.activeStep;
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
        if (vehicleExists) {
          message = "La placa del vehículo ya está registrada.";
          break;
        }

        const serialNumberExists = await this.validateSerialNumberExists(this.state.serialNumber);
        if (serialNumberExists) {
          message = "El número de serie ya está registrado.";
          break;
        }

        const motorNumberExists = await this.validateMotorNumberExists(this.state.motorNumber);
        if (motorNumberExists) {
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
        goToNext = await this.handleRegisterVehicle();
        break;
      default:
        break;
    }

    if (goToNext) {
      this.setState({
        activeStep: activeStep + 1,
      });
    } else {
      alert(message);
    }
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

    return (
      <div>
        <CssBaseline/>

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
                          <Button onClick={this.handleBack} className={classes.button}>
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

RegisterView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterView);