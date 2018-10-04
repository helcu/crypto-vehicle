import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './components/ListItem';
import Button from '@material-ui/core/Button';
import { Route, Switch, Redirect } from 'react-router-dom';
import RegisterView from './components/RegisterView'
import SearchView from './components/SearchView'
import HomeView from './components/HomeView'
import UpdateView from './components/UpdateView'
import AdminView from './components/AdminView';
import DrizzleMaterialForm from './components/DrizzleMaterialForm';
import EmployeeView from './components/EmployeeView';
import Particles from 'react-particles-js'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
});

class Main extends React.Component {
  state = {
    open: true,
    home: true
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  setHomeFalse = () => {
    this.setState({ home: false});
  };

  render() {
    const { classes } = this.props;

    if(this.state.home){
      return(
        <div>
          <div id="particles-js">
                <Particles 
                params={{
                  particles: {
                    number: {
                      value: 25,
                      density: {
                        enable: true,
                        value_area: 800
                      }
                    }
                  }
                }}
                  />
                  </div>
                  <div id="message">
                    <Typography variant="headline" align="center">Crypto Car</Typography>
                    <br/>
                    <Typography variant="body2" align="center">Bienvenido!</Typography>
                    <Button variant="contained" size="large" style={{backgroundColor: "#3f51b5", color: "white"}} onClick={this.setHomeFalse}>
                      Continuar
                    </Button>
                  </div>
        </div>
      )
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
          >
            <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden,
                )}
              >
                <MenuIcon />

              </IconButton>
              <Typography variant="title" color="inherit" noWrap className={classes.title}>
                CryptoVehicle
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>{mainListItems}</List>
            <Divider />
            <List>{secondaryListItems}</List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            <Switch>
              <Route
                path="/home"
                component={HomeView} />
              <Route
                exact
                path="/register"
                component={RegisterView} />
              <Route
                exact
                path="/search"
                component={SearchView} />
              <Route
                exact
                path="/update/:id"
                render={(props) => <UpdateView {...props}  />} />
              <Route
              exact
              name="adminEdit"
              path="/admins/edit"
              render={(state) => <DrizzleMaterialForm params={state} contract="Authorizable" method="setAdministrator" title="Edit Admin" to="/admins"  labels={["Address","DNI","Nombre"]} lenghts={[50,32,32]} inputTypes={["text","number","text"]}/>}/>
              <Route
                exact
                path="/admins/add"
                render={() => <DrizzleMaterialForm contract="Authorizable" method="setAdministrator" title="Add Admin" to="/admins" labels={["Address","DNI","Nombre"]} lenghts={[50,32,32]} inputTypes={["text","number","text"]}/>}/>              
              <Route
                path="/admins"
                render={() => <AdminView contract="Authorizable" method="getEmployeesAdress"/>} />
                <Route
                exact
                path="/employees/edit"
                render={(state) => <DrizzleMaterialForm params={state} contract="Authorizable" method="setEmployee" title="Edit Employee" to="/employees" labels={["Address","DNI","Nombre"]} lenghts={[50,32,32]} inputTypes={["text","number","text"]}/>}/>
              <Route
                exact
                path="/employees/add"
                render={() => <DrizzleMaterialForm contract="Authorizable" method="setEmployee" title="Add Employee" to="/employees" labels={["Address","DNI","Nombre"]} lenghts={[50,32,32]} inputTypes={["text","number","text"]}/>}/>     
              <Route
                path="/employees"
                render={() => <EmployeeView contract="Authorizable" method="getEmployeesAdress"/>} />
              <Route
                exact
                path="/employees"
                render={() => <p> employees </p>} />
              <Redirect
                from="/"
                to="/home" />
              
              <Route
                render={() => <p>  error </p>} />
            </Switch>

          </main>
        </div>
      </React.Fragment>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);