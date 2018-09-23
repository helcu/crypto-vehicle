import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
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
      marginBottom: theme.spacing.unit * 1,
      padding: theme.spacing.unit * 3,
    },
  }
});


class GaugeItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return {
        value: nextProps.value
      };
    }
    else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== prevState.value) {
      this.setState({
        ...prevProps,
        ...this.props
      });
    }
  }


  render() {
    const { classes } = this.props;

    return (
      <Grid item sm={3}>
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center" >
            {this.props.title}
          </Typography>
          <Typography variant="display3" align="center">
            {this.state.value}
          </Typography>
        </Paper>
      </Grid>
    )
  }
}

GaugeItem.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GaugeItem);