import React from 'react'
import PropTypes from 'prop-types';
import { Paper, Typography, Grid, CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ClassIcon from '@material-ui/icons/Class';
import BuildIcon from '@material-ui/icons/Build';
import EyeIcon from '@material-ui/icons/Visibility';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

/*import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';*/

import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';


const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#102027',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}


const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 3,
    minHeight: 400,
    width: 'auto',
  },
  margin: {
    padding: 15,
  },
  table: {

  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class DetailBody extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      numberPlate: props.vehicle.numberPlate,
      brand: props.vehicle.brand,
      model: props.vehicle.model,
      color: props.vehicle.color,
      numberSerie: props.vehicle.serialNumber,
      numberMotor: props.vehicle.motorNumber,
      reason: props.vehicle.reason,
      photos: props.vehicle.photos,
      owners: props.vehicle.owners,
      documents: props.vehicle.documents.map((obj, i) => {
        if (i < props.vehicle.documents.length / 2) {
          return (
            {
              name: props.vehicle.documents[i + props.vehicle.documents.length / 2],
              url: obj,
            }
          )
        } else {
          return ({});
        }
      }).splice(0, props.vehicle.documents.length / 2),
      images: props.vehicle.photos != '' ? props.vehicle.photos.map((obj, i) => {
        if (i < props.vehicle.photos.length / 2) {
          return ({
            original: 'https://gateway.ipfs.io/ipfs//' + obj,
            thumbnail: 'https://gateway.ipfs.io/ipfs//' + obj,
          })
        } else {
          return ({});
        }

      }).splice(0, props.vehicle.photos.length / 2) : [{
        original: require('../Images/car.png'),
        thumbnail: require('../Images/car.png'),
      }],
      logs: props.logs,
      selectedIndex: 0,
    }
  }


  showDoc = (url) => {
    window.open('https://gateway.ipfs.io/ipfs//' + url, "_blank")
  }

  handleListItemClick = (index) => {
    let vehiLog = this.state.logs[index];

    this.setState({
      color: vehiLog.vehicle.color,
      numberSerie: vehiLog.vehicle.serialNumber,
      numberMotor: vehiLog.vehicle.motorNumber,
      reason: vehiLog.vehicle.reason,
      photos: vehiLog.vehicle.photos.split(","),
      owners: vehiLog.vehicle.owners,

      documents: vehiLog.vehicle.documents.split(",").map((obj, i) => {
        if (i < vehiLog.vehicle.documents.split(",").length / 2) {
          return (
            {
              name: vehiLog.vehicle.documents.split(",")[i + vehiLog.vehicle.documents.split(",").length / 2],
              url: obj,
            }
          )
        } else {
          return ({});
        }
      }).splice(0, vehiLog.vehicle.documents.split(",").length / 2),

      images: vehiLog.vehicle.photos !== '' ? vehiLog.vehicle.photos.split(",").map((obj, i) => {
        if (i < vehiLog.vehicle.photos.split(",").length / 2) {
          return ({
            original: 'https://gateway.ipfs.io/ipfs//' + obj,
            thumbnail: 'https://gateway.ipfs.io/ipfs//' + obj,
          })
        } else {
          return ({});
        }
      }).splice(0, vehiLog.vehicle.photos.split(",").length / 2) : [{
        original: require('../Images/car.png'),
        thumbnail: require('../Images/car.png'),
      }]
    }, () => {
      console.log(this.state);
    })

    this.setState({ selectedIndex: index });
  };


  render() {
    const { classes } = this.props;
    return (
      <div>
        <CssBaseline />
        <main className={classes.layout}>
          <Grid container >
            <Grid container xs={8} >
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography variant="title" color="inherit">
                    Detalle
                  </Typography>
                  <Grid container>
                    <Grid container xs={6} className={classes.margin} >
                      <Grid item xs={12}>
                        <ImageGallery items={this.state.images} />
                      </Grid>
                    </Grid>
                    <Grid container xs={6} justify="flex-start">
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          PLACA: {this.state.numberPlate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          MARCA: {this.state.brand}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          MODELO: {this.state.model}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          COLOR: {this.state.color}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          NÚM SERIE: {this.state.numberSerie}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          NÚM MOTOR: {this.state.numberMotor}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          RAZON: {this.state.reason}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Typography variant="title" color="inherit">
                    Documentos
                  </Typography>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <CustomTableCell>Nombre</CustomTableCell>
                        <CustomTableCell>Visualizar</CustomTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.documents.map((row) => {
                        return (
                          <TableRow className={classes.row} key={row.id}>
                            <CustomTableCell component="th" scope="row">
                              {row.name}
                            </CustomTableCell>
                            <CustomTableCell>
                              <EyeIcon onClick={() => { this.showDoc(row.url) }} /></CustomTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Typography variant="title" color="inherit">
                    Propietarios
                  </Typography>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <CustomTableCell>DNI</CustomTableCell>
                        <CustomTableCell>Nombre</CustomTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.owners.map((row) => {
                        return (
                          <TableRow className={classes.row} key={row.id}>
                            <CustomTableCell component="th" scope="row">
                              {row.dni}
                            </CustomTableCell>
                            <CustomTableCell>
                              {row.name}
                            </CustomTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>

            <Grid item xs={4}>
              <Paper className={classes.paper}>
                <Typography variant="title" color="inherit">
                  Historial
                </Typography>

                <List component="nav">
                  {
                    this.state.logs.map((obj, index) => (
                      <ListItem
                        button
                        selected={this.state.selectedIndex === index}
                        onClick={() => this.handleListItemClick(index)}>
                        <ListItemIcon>
                          {obj.event == 'VehicleRegistered' ? <ClassIcon /> : <BuildIcon />}
                        </ListItemIcon>
                        {obj.event == 'VehicleRegistered' ? <ListItemText primary={obj.timestamp} secondary={'Registro'} /> : <ListItemText primary={obj.timestamp} secondary={'Actualización'} />}
                      </ListItem>
                    ))
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </main>
      </div>
    )
  }
}

DetailBody.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DetailBody);