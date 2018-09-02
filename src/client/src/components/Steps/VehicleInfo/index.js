import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class VehicleInfo extends React.Component {

  constructor(props){
    super(props);

    this.state = {

      numberPlate: props.numberPlate

    }

  }

onUpdate = (e) =>{

  console.log(e.target.value);
  this.setState({numberPlate: e.target.value},() =>{ this.props.update(this.state); })
  console.log(this.state);
  

}
  render(){
  return (
    <React.Fragment>
      <Typography variant="title" gutterBottom>
      Información del vehiculo
      </Typography>
     
      <Grid container spacing={24}>
       
        <Grid item xs={12}>
          <TextField
            id="numberPlate"
            name="numberPlate"
            label="Numero de placa"
            fullWidth
            value = {this.state.numberPlate}
            autoComplete="billing address-line2"
            onChange={this.onUpdate}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="marca"
            name="marca"
            label="Marca"
            fullWidth
            autoComplete="billing address-line2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="modelo"
            name="modelo"
            label="Modelo"
            fullWidth
            autoComplete="billing address-line2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="color"
            name="color"
            label="Color"
            fullWidth
            autoComplete="billing address-line2"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="serialNumber"
            name="serialNumber"
            label="Numero Serial"
            fullWidth
            autoComplete="billing address-line2"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="motorNumber"
            name="motorNumber"
            label="Numero de Motor"
            fullWidth
            autoComplete="billing address-line2"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="reason"
            name="reason"
            label="Razón"
            fullWidth
            autoComplete="billing address-line2"
          />
        </Grid>
        
      </Grid>

    </React.Fragment>
  );}
}

export default VehicleInfo;