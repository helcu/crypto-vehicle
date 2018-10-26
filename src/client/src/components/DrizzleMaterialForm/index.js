import React from 'react'
import { Grid, TextField, Typography, Paper, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
//import web3 from 'web3'


const defaultMessages = {
  success: 'Cumple',
  error: 'No cumple el formato.',
  _toAdd: 'mín. 42',
  _dni: 'mín. 8',
  _name: 'máx. 31'
};

const inputsPattern = {
  onChange: {
    _toAdd: /^([a-zA-Z0-9]{0,42})$/,
    _dni: /^([0-9]{0,8})$/,
    _name: /^([A-Z ]{0,31})$/
  },
  onBlur: {
    _toAdd: /^([a-zA-Z0-9]{42})$/,
    _dni: /^([0-9 ]{8})$/,
    _name: /^([A-Z ]{1,31})$/
  }
};


class DrizzleMaterialForm extends React.Component {
  constructor(props, context) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    // names is use to store the names of the properties of this.params.location.state
    this.names = ["address", "dni", "name"];

    this.contracts = context.drizzle.contracts;
    const abi = this.contracts[this.props.contract].abi;

    this.inputs = [];
    var initialState = {};

    for (var i = 0; i < abi.length; i++) {
      if (abi[i].name === this.props.method) {
        this.inputs = abi[i].inputs;
        for (var j = 0; j < this.inputs.length; j++) {
          //If we have params we retrieve the data
          initialState[this.inputs[j].name] = this.props.params ? this.props.params.location.state[this.names[j]] : '';
        }
        break;
      }
    }

    this.state = {
      ...initialState,
      inputs: {
        messages: defaultMessages,
        errors: {
          _dni: false,
          _name: false,
          _toAdd: false
        }
      }
    };
  }


  handleSubmit = async (e) => {
    var errors = false;
    var message = "";
    for (var i = 0; i < this.inputs.length; i++) {

      const name = this.inputs[i].name;
      let value = this.state[this.inputs[i].name];
      const regPattern = new RegExp(inputsPattern.onBlur[name]);
      const hasPattern = regPattern.test(value);

      if (this.state[this.inputs[i].name] === '' || !hasPattern) {
        e.preventDefault();
        message += 'El campo "' + this.props.labels[i] + '" no cumple el formato.\n';
        errors = true;
      }
    }

    var inputs = {};
    this.inputs.forEach((input, index) => {
      var asciiValue = "";
      if (index === 0)
        asciiValue = this.state[input.name]
      else {
        if (this.state[input.name])
          asciiValue = this.context.drizzle.web3.utils.fromAscii(this.state[input.name], 32);
        else
          asciiValue += "0x00000000000000000000"
      }

      inputs[input.name] = asciiValue;
    });

    try {
      if (!errors) {
        let cachedSend = "";
        if (this.props.sendArgs) {
          cachedSend = this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(inputs), this.props.sendArgs);
        }

        cachedSend = await this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(inputs));
        console.log("cachedSend", cachedSend);
        this.props.updateStates({
          stackId: cachedSend
        });
      } else {
        alert(message);
      }
    } catch (e) {
      console.warn(e);
      this.props.updateStates({
        stackId: -1
      });
    }
  }

  onChange = () => e => {
    const name = e.target.name;
    let value = e.target.value.replace(/\s\s+/g, ' ');
    if (name !== "_toAdd") {
      value = value.toUpperCase();
    }
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
        }
      });
    }
  }

  onBlur = () => e => {
    const name = e.target.name;
    let value = e.target.value.trim();
    if (name !== "_toAdd") {
      value = value.toUpperCase();
    }
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


  render() {
    return (
      <div style={{ width: "100%", textAlign: "center" }}>
        <Paper style={{ width: 500, height: 400, padding: 1, display: "inline-block", textAlign: "initial" }} elevation={1}>
          <div style={{ margin: 25 }}>
            <Typography variant="title" align="center" style={{ margin: 15 }}>
              {this.props.title}
            </Typography>
            <Grid container spacing={24}>
              {this.inputs.map((input, index) => {
                var inputLabel = this.props.labels ? this.props.labels[index] : input.name;
                return (
                  <Grid key={index} item xs={12}>
                    <TextField
                      id={input.name}
                      name={input.name}
                      label={inputLabel}
                      required={!this.props.disabled}
                      fullWidth
                      autoComplete="off"
                      value={this.state[input.name]}
                      helperText={this.state.inputs.messages[input.name]}
                      disabled={input.name === '_toAdd' ? this.props.disabled : false}
                      error={this.state.inputs.errors[input.name]}
                      onChange={this.onChange()}
                      onBlur={this.onBlur()}

                    /*required
                    type={inputType}
                    placeholder={inputLabel}
                    margin="normal"
                    style={{ margin: 10 }}*/ />
                  </Grid>
                )
              })}
              <Grid
                key={-1} item xs={12}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                <Button component={Link} to={this.props.to} variant="contained"
                  size="large" color="primary" style={{ marginLeft: 10 }}>
                  CANCELAR
                </Button>
                <Button component={Link} to={this.props.to} variant="contained"
                  size="large" color="primary" style={{ marginLeft: 10 }}
                  onClick={this.handleSubmit}>
                  GUARDAR
                </Button>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </div>
    )
  }
}

DrizzleMaterialForm.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    contracts: state.contracts,
  }
}

export default drizzleConnect(DrizzleMaterialForm, mapStateToProps)