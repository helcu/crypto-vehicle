import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


const styles = theme => ({});

class HomeView extends React.Component{

    constructor(props){
        super(props)


    }

    render(){
        return <p>home</p>
    }
}

HomeView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeView);