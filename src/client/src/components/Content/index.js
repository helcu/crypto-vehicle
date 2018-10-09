import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }
  handleToggle = () => this.setState({ open: !this.state.open });
  render() {
    return
    <div>
      <AppBar
        title="CrytoVehicle"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        onLeftIconButtonClick={this.handleToggle}
        style={{
          backgroundColor: '#1565C0',
        }} />
      <Drawer open={this.state.open}
        docked={false}
        onRequestChange={(open) => this.setState({ open })}>
        <MenuItem>Menu Item</MenuItem>
        <MenuItem>Menu Item 2</MenuItem>
      </Drawer>
    </div>
  }
}
export default Content;