import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import Button from '../../components-ui/CustomButtons/Button.jsx';
import ImgMediaCard from '../CardItem'
import getWeb3 from '../../utils/getWeb3'

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
  }
});


class SearchView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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

  manageVehiclesFiltered = async (vehicles) => {
    let promises = [];

    try {
      vehicles.map((e) => {
        return promises.push(this.execGetVehicleFiltered(e));
      });

      const vehiclesFiltered = await Promise.all(promises);
      console.log(vehiclesFiltered);
      console.log(this.mappingVehiclesFromContract(vehiclesFiltered));

      this.setState({ vehiclesFiltered: this.mappingVehiclesFromContract(vehiclesFiltered) });
    } catch (e) {
      console.log(e);
    }
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

            <Grid container justify='space-between' alignItems='center' >

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
                <ImgMediaCard numberPlate={cardVehicle.numberPlate} brand={cardVehicle.brand} model={cardVehicle.model} image={cardVehicle.image} />
              ))
            }
          </Grid>

        </main>

      </div>)


  }


}

SearchView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchView);