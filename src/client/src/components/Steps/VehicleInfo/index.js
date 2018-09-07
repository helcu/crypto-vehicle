import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';

const defaultMessages = {
  numberPlate: 'e.g., AB-1234 o ABC-123',
  marca: 'máx. 31',
  modelo: 'máx. 31',
  color: 'máx. 31',
  serialNumber: 'e.g., KZN1854028170',
  motorNumber: 'e.g., 1KZ0600558',
  reason: 'máx. 31'
};

const messages = {
  success: 'Cumple',
  error: 'No cumple el formato.'
};


class VehicleInfo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      numberPlate: props.numberPlate,
      marca: props.marca,
      modelo: props.modelo,
      color: props.color,
      serialNumber: props.serialNumber,
      motorNumber: props.motorNumber,
      reason: props.reason,
      inputs: {
        messages: defaultMessages,
        errors: {
          numberPlate: false,
          marca: false,
          modelo: false,
          color: false,
          serialNumber: false,
          motorNumber: false,
          reason: false
        }
      }
    }
  }
  
  onUpdate = (pattern) => e => {
    const name = e.target.name;
    const value = e.target.value.toUpperCase();
    const regPattern = new RegExp(pattern);
    const hasPattern = regPattern.test(value);

    if(hasPattern) {
      this.setState({
        [name]: value,
        inputs: {
          messages: {
            ...this.state.inputs.messages,
            [name]: defaultMessages[name]
          },
          errors: {
            ...this.state.inputs.errors,
            [name]: !hasPattern
          }
        }
      },() => { 
        this.props.update(this.state);
      });
    }
  }

  onBlur = (pattern) => e => {
    const name = e.target.name;
    const value = e.target.value.toUpperCase().trim();
    const regPattern = new RegExp(pattern);
    const hasPattern = regPattern.test(value);

    this.setState({
      inputs: {
        messages: {
          ...this.state.inputs.messages,
          [name]: hasPattern ? messages.success : messages.error + " " + defaultMessages[name]
        },
        errors: {
          ...this.state.inputs.errors,
          [name]: !hasPattern
        }
      }
    });
  };
  
  
  render(){
  return (
    <React.Fragment>
      <Typography variant="title" gutterBottom>
        Datos
      </Typography>
     
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <TextField
            id="numberPlate"
            name="numberPlate"
            label="Número de placa"
            required
            fullWidth
            value = {this.state.numberPlate}
            helperText={this.state.inputs.messages.numberPlate}
            error={this.state.inputs.errors.numberPlate}
            onChange={this.onUpdate("^(([A-Z]{0,3})|([A-Z]{0,2}[-]{1}[0-9]{0,4})|([A-Z]{0,3}[-]{1}[0-9]{0,3}))$")}
            onBlur={this.onBlur("^(([A-Z]{2}[-]{1}[0-9]{4})|([A-Z]{3}[-]{1}[0-9]{3}))$")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="marca"
            name="marca"
            label="Marca"
            required
            fullWidth
            value = {this.state.marca}
            helperText={this.state.inputs.messages.marca}
            error={this.state.inputs.errors.marca}
            onChange={this.onUpdate("^([A-Z0-9 ]{0,31})$")}
            onBlur={this.onBlur("^([A-Z0-9 ]{1,31})$")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="modelo"
            name="modelo"
            label="Modelo"
            required
            fullWidth
            value = {this.state.modelo}
            helperText={this.state.inputs.messages.modelo}
            error={this.state.inputs.errors.modelo}
            onChange={this.onUpdate("^([A-Z0-9 ]{0,31})$")}
            onBlur={this.onBlur("^([A-Z0-9 ]{1,31})$")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="color"
            name="color"
            label="Color"
            required
            fullWidth
            value = {this.state.color}
            helperText={this.state.inputs.messages.color}
            error={this.state.inputs.errors.color}
            onChange={this.onUpdate("^([A-Z0-9 ]{0,31})$")}
            onBlur={this.onBlur("^([A-Z0-9 ]{1,31})$")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="serialNumber"
            name="serialNumber"
            label="Número de Serie"
            required
            fullWidth
            value = {this.state.serialNumber}
            helperText={this.state.inputs.messages.serialNumber}
            error={this.state.inputs.errors.serialNumber}
            onChange={this.onUpdate("^([A-Z0-9]{0,17})$")}
            onBlur={this.onBlur("^([A-Z0-9]{13,17})$")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="motorNumber"
            name="motorNumber"
            label="Número de Motor"
            required
            fullWidth
            value = {this.state.motorNumber}
            helperText={this.state.inputs.messages.motorNumber}
            error={this.state.inputs.errors.motorNumber}
            onChange={this.onUpdate("^([A-Z0-9]{0,10})$")}
            onBlur={this.onBlur("^([A-Z0-9]{10})$")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="reason"
            name="reason"
            label="Razón"
            required
            fullWidth
            value = {this.state.reason}
            helperText={this.state.inputs.messages.reason}
            error={this.state.inputs.errors.reason}
            onChange={this.onUpdate("^([A-Z0-9 ]{0,31})$")}
            onBlur={this.onBlur("^([A-Z0-9 ]{1,31})$")}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );}
}

export default VehicleInfo;