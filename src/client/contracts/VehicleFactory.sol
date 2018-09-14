pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./authorizable.sol";


contract VehicleFactory is Authorizable {

    constructor() public {
        
    }

    struct Vehicle {
        // Inmutable
        bytes32 numberPlate;
        bytes32 brand;
        bytes32 model;

        // Mutable
        bytes32 color;
        bytes32 serialNumber; // chassis
        bytes32 motorNumber;
        bytes32 reason;

        bytes32[] photos;
        bytes32[] documents;
        VehicleOwner[] owners;
        address employeeAddress;
    }

    struct VehicleOwner {
        uint dni;
        bytes32 name;
    }


    bytes32[] private vehiclesNumberPlate;
    mapping (bytes32 => Vehicle) private vehicles;
    

    function _compareStrings (string a, string b) 
    private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function getVehiclesCount() 
    public view returns (uint) {
        return vehiclesNumberPlate.length;
    }

    function getVehicles() 
    public view returns (bytes32[]) {
        return vehiclesNumberPlate;
    }

    function getVehicle
    (
        bytes32 _numberPlate
    )
    public view returns (bytes32, bytes32, bytes32, bytes32, bytes32, bytes32, bytes32) {
        //bytes32 numberPlateKey = keccak256(abi.encodePacked(_numberPlate));
        Vehicle storage vehicle = vehicles[_numberPlate];

        return (
            vehicle.numberPlate, vehicle.brand, vehicle.model,
            vehicle.color, vehicle.serialNumber, vehicle.motorNumber, vehicle.reason
        );
    }

    function addVehicle
    (
        bytes32 _numberPlate, bytes32 _brand, bytes32 _model,
        bytes32 _color, bytes32 _serialNumber, bytes32 _motorNumber, bytes32 _reason//,
        //bytes32[] _photos, bytes32[] _documents, VehicleOwner[] _owners
    )
    public onlyEmployee {
        //bytes32 numberPlateKey = keccak256(abi.encodePacked(_numberPlate));
        //require(_compareStrings(vehicles[_numberPlate].numberPlate, ""), "The vehicle is already registered.");
        require(vehicles[_numberPlate].numberPlate == 0, "The vehicle is already registered.");

        Vehicle storage vehicle = vehicles[_numberPlate];
        vehicle.numberPlate = _numberPlate;
        vehicle.brand = _brand;
        vehicle.model = _model;

        vehicle.color = _color;
        vehicle.serialNumber = _serialNumber;
        vehicle.motorNumber = _motorNumber;
        vehicle.reason = _reason;

        //vehicle.photos = _photos;
        //vehicle.documents = _documents;
        //vehicle.owners = _owners;
        vehicle.employeeAddress = msg.sender;

        vehiclesNumberPlate.push(_numberPlate);
    }


}