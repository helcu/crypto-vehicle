import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import DetailBody from '../DetailBody'

const styles = {
  card: {
    maxWidth: 345,
    minWidth: 344,
    marginBottom: 32,
    marginLeft: 32,
    boxShadow: '0 3px 5px 2px rgba(64, 64, 64, .3)',
  },
  media: {
    objectFit: 'cover',
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  Button: {
    background: 'white',
    color: 'black',
  },
  action: {
    maxWidth: 345,
    minWidth: 344,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ImgMediaCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      numberPlate: props.numberPlate,
      brand: props.brand,
      model: props.model,
      image: 'https://gateway.ipfs.io/ipfs//' + props.image,
      open: false,
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };


  render() {

    const { classes } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardActionArea className={classes.action}>
            <CardMedia
              component="img"
              className={classes.media}
              height="140"
              image={this.state.image}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                {this.state.numberPlate}
              </Typography>

              <Grid container container
                direction="row"
                justify="space-around"
                alignItems="center">

                <Typography gutterBottom component="h2">
                  Marca:  {this.state.brand}
                </Typography>


                <Typography gutterBottom component="h2">
                  Modelo: {this.state.model}
                </Typography>


              </Grid>

            </CardContent>
          </CardActionArea>
          <CardActions>
            <Grid container container
              direction="row"
              justify="flex-end"
              alignItems="center">
              <Button size="small" color="primary" onClick={this.handleClickOpen} className={classes.Button} >
                Detalle
        </Button>
            </Grid>
          </CardActions>
        </Card>

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
              <Button color="inherit" onClick={this.handleClose}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <DetailBody />
        </Dialog>
      </div>
    );
  }
}

ImgMediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImgMediaCard);