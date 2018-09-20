import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import Button from '../../components-ui/CustomButtons/Button.jsx';
import ImgMediaCard from '../CardItem'
import getWeb3 from '../../utils/getWeb3'
import Typography from '@material-ui/core/Typography';

import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import DetailBody from '../DetailBody'

import VehicleFactoryContract from './../../buildContracts/VehicleFactory.json'


const styles = theme => ({
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
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
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
});


function Transition(props) {
  return <Slide direction="up" {...props} />;
}


class SearchView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      input: "",
      checkNumberPlate: true,
      checkBrand: true,
      checkModel: true,
      checkColor: true,
      vehiclesFiltered: [],
      vehicle: {
        numberPlate: "",
        marca: "",
        modelo: "",
        color: "",
        serialNumber: "",
        motorNumber: "",
        reason: "",
        images: [],
        documents: [],
        owners: [],
        date: ""
      },
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

  initContracts = async () => {
    const contract = require('truffle-contract');
    const vehicleFactory = contract(VehicleFactoryContract);
    vehicleFactory.setProvider(this.state.web3.currentProvider);
    const vehicleFactoryInstance = await vehicleFactory.deployed();
    await this.setState({ vehicleFactoryInstance: vehicleFactoryInstance });
  }

  execGetVehicleFiltered = async (_numberPlate) => {
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;
    return await vehicleFactoryInstance.getVehicleFiltered(_numberPlate);
  }

  execGetVehicleDetail = async (_numberPlate) => {
    const vehicleFactoryInstance = this.state.vehicleFactoryInstance;

    let vehicle = await vehicleFactoryInstance.getVehicle(_numberPlate);
    let vehicleDetail = await vehicleFactoryInstance.getVehicleDetail(_numberPlate);
    vehicle.push(...vehicleDetail);
    return vehicle;
  }

  mappingVehiclesFromContract = (vehicles) => {
    const web3 = this.state.web3;
    return vehicles.map((v) => {
      return {
        numberPlate: web3.toAscii(v[0]),
        brand: web3.toAscii(v[1]),
        model: web3.toAscii(v[2]),
        image: v[3].split(",")[0]
      }
    });
  }

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

  mappingVehicleDetailFromContract = (vehicle) => {
    const web3 = this.state.web3;
    const owners = this.mappingOwnersFromContract(vehicle[9], vehicle[10]);

    return {
      numberPlate: web3.toAscii(vehicle[0]),
      brand: web3.toAscii(vehicle[1]),
      model: web3.toAscii(vehicle[2]),
      color: web3.toAscii(vehicle[3]),
      serialNumber: web3.toAscii(vehicle[4]),
      motorNumber: web3.toAscii(vehicle[5]),
      reason: web3.toAscii(vehicle[6]),
      photos: vehicle[7].split(","),
      documents: vehicle[8].split(","),
      owners: owners,
      employeeAddress: vehicle[11]
    };
  }

  manageVehiclesFiltered = async (vehicles) => {
    let promises = [];

    vehicles.map((e) => {
      return promises.push(this.execGetVehicleFiltered(e));
    });

    const vehiclesFiltered = await Promise.all(promises);
    const vehiclesMapped = this.mappingVehiclesFromContract(vehiclesFiltered);
    this.setState({ vehiclesFiltered: vehiclesMapped });
    vehiclesMapped.map(async (e) => {
      this.manageVehicleDetail(e.numberPlate);
    });
  }

  manageVehicleDetail = async (_numberPlate) => {
    const vehicle = await this.execGetVehicleDetail(_numberPlate);
    const vehicleMapped = this.mappingVehicleDetailFromContract(vehicle);
    this.setState({vehicle: vehicleMapped});

  }

  onChange = () => e => {
    const value = e.target.value.toUpperCase().replace(/\s\s+/g, ' ');
    this.setState({ input: value });
  }

  onSearch = async () => {
    const input = this.state.input;
    let _numberPlate = this.state.checkNumberPlate ? input : "";
    let _brand = this.state.checkBrand ? input : "";
    let _model = this.state.checkModel ? input : "";
    let _color = this.state.checkColor ? input : "";

    let vehicles = await this.state.vehicleFactoryInstance.getVehiclesFilteredWithContains(
      _numberPlate,
      _brand, _model,
      _color
    );

    await this.manageVehiclesFiltered(vehicles);
  }

  handleChange = () => e => {
    this.setState({
      [e.target.name]: e.target.checked
    });
  }


  handleClickOpen = async (numberPlate) => {

    await this.manageVehicleDetail(numberPlate)
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <CssBaseline />

        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Grid container item sm={12} alignItems='center'>
              <Grid item xs={12} sm={11}>
                <TextField
                  label="Buscar"
                  id="bootstrap-input"
                  value={this.state.input}
                  fullWidth
                  style={{ marginLeft: 32 }}
                  InputProps={{
                    disableUnderline: true,
                    classes: {
                      root: classes.bootstrapRoot,
                      input: classes.bootstrapInput,
                    },
                  }}
                  onChange={this.onChange()}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button sm={1} justIcon round color="primary" style={{ marginTop: 29, marginLeft: 10 }} onClick={this.onSearch} ><Search style={{ color: "#FFFFFF" }} /></Button>
              </Grid>

            </Grid>

            <Grid container justify='space-between' alignItems='center'>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkNumberPlate} onChange={this.handleChange()}
                    value="checkedA"
                    name='checkNumberPlate'
                  />
                }
                label="Placa"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkBrand} onChange={this.handleChange()}
                    value="checkedA"
                    name='checkBrand'
                  />
                }
                label="Marca"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkModel} onChange={this.handleChange()}
                    value="checkedA"
                    name='checkModel'
                  />
                }
                label="Modelo"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkColor} onChange={this.handleChange()}
                    value="checkedA"
                    name='checkColor'
                  />
                }
                label="Color"
              />
            </Grid>

          </Paper>

          <Grid container direction='row' md={12} lg={12} alignItems='baseline' spacing={24} justify='center'>
            {
              this.state.vehiclesFiltered.map(cardVehicle => (
                <ImgMediaCard numberPlate={cardVehicle.numberPlate} brand={cardVehicle.brand} model={cardVehicle.model} image={cardVehicle.image} handleOpenDialog= {this.handleClickOpen} />
              ))
            }
          </Grid>

        </main>

      <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Detalle
              </Typography>
              
            </Toolbar>
          </AppBar>
          <DetailBody vehicle = {this.state.vehicle}/>
        </Dialog>

      </div>)


  }


}

SearchView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchView);