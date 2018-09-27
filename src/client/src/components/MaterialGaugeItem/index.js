import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import {Typography, Paper, Grid, Icon} from '@material-ui/core';

// @material-ui/icons
import Warning from "@material-ui/icons/Warning";
import Language from "@material-ui/icons/Language";
/*import Store from "@material-ui/icons/Store";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";*/

// creative-tim/material_dashboard/core
import GridItem from "../../components-ui/Grid/GridItem.jsx";
//import GridContainer from "../../components-ui/Grid/GridContainer.jsx";
import Danger from "../../components-ui/Typography/Danger.jsx";
import Card from "../../components-ui/Card/Card.jsx";
import CardHeader from "../../components-ui/Card/CardHeader.jsx";
import CardIcon from "../../components-ui/Card/CardIcon.jsx";
import CardFooter from "../../components-ui/Card/CardFooter.jsx";
//import CardBody from "../../components-ui//Card/CardBody.jsx";

const styles = theme => ({
  upArrowCardCategory: {
    width: "16px",
    height: "16px"
  },
  stats: {
    color: "#999999",
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  cardCategory: {
    color: "#999999",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitle: {
    color: "#3C4858",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontWeight: "400",
      lineHeight: "1"
    }
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
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader stats icon>
            <CardIcon color="warning">
              <Language />
            </CardIcon>
            <p className={classes.cardCategory}>Used Space</p>
            <h3 className={classes.cardTitle}>
              49/50 <small>GB</small>
            </h3>
          </CardHeader>
          <CardFooter stats>
            <div className={classes.stats}>
              <Danger>
                <Warning />
              </Danger>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                Get more space
                  </a>
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    )
  }
}

GaugeItem.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GaugeItem);