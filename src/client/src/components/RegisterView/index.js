import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography, CssBaseline, Paper, Stepper, Step, StepLabel, Button, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';

import BeforeIcon from '@material-ui/icons/NavigateBefore';
import NextIcon from '@material-ui/icons/NavigateNext';
import CheckIcon from '@material-ui/icons/Check';

import green from '@material-ui/core/colors/green';

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
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
});

const steps = ['Datos', 'Fotos', 'Documentos', 'Propietarios'];


class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      loading: false,
      success: false,
      dialog: {
        open: false,
        title: '',
        description: ''
      },
      numberPlate: '',
      marca: '',
      modelo: '',
      color: '',
      serialNumber: '',
      motorNumber: '',
      reason: '',
      images: [],
      imagesNames: [],
      imagesNamesErrors: [],
      documents: [],
      documentsNames: [],
      documentsNamesErrors: [],
      owners: [],
      web3: null,
      vehicleFactoryInstance: null
    };

    this.vehicleInfoChild = React.createRef();
    this.vehicleImagesChild = React.createRef();
    this.vehicleDocumentsChild = React.createRef();
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

  componentDidMount = async () => {
    let results = await getWeb3
      .catch(() => {
        console.warn('Error finding web3.');
        this.setState({
          dialog: {
            open: true,
            title: 'Componente no encontrado',
            description: 'Web3 no ha sido encontrado. Vuelva a cargar la página.'
          }
        });
      });

    await this.setState({ web3: results.web3 }, () => {
      this.state.web3.eth.getTransactionReceiptMined = function getTransactionReceiptMined(txHash, interval) {
        const self = this;
        const transactionReceiptAsync = function (resolve, reject) {
          self.getTransactionReceipt(txHash, (error, receipt) => {
            console.log("PREGUNTANDO...", receipt);
            if (error) {
              reject(error);
            } else if (receipt == null) {
              setTimeout(
                () => transactionReceiptAsync(resolve, reject),
                interval ? interval : 1000);
            } else {
              resolve(receipt);
            }
          });
        };

        if (Array.isArray(txHash)) {
          return Promise.all(txHash.map(
            oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
        } else if (typeof txHash === "string") {
          return new Promise(transactionReceiptAsync);
        } else {
          throw new Error("Invalid Type: " + txHash);
        }
      };
      this.initContracts();
    });
  }

  initContracts = async () => {
    const contract = require('truffle-contract');
    const vehicleFactory = contract(VehicleFactoryContract);
    vehicleFactory.setProvider(this.state.web3.currentProvider);
    const vehicleFactoryInstance = await vehicleFactory.deployed();
    await this.setState({ vehicleFactoryInstance: vehicleFactoryInstance });
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return <VehicleInfo ref={this.vehicleInfoChild} {...this.state} update={this.updateStates} />;
      case 1:
        return <ImagesVehicle innerRef={this.vehicleImagesChild} {...this.state} update={this.updateStates} />;
      case 2:
        return <DocumentsVehicle innerRef={this.vehicleDocumentsChild} {...this.state} update={this.updateStates} />;
      case 3:
        return <OwnersVehicle {...this.state} update={this.updateStates} />;
      default:
        this.setState({
          dialog: {
            open: true,
            title: 'Paso incorrecto',
            description: 'Está fuera de los pasos existentes. Vuelva a cargar la página.'
          }
        });
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

    _ownersId = this.elementsToHex(_ownersId);
    _ownersNames = this.elementsToHex(_ownersNames);

    var txHash = false;
    try {
      txHash = await vehicleFactoryInstance.registerVehicle(
        web3.fromAscii(_numberPlate), web3.fromAscii(_brand), web3.fromAscii(_model),
        web3.fromAscii(_color), web3.fromAscii(_serialNumber), web3.fromAscii(_motorNumber), web3.fromAscii(_reason),
        _photos, _documents, _ownersId, _ownersNames,
        { from: _userAddress }
      );
    } catch (e) {
      console.warn(e);
    }

    if (txHash) {
      await this.props.updateLogState({
        transactionHash: txHash.tx,
        event: 'VehicleRegistered',
        numberPlate: _numberPlate,
        timestamp: Math.floor(Date.now() / 1000)
      });

      let receipt = await this.state.web3.eth.getTransactionReceiptMined(txHash.tx);
      console.log(_numberPlate, await this.execGetVehicleDetail(_numberPlate));
      console.log("receipt: ", receipt);
      if (receipt.logs.length > 1) {
        console.warn("receipt.logs", receipt.logs);
      }

      setTimeout(async () => {
        await this.props.updateLogState({
          transactionHash: receipt.transactionHash,
          timestamp: Math.floor(Date.now() / 1000)
        });

        this.setState({
          loading: false,
          success: true,
        });
      }, 1500);

    } else {
      console.log("execRegisterVehicle: failed");
    }

    return txHash;
  }

  watchForRegisterLog = async (_numberPlate) => {
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
      { numberPlate: web3.fromAscii(_numberPlate), employeeAddress: accounts[0] },
      { toBlock: 'latest' }
    );

    vehicleRegisteredEvent.watch((error, log) => {
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

      this.props.updateLogState(
        log
      );
      console.log("watchForRegisterLog", vehicleLogs);
      //vehicleRegisteredEvent.stopWatching();
    });
  }
  /*-------------------------- HANDLERS ------------------------------------*/

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

  handleRegisterVehicle = async () => {
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

    const photos = await this.getImagesWithNames(this.state.images, this.state.imagesNames);
    const documents = await this.getImagesWithNames(this.state.documents, this.state.documentsNames);
    const photosUrl = this.getUrlFromContract(photos);
    const documentsUrl = this.getUrlFromContract(documents);

    this.setState({
      images: photosUrl.splice(0, photosUrl.length / 2),
      imagesNames: photosUrl,
      documents: documentsUrl.splice(0, documentsUrl.length / 2),
      documentsNames: documentsUrl
    });

    let _numberPlate = this.state.numberPlate;
    let _brand = this.state.marca;
    let _model = this.state.modelo
    let _color = this.state.color;
    let _serialNumber = this.state.serialNumber;
    let _motorNumber = this.state.motorNumber;
    let _reason = this.state.reason;
    let _photos = photos; //"QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,PHOTO1";
    let _documents = documents; //"QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm,DOC1";
    let _owners = this.getOwnersDetail(this.state.owners);
    let _ownersId = _owners[0];
    let _ownersNames = _owners[1];
    console.log(_photos, _documents);
    return await this.execRegisterVehicle(
      _numberPlate, _brand, _model,
      _color, _serialNumber, _motorNumber, _reason,
      _photos, _documents, _ownersId, _ownersNames,
      accounts[0]
    );
  }

  getImagesWithNames = async (images, imagesNames) => {
    let imagesString = await this.imageToIpfsString(images).catch(e => console.log(e));
    let imagesNamesString = imagesNames.join();
    return images.length === 0 ? "" : imagesString + "," + imagesNamesString;
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
      case 0: // Info

        const inputs = this.state.inputs;
        if (!inputs) {
          message = "Los campos son obligatorios.";
          break;
        }

        await this.vehicleInfoChild.current.validateInputs();

        const invalidInputs = Object.entries(this.state.inputs.errors).filter((e) => {
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

      case 1: // Photos

        await this.vehicleImagesChild.current.validateInputs();

        const imagesErrors = this.state.imagesNamesErrors.filter((error) => {
          return error === true;
        });

        if (imagesErrors.length > 0) {
          message = "Las fotos requieren un nombre.";
          break;
        }

        goToNext = true;
        break;

      case 2: // Documents

        await this.vehicleDocumentsChild.current.validateInputs();

        let documentsErrors = this.state.documentsNamesErrors.filter((error) => {
          return error === true;
        });

        if (documentsErrors.length > 0) {
          message = "Los documentos requieren un nombre.";
          break;
        }

        goToNext = true;
        break;

      case 3: // Owners
        if (this.state.owners.length < 1) {
          message = "El vehículo debe poseer un propietario como mínimo.";
          break;
        }

        message = "El vehículo no ha sido registrado.";
        this.setState({
          success: false,
          loading: true,
        });

        goToNext = await this.handleRegisterVehicle();
        break;

      default:
        break;
    }

    this.setState({
      loading: false,
      success: false,
    });

    if (goToNext) {
      console.log(this.state);
      this.setState({
        activeStep: activeStep + 1,
        disabled: true
      }, () => {
        console.log(this.state);
      });
    } else {
      //alert(message);
      console.log(message);
      this.setState({
        dialog: {
          open: true,
          title: 'Aviso',
          description: message
        }
      }, () => {
        console.log(this.state);
      });
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    }, () => {
      console.log(this.state);
    });
  };

  handleClose = () => {
    this.setState({
      dialog: {
        open: false
      }
    });
  };


  render() {
    const { classes } = this.props;
    const { loading, success, activeStep } = this.state;
    const previewDivStyle = {
      textAlign: 'center'
    };
    const previewStyle = {
      display: 'inline',
      minWidth: 500,
      minHeight: 400,
      maxWidth: 500,
      maxHeight: 400
    };

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
                    En breve, se procesarán los datos del vehículo.
                  </Typography>
                  {success && (
                    <div style={previewDivStyle}>
                      <img
                        alt="Successful"
                        src={'https://gateway.ipfs.io/ipfs/QmW5C9fM6BdFoR8xWJV1AviapVrVvUQmyRECNkm4xqbpkM'}
                        style={previewStyle} />
                    </div>
                  )}
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
                            <BeforeIcon className={classes.leftIcon} />
                            Regresar
                          </Button>
                        )
                      }
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={this.handleNext}
                        className={classes.button}>
                        {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
                        {activeStep === steps.length - 1 ?
                          (<CheckIcon className={classes.rightIcon} />) :
                          (<NextIcon className={classes.rightIcon} />)
                        }
                        {loading && <CircularProgress size={18} className={classes.buttonProgress} />}
                      </Button>
                    </div>
                  </React.Fragment>
                )}
            </React.Fragment>
          </Paper>
        </main>

        <Dialog
          fullWidth
          open={this.state.dialog.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            {this.state.dialog.title || ''}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.dialog.description || ''}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              OK
          </Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}

RegisterView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterView);