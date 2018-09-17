import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CommuteIcon from '@material-ui/icons/Commute';
import SearchIcon from '@material-ui/icons/Search';
//import BarChartIcon from '@material-ui/icons/BarChart';
//import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <div>
    <Link to='/home' style={{ textDecoration: 'none' }} replace={true} >
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Inicio" />
      </ListItem>
    </Link>
    <Link to='/search' style={{ textDecoration: 'none' }} replace={true} >
      <ListItem button>
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <ListItemText primary="Consulta Vehicular" />
      </ListItem>
    </Link>
    <Link to='/register' style={{ textDecoration: 'none' }} replace={true} >
      <ListItem button>
        <ListItemIcon>
          <CommuteIcon />
        </ListItemIcon>
        <ListItemText primary="Registro Vehicular" />
      </ListItem>
    </Link>
    <Link to='/update' style={{ textDecoration: 'none' }} replace={true} >
      <ListItem button>
        <ListItemIcon>
          <CommuteIcon />
        </ListItemIcon>
        <ListItemText primary="Actualización Vehicular" />
      </ListItem>
    </Link>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Gestión De Accesos</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Administradores" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Trabajadores" />
    </ListItem>
  </div>
);