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
import BuildIcon from '@material-ui/icons/Build';
import GroupIcon from '@material-ui/icons/Group';
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
        <ListItemText primary="Consulta vehicular" />
      </ListItem>
    </Link>
    <Link to='/register' style={{ textDecoration: 'none' }} replace={true} >
      <ListItem button>
        <ListItemIcon>
          <CommuteIcon />
        </ListItemIcon>
        <ListItemText primary="Registro vehicular" />
      </ListItem>
    </Link>
    <Link to='/update' style={{ textDecoration: 'none' }} replace={true} >
      <ListItem button>
        <ListItemIcon>
          <CommuteIcon />
        </ListItemIcon>
        <ListItemText primary="Actualización vehicular" />
      </ListItem>
    </Link>
  </div>
);

export const secondaryListItems = (
  <div>

    <ListSubheader inset>Gestion De Accesos</ListSubheader>
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
  </div>
);