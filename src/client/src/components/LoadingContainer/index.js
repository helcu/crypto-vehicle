import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'
import Particles from 'react-particles-js'
import Typography from '@material-ui/core/Typography';

class LoadingContainer extends Component {
  render() {
    var rows = []
    if (this.props.web3.status === 'failed' || !this.props.web3.networkId) {
      if (this.props.errorComp) {
        return this.props.errorComp
      }
      rows.push(
        <div key="2">
          <Typography gutterBottom noWrap>
            CryptoVehicle no puede conectarse a la red de Ethereum.
          </Typography>
          <Typography gutterBottom noWrap>
            Instale la extensión Metamask.
          </Typography>
        </div>
      )
    }

    if (this.props.web3.status === 'initialized' && this.props.web3.networkId && Object.keys(this.props.accounts).length === 0) {
      rows.push(
        <div key="1">
          <Typography gutterBottom noWrap>
            CryptoVehicle no encuentra una cuenta configurada.
          </Typography>
          <Typography gutterBottom noWrap>
            Revise su cuenta en la extensión MetaMask.
          </Typography>
        </div>
      )
    }

    if (this.props.drizzleStatus.initialized) {
      return Children.only(this.props.children)
    }

    if (this.props.loadingComp) {
      return this.props.loadingComp
    }

    if (this.props.web3.status === 'initialized' && this.props.web3.networkId && Object.keys(this.props.accounts).length !== 0) {
      rows.push(
        <div key="3" className="pure-u-1-1">
          <Typography gutterBottom noWrap>
            CryptoVehicle está cargando...
          </Typography>
        </div>
      )
    }

    if (rows.length !== 0) {
      return (
        <main>
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
            <Typography variant="headline" align="center">
              CryptoVehicle
            </Typography>
            <br />
            <div style={{ "padding": "8px" }}>{rows}</div>
          </div>
        </main>
      )
    }
  }
}

LoadingContainer.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3
  }
}
export default drizzleConnect(LoadingContainer, mapStateToProps)