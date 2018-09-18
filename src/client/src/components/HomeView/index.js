import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import getWeb3 from '../../utils/getWeb3'

import VehicleFactoryContract from './../../buildContracts/VehicleFactory.json'


const styles = theme => ({});


class HomeView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            web3: null,
            vehicleFactoryInstance: null
        };
    }

    componentDidMount = async () => {
        let results = await getWeb3
            .catch(() => {
                console.log('Error finding web3.')
            });

        await this.setState({ web3: results.web3 }, () => {
            this.initContracts();
        });
    }

    initContracts = async () => {
        const contract = require('truffle-contract');
        const vehicleFactory = contract(VehicleFactoryContract);
        vehicleFactory.setProvider(this.state.web3.currentProvider);
        const vehicleFactoryInstance = await vehicleFactory.deployed();
        await this.setState({ vehicleFactoryInstance: vehicleFactoryInstance });

        var vehicleRegisterLogs = await this.getRegisterLogs();
        var vehicleUpdateLogs = await this.getUpdateLogs();
        var vehicleLogs = [...vehicleRegisterLogs, ...vehicleUpdateLogs];
        console.log(vehicleLogs);
    }

    elementsToAscii = (_hexArray) => {
        return _hexArray.map((e) => {
            return this.state.web3.toAscii(e);
        });
    }

    getOwnersFromContract = (ownersId, ownersName) => {
        return ownersId.map((e, i) => {
            return {
                dni: e,
                name: ownersName[i]
            }
        });
    }

    getRegisterLogs = async () => {
        const web3 = this.state.web3;
        const accounts = await web3.eth.accounts;

        if (!accounts || !accounts[0]) {
            console.log("There is no account.");
            return false;
        }

        return new Promise((resolve, reject) => {
            var vehicleLogs = [];
            let vehicleRegisteredEvent = this.state.vehicleFactoryInstance.VehicleRegistered(
                { numberPlate: web3.fromAscii('AWS-321'), employeeAddress: accounts[0] },
                { fromBlock: 0, toBlock: 'latest' }
            );

            vehicleRegisteredEvent.get((error, logs) => {
                if (error) {
                    reject(error);
                    return;
                }

                vehicleLogs = logs.map(log => {
                    const vehicle = log.args;
                    return {
                        event: log.event,
                        blockHash: log.blockHash,
                        transactionHash: log.transactionHash,
                        vehicle: {
                            numberPlate: web3.toAscii(vehicle.numberPlate),
                            marca: web3.toAscii(vehicle.brand),
                            modelo: web3.toAscii(vehicle.model),
                            color: web3.toAscii(vehicle.color),
                            serialNumber: web3.toAscii(vehicle.serialNumber),
                            motorNumber: web3.toAscii(vehicle.motorNumber),
                            reason: web3.toAscii(vehicle.reason),
                            photos: vehicle.photos,
                            documents: vehicle.documents,
                            owners: this.getOwnersFromContract(this.elementsToAscii(vehicle.ownersId), this.elementsToAscii(vehicle.ownersNames)),
                            employeeAdress: vehicle.employeeAddress
                        }
                    }
                });
                resolve(vehicleLogs);
            });
        });
    }

    getUpdateLogs = async () => {
        const web3 = this.state.web3;
        const accounts = await web3.eth.accounts;

        if (!accounts || !accounts[0]) {
            console.log("There is no account.");
            return false;
        }

        return new Promise((resolve, reject) => {
            var vehicleLogs = [];
            let vehicleUpdatedEvent = this.state.vehicleFactoryInstance.VehicleUpdated(
                { numberPlate: web3.fromAscii('AWS-321'), employeeAddress: accounts[0] },
                { fromBlock: 0, toBlock: 'latest' }
            );

            vehicleUpdatedEvent.get((error, logs) => {
                if (error) {
                    reject(error);
                    return;
                }

                vehicleLogs = logs.map(log => {
                    const vehicle = log.args;
                    return {
                        event: log.event,
                        blockHash: log.blockHash,
                        transactionHash: log.transactionHash,
                        vehicle: {
                            numberPlate: web3.toAscii(vehicle.numberPlate),
                            color: web3.toAscii(vehicle.color),
                            serialNumber: web3.toAscii(vehicle.serialNumber),
                            motorNumber: web3.toAscii(vehicle.motorNumber),
                            reason: web3.toAscii(vehicle.reason),
                            photos: vehicle.photos,
                            documents: vehicle.documents,
                            owners: this.getOwnersFromContract(this.elementsToAscii(vehicle.ownersId), this.elementsToAscii(vehicle.ownersNames)),
                            employeeAdress: vehicle.employeeAddress
                        }
                    }
                });
                resolve(vehicleLogs);
            });
        });
    }

    render() {
        return <p>home</p>
    }
}

HomeView.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeView);