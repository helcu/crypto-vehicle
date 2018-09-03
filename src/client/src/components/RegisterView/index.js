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

import VehicleFactoryContract from '../../buildContracts/VehicleFactory.json'



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


class  RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeStep: 0,
      numberPlate: '123456',
      marca:'',
      modelo: '',
      color:'',
      serialNumber:'',
      motorNumber:'',
      reason:'',
      images:[],
      documents:[],
      owners:[],
      web3: null,
      vehicleFactoryInstance: null
    };
  }

  elementsToHex = (_asciiArray) => {
    return _asciiArray.map((e) => {
      return this.state.web3.fromAscii(e);
    });
  }

  componentWillMount = async() => {
    let results = await getWeb3
    .catch(() => {
      console.log('Error finding web3.')
    });

    this.setState({ web3: results.web3 }, async () =>{  await this.initContracts();});

  
    //await this.manageVehicles();
    //await this.getHistocalData();
  }

  initContracts = async() => {
    const contract = require('truffle-contract');
    const vehicleFactory = contract(VehicleFactoryContract);
    vehicleFactory.setProvider(this.state.web3.currentProvider);
    const vehicleFactoryInstance = await vehicleFactory.deployed();
    this.setState({ vehicleFactoryInstance: vehicleFactoryInstance });
  }
   getStepContent(step) {
    switch (step) {
      case 0:
        return <VehicleInfo {...this.state} update={this.updateStates}  />;
      case 1:
        return <ImagesVehicle {...this.state} update={this.updateStates}/>;
      case 2:
        return <DocumentsVehicle {...this.state} update={this.updateStates}/>;
      case 3:
        return <OwnersVehicle {...this.state} update={this.updateStates} />;
      default:
        throw new Error('Unknown step');
    }
  }

  execRegisterVehicle = async(
    _numberPlate, _brand, _model, 
    _color, _serialNumber, _motorNumber, _reason,
    _photos, _documents, _ownersId, _ownersNames,
    _userAddress
  ) => {
    const web3 = this.state.web3;
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;    

    let exists = await vehicleFactoryInstance.vehicleExists(web3.fromAscii(_numberPlate));
    if(exists) {
      /*this.setState({ 
        operation: {
          status: "onValidation",
          message: "Este vehículo ya está registrado."
        }
      });*/
      return false;
    }

    exists = await vehicleFactoryInstance.serialNumberExists(web3.fromAscii(_serialNumber));
    if(exists) {
      /*this.setState({ 
        operation: {
          status: "onValidation",
          message: "Este número de serie ya está registrado."
        }
      });*/
      return false;
    }

    exists = await vehicleFactoryInstance.motorNumberExists(web3.fromAscii(_motorNumber));
    if(exists) {
      /*this.setState({ 
        operation: {
          status: "onValidation",
          message: "Este número de motor ya está registrado."
        }
      });*/
      return false;
    }

    _photos = "QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm";
    _documents = "QmfSPakJG6BgQkRmDusF2t5mzz5MYEJgtz6bTdZh3ac6jm";
    _ownersId = this.elementsToHex(_ownersId);
    _ownersNames = this.elementsToHex(_ownersNames);

    let wasVehicleAdded = await vehicleFactoryInstance.registerVehicle(
      web3.fromAscii(_numberPlate), web3.fromAscii(_brand), web3.fromAscii(_model),
      web3.fromAscii(_color), web3.fromAscii(_serialNumber), web3.fromAscii(_motorNumber), web3.fromAscii(_reason),
      _photos, _documents, _ownersId, _ownersNames,
        {from: _userAddress}
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
    this.setState(newObject, () =>{ console.log(this.state);} );
  }


  handleRegisterVehicle = async() => {
console.log(this.state);

    const web3 = this.state.web3;
    console.log(web3);
    const accounts = await web3.eth.accounts;
    console.log(accounts);
    /*if(!accounts || !accounts[0]) {
      console.log("There is no account.");
    
      return;
  }*/

    let _numberPlate = this.state.numberPlate;
    let _brand = this.state.marca;
    let _model = this.state.modelo
    let _color = this.state.color;
    let _serialNumber = this.state.serialNumber;
    let _motorNumber = this.state.motorNumber;
    let _reason = this.state.reason;
    let _photos = ["Photo1", "Photo2"];
    let _documents = ["Doc1", "Doc2"];
    let _ownersId = ["Id1", "Id2"];
    let _ownersNames = ["Name1", "Name2"];
    

    await this.execRegisterVehicle(
      _numberPlate, _brand, _model, 
      _color, _serialNumber, _motorNumber, _reason,
      _photos, _documents, _ownersId, _ownersNames
    );

  } 
  
  handleNext = () => {
    if(this.state.activeStep === steps.length - 1 ){
      this.handleRegisterVehicle();
    }else{
      const { activeStep } = this.state;
      this.setState({
        activeStep: activeStep + 1,
      });
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
      <CssBaseline />
      <Typography variant="display3" gutterBottom>
        Registro vehicular
      </Typography>

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
                    Thank you for your order.
                  </Typography>
                  <Typography variant="subheading">
                    Your order number is #2001539. We have emailed your oder confirmation, and will
                    send you an update when your order has shipped.
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {this.getStepContent(activeStep)}
                  <div className={classes.buttons}>
                    {activeStep !== 0 && (
                      <Button onClick={this.handleBack} className={classes.button}>
                        Regresar
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          </Paper>
        </main>
      
    </div>
  );}
}

RegisterView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterView);