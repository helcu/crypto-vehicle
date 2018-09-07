import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


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
      minWidth: 700,
  },
});

let id = 0;
//var rows = [];

class OwnersVehicle extends React.Component {

  constructor(props){

    super(props);

    this.state = {
      owners : props.owners,
      dni : "",
      name : ""
    };

    this.createData = this.createData.bind(this);
    this.addRow = this.addRow.bind(this);
    this.addButton = this.addButton.bind(this);
   };


  createData(dni, name) {
    console.log(dni + name);
    id += 1;
    return { id, dni, name};
  }

  addRow(newItem){
    this.setState({owners: [...this.state.owners,newItem ]}, () =>{ this.props.update(this.state)});
  }

  addButton(){
    const dni = this.state.dni;
    const name = this.state.name;

    if(dni.length===0 || name.length===0){
      alert("Ambos campos son obligatorios.");
      return;
    }

    const addobj = this.createData(this.state.dni, this.state.name);
    this.addRow(addobj);
    this.setState({name: "", dni:""});
  }

  handleInputChange = (name, pattern) => event => {
    var regPattern = new RegExp(pattern);
    var hasPattern = regPattern.test(event.target.value);

    if(hasPattern) {
      this.setState({
        [name]: event.target.value,
      });
    } 
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
            value={this.state.dni}
            inputProps={{ maxLength: 8 }}
            helperText="(max. 8)"
            onChange={this.handleInputChange('dni', "^[0-9]{0,8}$")}
          />
        </Grid>
           
        <Grid item xs={12} sm={6}  >
          <TextField
            id="nameOwner"
            name="nameOwner"
            label="Nombre"
            fullWidth
            value={this.state.name}
            inputProps={{ maxLength: 31 }}
            helperText="(max. 31)"
            onChange={this.handleInputChange('name', "^[a-zA-Z ]{0,31}$")}
            onBlur={() => alert("quesito")}
          />
        </Grid>

        <Grid container xs={12} direction="row"  justify="flex-end" alignItems="center" >
          <Button variant="contained" color="primary" className={classes.button} onClick = {this.addButton} >
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
            <TableCell>Opciones</TableCell>         
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.owners.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.dni}
                </TableCell>
                <TableCell >{row.name}</TableCell>      
                <TableCell ><IconButton className={classes.button} aria-label="Delete">
        <DeleteIcon />
      </IconButton></TableCell>         
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