import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';

const defaultMessages = {
  success: 'Cumple',
  error: 'No cumple el formato.',
  numberPlate: 'e.g., AB-1234 o A1C-234',
  marca: 'máx. 31',
  modelo: 'máx. 31',
  color: 'máx. 31',
  serialNumber: 'e.g., KZN1854028170',
  motorNumber: 'e.g., 1KZ0600558',
  reason: 'máx. 31'
};

const inputsPattern = {
  onChange: {
    numberPlate: /^(([A-Z0-9]{0,3})|([A-Z0-9]{0,2}[-]{1}[0-9]{0,4})|([A-Z0-9]{0,3}[-]{1}[0-9]{0,3}))$/,
    marca: /^([A-Z0-9 ]{0,31})$/,
    modelo: /^([A-Z0-9 ]{0,31})$/,
    color: /^([A-Z0-9 ]{0,31})$/,
    serialNumber: /^([A-Z0-9]{0,17})$/,
    motorNumber: /^([A-Z0-9]{0,10})$/,
    reason: /^([A-Z0-9 ]{0,31})$/,
  },
  onBlur: {
    numberPlate: /^(([A-Z0-9]{2}[-]{1}[0-9]{4})|([A-Z0-9]{3}[-]{1}[0-9]{3}))$/,
    marca: /^([A-Z0-9 ]{1,31})$/,
    modelo: /^([A-Z0-9 ]{1,31})$/,
    color: /^([A-Z0-9 ]{1,31})$/,
    serialNumber: /^([A-Z0-9]{13,17})$/,
    motorNumber: /^([A-Z0-9]{10})$/,
    reason: /^([A-Z0-9 ]{1,31})$/,
  }
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
      },
      disabled: false
    }

    console.log("VehicleInfo", this.state);
  }

  /*componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    this.setState(
      ...this.state,
      nextProps.vehicleData
    );
  }*/


  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.marca !== prevState.marca &&
      nextProps.modelo !== prevState.modelo &&
      nextProps.color !== prevState.color &&
      nextProps.serialNumber !== prevState.serialNumber &&
      nextProps.motorNumber !== prevState.motorNumber &&
      nextProps.reason !== prevState.reason) {
      return {
        numberPlate: nextProps.numberPlate,
        marca: nextProps.marca,
        modelo: nextProps.modelo,
        color: nextProps.color,
        serialNumber: nextProps.serialNumber,
        motorNumber: nextProps.motorNumber,
        reason: nextProps.reason
      };
    }
    else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log(prevProps, prevState);
    if (
      prevProps.marca !== this.state.marca &&
      prevProps.modelo !== this.state.modelo &&
      prevProps.color !== this.state.color &&
      prevProps.serialNumber !== this.state.serialNumber &&
      prevProps.motorNumber !== this.state.motorNumber &&
      prevProps.reason !== this.state.reason) {
      this.setState({
        ...prevProps,
        ...this.props
      }, () => {
        this.state.update(this.state);
      });
    }
  }


  onChange = () => e => {
    const name = e.target.name;
    const value = e.target.value.toUpperCase().replace(/\s\s+/g, ' ');
    const regPattern = new RegExp(inputsPattern.onChange[name]);
    const hasPattern = regPattern.test(value);

    if (hasPattern) {
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
        },
        disabled: this.props.disabled
      }, () => {
        this.props.update(this.state);
      });
    }
  }

  onBlur = () => e => {
    const name = e.target.name;
    const value = e.target.value.toUpperCase().trim();
    const regPattern = new RegExp(inputsPattern.onBlur[name]);
    const hasPattern = regPattern.test(value);

    this.setState({
      [name]: value,
      inputs: {
        messages: {
          ...this.state.inputs.messages,
          [name]: hasPattern ? defaultMessages.success : defaultMessages.error + " " + defaultMessages[name]
        },
        errors: {
          ...this.state.inputs.errors,
          [name]: !hasPattern
        }
      }
    });
  };

  validateInputs = async () => {

    const invalidInputs = Object.entries(inputsPattern.onBlur).map((e) => {
      const name = e[0];
      const value = this.state[name].toUpperCase().trim();
      const regPattern = new RegExp(inputsPattern.onBlur[name]);
      const hasPattern = regPattern.test(value);
      return [
        [name],
        hasPattern ? defaultMessages.success : defaultMessages.error + " " + defaultMessages[name],
        !hasPattern
      ];
    });

    var messages = Object.assign(...invalidInputs.map(d => ({ [d[0]]: d[1] })));
    var errors = Object.assign(...invalidInputs.map(d => ({ [d[0]]: d[2] })));

    this.setState({
      inputs: {
        messages: messages,
        errors: errors
      }
    }, () => {
      this.props.update(this.state);
    });
  };


  render() {
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
              required={!this.props.disabled}
              fullWidth
              autoComplete="off"
              value={this.state.numberPlate}
              helperText={this.props.disabled ? "" : this.state.inputs.messages.numberPlate}
              disabled={this.props.disabled}
              error={this.state.inputs.errors.numberPlate}
              onChange={this.onChange()}
              onBlur={this.onBlur()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="marca"
              name="marca"
              label="Marca"
              required={!this.props.disabled}
              fullWidth
              autoComplete="off"
              value={this.state.marca}
              helperText={this.props.disabled ? "" : this.state.inputs.messages.marca}
              disabled={this.props.disabled}
              error={this.state.inputs.errors.marca}
              onChange={this.onChange()}
              onBlur={this.onBlur()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="modelo"
              name="modelo"
              label="Modelo"
              required={!this.props.disabled}
              fullWidth
              autoComplete="off"
              value={this.state.modelo}
              helperText={this.props.disabled ? "" : this.state.inputs.messages.modelo}
              disabled={this.props.disabled}
              error={this.state.inputs.errors.modelo}
              onChange={this.onChange()}
              onBlur={this.onBlur()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="color"
              name="color"
              label="Color"
              required
              fullWidth
              autoComplete="off"
              value={this.state.color}
              helperText={this.state.inputs.messages.color}
              error={this.state.inputs.errors.color}
              onChange={this.onChange()}
              onBlur={this.onBlur()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="serialNumber"
              name="serialNumber"
              label="Número de Serie"
              required
              fullWidth
              autoComplete="off"
              value={this.state.serialNumber}
              helperText={this.state.inputs.messages.serialNumber}
              error={this.state.inputs.errors.serialNumber}
              onChange={this.onChange()}
              onBlur={this.onBlur()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="motorNumber"
              name="motorNumber"
              label="Número de Motor"
              required
              fullWidth
              autoComplete="off"
              value={this.state.motorNumber}
              helperText={this.state.inputs.messages.motorNumber}
              error={this.state.inputs.errors.motorNumber}
              onChange={this.onChange()}
              onBlur={this.onBlur()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="reason"
              name="reason"
              label="Razón"
              required
              fullWidth
              autoComplete="off"
              value={this.state.reason}
              helperText={this.state.inputs.messages.reason}
              error={this.state.inputs.errors.reason}
              onChange={this.onChange()}
              onBlur={this.onBlur()} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default VehicleInfo;