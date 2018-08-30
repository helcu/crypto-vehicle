import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Content from './components/Content';
import { BrowserRouter} from 'react-router-dom';
import Main from './App.js' 

export class App extends React.Component {
    render() {
      return (
        <BrowserRouter>
        <MuiThemeProvider>
        <Main />
      </MuiThemeProvider>
      </BrowserRouter>
      )
    }
  }
ReactDOM.render(<App />, document.getElementById('root'));

