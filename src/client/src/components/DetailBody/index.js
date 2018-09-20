import React from 'react'
import PropTypes from 'prop-types';
import { Paper, Typography, Grid, CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';



const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
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

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];



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
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        minHeight: 400,
        width: 'auto',

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
            owners: props.vehicle.owners
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <CssBaseline />
                <main className={classes.layout}>
                    <Grid container spacing={24}>
                        <Grid container xs={8} >
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <Typography variant="title" color="inherit">
                                        Detalle
                                     </Typography>

                                    <Grid container >
                                        <Grid container xs={6} >
                                            <Grid item xs={12}>
                                                <Carousel>
                                                    {this.state.photos != '' ?
                                                        this.state.photos.map((obj) => {
                                                            <div>
                                                                <img src={'https://gateway.ipfs.io/ipfs//' + obj} />
                                                                <p className="legend">descripcion</p>
                                                            </div>
                                                        }) : <div>
                                                            <img src={require('../Images/car.png')} />
                                                            <p className="legend">descripcion</p>
                                                        </div>

                                                    }


                                                </Carousel>

                                            </Grid>
                                        </Grid>
                                        <Grid container xs={6} >
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
                                                    NUM SERIE: {this.state.numberSerie}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography variant="body2" gutterBottom>
                                                    NUM MOTOR: {this.state.numberMotor}
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
                                                        <CustomTableCell>{row.name}</CustomTableCell>

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
                                    <ListItem
                                        button


                                    >
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Inbox" />
                                    </ListItem>
                                    <ListItem
                                        button


                                    >
                                        <ListItemIcon>
                                            <DraftsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Drafts" />
                                    </ListItem>
                                </List>
                                <Divider />
                                <List component="nav">
                                    <ListItem
                                        button


                                    >
                                        <ListItemText primary="Trash" />
                                    </ListItem>
                                    <ListItem
                                        button

                                    >
                                        <ListItemText primary="Spam" />
                                    </ListItem>
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


