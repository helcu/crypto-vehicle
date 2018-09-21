import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter} from 'react-router-dom';
import Main from './App.js' ;
import { DrizzleProvider } from 'drizzle-react';
import Authorizable from './../build/contracts/Authorizable.json'
import LoadingContainer from './components/LoadingContainer'
import { Route, Redirect } from 'react-router-dom';

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
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
        <MuiThemeProvider>
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

