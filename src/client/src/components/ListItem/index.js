import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CommuteIcon from '@material-ui/icons/Commute';
import SearchIcon from '@material-ui/icons/Search';
//import BarChartIcon from '@material-ui/icons/BarChart';
//import LayersIcon from '@material-ui/icons/Layers';
import BuildIcon from '@material-ui/icons/Build';
import GroupIcon from '@material-ui/icons/Group';
import { Link } from 'react-router-dom';


export const dashboardListItems = (
  <Link to='/home' style={{ textDecoration: 'none' }} replace={true} >
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Inicio" />
    </ListItem>
  </Link>
);

export const mainListItems = (
  <List
    component="nav"
    subheader={<ListSubheader inset>Vehículos</ListSubheader>}>
    <Link to='/search' style={{ textDecoration: 'none' }} replace={true} >
      <ListItem button>
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <ListItemText primary="Consulta" />
      </ListItem>
    </Link>
    <Link to='/register' style={{ textDecoration: 'none' }} replace={true} >
      <ListItem button>
        <ListItemIcon>
          <CommuteIcon />
        </ListItemIcon>
        <ListItemText primary="Registro" />
      </ListItem>
    </Link>
  </List>
);

export const secondaryListItems = (
  <List
    component="nav"
    subheader={<ListSubheader inset>Accesos</ListSubheader>}>
    <ListItem component={Link} to="/admins" button>
      <ListItemIcon>
        <BuildIcon />
      </ListItemIcon>
      <ListItemText primary="Administradores" />
    </ListItem>
    <ListItem component={Link} to="/employees" button>
      <ListItemIcon>
        <GroupIcon />
      </ListItemIcon>
      <ListItemText primary="Trabajadores" />
    </ListItem>
  </List>
);