import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
//import Content from './components/Content';
import { DrizzleProvider } from 'drizzle-react';
import { BrowserRouter} from 'react-router-dom';
import Main from './App.js' 
import LoadingContainer from './components/LoadingContainer'
import Authorizable from './buildContracts/Authorizable.json'
import { Route, Redirect } from 'react-router-dom';
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#62727b',
      main: '#37474f',
      dark: '#102027',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#6ff9ff',
      main: '#26c6da',
      dark: '#0095a8',
      contrastText: '#000000',
    },
  },
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      // Name of the rule
      root: {
        // Some CSS
        background: 'linear-gradient(45deg, rgb(0, 164, 209) 30%, rgb(0, 219, 205) 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 30,
        padding: '0 20px',
        boxShadow: '0 3px 5px 2px rgba(64, 64, 64, .3)',
      },
    },
  },
});

const options = {
  web3: {
    block: false,
    fallback: {
      url: 'http://127.0.0.1:7545'
    }
  },
  contracts: [
    Authorizable
  ]
}

export class App extends React.Component {
    render() {
      return (
        <BrowserRouter>
        <MuiThemeProvider theme={theme}>
        <Main />
      </MuiThemeProvider>
      </BrowserRouter>
      )
    }
  }

ReactDOM.render(
    <DrizzleProvider options={options}>
        <LoadingContainer>
          <BrowserRouter>
            <div>
            <Redirect from="*" to="/" />
            <Route exact path="/" component={App} />
            </div>
          </BrowserRouter>
          </LoadingContainer>
    </DrizzleProvider>
    , document.getElementById('root'));
    

