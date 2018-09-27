import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button, TextField, Typography, Grid,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  table: {
    marginTop: 20,
    minWidth: 700,
  },
});


const defaultMessages = {
  success: 'Cumple',
  error: 'No cumple el formato.',
  dni: 'mín. 8',
  name: 'máx. 31'
};

const inputsPattern = {
  onChange: {
    dni: /^[0-9]{0,8}$/,
    name: /^[A-Z ]{0,31}$/
  },
  onBlur: {
    dni: /^[0-9]{8}$/,
    name: /^[A-Z ]{1,31}$/
  }
};

let id = 0;

class OwnersVehicle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dialog: this.props.dialog,
      owners: props.owners,
      dni: "",
      name: "",
      inputs: {
        messages: defaultMessages,
        errors: {
          dni: false,
          name: false
        }
      }
    };

    id = props.owners.length;
  };


  createData = (dni, name) => {
    console.log(dni, name);
    id += 1;
    return { id, dni, name };
  }

  addRow = (newItem) => {
    this.setState({
      owners: [...this.state.owners, newItem]
    }, () => {
      this.props.update(this.state);
    });
  }

  addOwner = async () => {
    const inputs = this.state.inputs;
    const dni = this.state.dni;
    const name = this.state.name;

    if (dni.length === 0 || name.length === 0) {
      this.setState({
        dialog: {
          open: true,
          title: 'Aviso',
          description: 'Ambos campos son obligatorios.'
        }
      }, () => {
        this.props.update(this.state);
      });
      return;
    }

    await this.validateInputs();

    const invalidInputs = Object.entries(inputs.errors).filter((e) => {
      return e[1] === true;
    });

    if (invalidInputs.length > 0) {
      this.setState({
        dialog: {
          open: true,
          title: 'Aviso',
          description: 'Algunos campos no cumplen con el formato.'
        }
      }, () => {
        this.props.update(this.state);
      });
      return;
    }

    const equalDni = this.state.owners.filter(o => {
      return o.dni === dni;
    });

    if (equalDni.length > 0) {
      this.setState({
        dialog: {
          open: true,
          title: 'Aviso',
          description: 'El DNI no puede repetirse.'
        }
      }, () => {
        this.props.update(this.state);
      });
      return;
    }

    const addObj = this.createData(this.state.dni, this.state.name);
    this.addRow(addObj);
    this.setState({
      name: "",
      dni: "",
      inputs: {
        messages: defaultMessages,
        errors: {
          dni: false,
          name: false
        }
      },
      dialog: {
        open: false,
        title: '',
        description: ''
      }
    });
  }

  deleteOwner = (dni) => {
    const owners = this.state.owners.filter((o) => {
      return o.dni !== dni;
    });

    this.setState({
      owners: owners
    }, () => {
      this.props.update(this.state)
    });
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
        dialog: {
          open: false,
          title: '',
          description: ''
        }
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
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Typography variant="title" gutterBottom>
          Propietarios
        </Typography>

        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="dni"
              name="dni"
              label="DNI"
              fullWidth
              autoComplete="off"
              value={this.state.dni}
              helperText={this.state.inputs.messages.dni}
              error={this.state.inputs.errors.dni}
              onChange={this.onChange()}
              onBlur={this.onBlur()} />
          </Grid>

          <Grid item xs={12} sm={6} >
            <TextField
              id="name"
              name="name"
              label="Nombre"
              fullWidth
              autoComplete="off"
              value={this.state.name}
              helperText={this.state.inputs.messages.name}
              error={this.state.inputs.errors.name}
              onChange={this.onChange()}
              onBlur={this.onBlur()} />
          </Grid>
          <Grid container item xs={12} sm={12} direction="row" justify="flex-end" alignItems="center">
            <Button variant="contained" color="primary" className={classes.button}
              onClick={this.addOwner}>
              Agregar
              <AddIcon className={classes.rightIcon} />
            </Button>
          </Grid>
        </Grid>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>DNI</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.owners.map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.dni}
                  </TableCell>
                  <TableCell>
                    {row.name}
                  </TableCell>
                  <TableCell>
                    <DeleteIcon onClick={() => { this.deleteOwner(row.dni) }} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

OwnersVehicle.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OwnersVehicle);