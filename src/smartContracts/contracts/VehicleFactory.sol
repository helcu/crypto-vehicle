pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./strings.sol";
import "./authorizable.sol";


contract VehicleFactory is Authorizable {

    using Strings for *;

    // Structs
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

        string photos;
        string documents;
        bytes32[] ownersIds;
        bytes32[] ownersNames;

        address employeeAddress;
    }


    // Global variables
    bytes32[] private vehiclesNumberPlate;
    mapping (bytes32 => Vehicle) private vehicles;
    

    // Methods
    function getVehiclesCount() 
    public view returns (uint) {
        return vehiclesNumberPlate.length;
    }

    function getVehicles() 
    public view returns (bytes32[]) {
        return vehiclesNumberPlate;
    }

    function getVehiclesFiltered
    (
        bytes32 _numberPlate, 
        bytes32 _brand, bytes32 _model,
        bytes32 _color
    )
    public view returns (bytes32[]) {
        bytes32[] memory vehiclesFiltered = new bytes32[](vehiclesNumberPlate.length);
        uint count = 0;
        uint i = 0;
        for(i = 0; i<vehiclesNumberPlate.length; i++) {
            if( vehicles[vehiclesNumberPlate[i]].numberPlate == _numberPlate ||
                vehicles[vehiclesNumberPlate[i]].brand == _brand ||
                vehicles[vehiclesNumberPlate[i]].model == _model ||
                vehicles[vehiclesNumberPlate[i]].color == _color) {
                vehiclesFiltered[i] = vehiclesNumberPlate[i];
                count++;
            }
        }

        bytes32[] memory vehiclesResult = new bytes32[](count);
        uint j = 0;
        for(i = 0; i<vehiclesFiltered.length; i++) {
            if(vehiclesFiltered[i] != bytes32(0)) {
                vehiclesResult[j] = vehiclesFiltered[i];
                j++;
            }
        }

        return vehiclesResult;
    }

    function getVehicle
    (
        bytes32 _numberPlate
    )
    public view returns 
    (
        bytes32, bytes32, bytes32,
        bytes32, bytes32, bytes32, bytes32
    ) {
        Vehicle storage vehicle = vehicles[_numberPlate];
        return (
            vehicle.numberPlate, vehicle.brand, vehicle.model,
            vehicle.color, vehicle.serialNumber, vehicle.motorNumber, vehicle.reason
        );
    }

    function getVehicleDetail
    (
        bytes32 _numberPlate
    )
    public view returns
    (
        string, string, bytes32[], bytes32[],
        address
    ) {
        Vehicle storage vehicle = vehicles[_numberPlate];
        return (
            vehicle.photos, vehicle.documents, vehicle.ownersIds, vehicle.ownersNames,
            vehicle.employeeAddress
        );
    }

    function getVehicleFiltered
    (
        bytes32 _numberPlate
    )
    public view returns 
    (
        bytes32, bytes32, bytes32, string
    ) {
        Vehicle storage vehicle = vehicles[_numberPlate];
        return (
            vehicle.numberPlate, vehicle.brand, vehicle.model, vehicle.photos
        );
    }

    function vehicleExists
    (
        bytes32 _numberPlate
    )
    public view returns (bool) {
        return vehicles[_numberPlate].numberPlate > 0;
    }

    function serialNumberExists
    (
        bytes32 _serialNumber
    )
    public view returns (bool) {

        bool exists;
        uint i = 0;
        for(i = 0; i<vehiclesNumberPlate.length; i++) {
            if( vehicles[vehiclesNumberPlate[i]].serialNumber == _serialNumber) {
                exists = true;
                break;
            }
        }

        return exists;
    }

    function motorNumberExists
    (
        bytes32 _motorNumber
    )
    public view returns (bool) {

        bool exists;
        uint i = 0;
        for(i = 0; i<vehiclesNumberPlate.length; i++) {
            if( vehicles[vehiclesNumberPlate[i]].motorNumber == _motorNumber) {
                exists = true;
                break;
            }
        }

        return exists;
    }


    function registerVehicle
    (
        bytes32 _numberPlate, bytes32 _brand, bytes32 _model,
        bytes32 _color, bytes32 _serialNumber, bytes32 _motorNumber, bytes32 _reason,
        string _photos, string _documents, bytes32[] _ownersId, bytes32[] _ownersNames
    )
    public onlyEmployee returns (bool) {
        require(_numberPlate > 0, "Number plate can not be empty.");
        require(vehicles[_numberPlate].numberPlate <= 0, "The vehicle is already registered.");

        Vehicle storage vehicle = vehicles[_numberPlate];
        vehicle.numberPlate = _numberPlate;
        vehicle.brand = _brand;
        vehicle.model = _model;

        vehicle.color = _color;
        vehicle.serialNumber = _serialNumber;
        vehicle.motorNumber = _motorNumber;
        vehicle.reason = _reason;

        vehicle.photos = _photos;
        vehicle.documents = _documents;
        vehicle.ownersIds = _ownersId;
        vehicle.ownersNames = _ownersNames;

        vehicle.employeeAddress = msg.sender;

        vehiclesNumberPlate.push(_numberPlate);
        return true;
    }

    function updateVehicle
    (
        bytes32 _numberPlate,
        bytes32 _color, bytes32 _serialNumber, bytes32 _motorNumber, bytes32 _reason
    )
    public onlyEmployee returns (bool) {
        require(_numberPlate > 0, "Number plate can not be empty.");
        require(vehicles[_numberPlate].numberPlate <= 0, "The vehicle is already registered.");

        Vehicle storage vehicle = vehicles[_numberPlate];

        vehicle.color = _color;
        vehicle.serialNumber = _serialNumber;
        vehicle.motorNumber = _motorNumber;
        vehicle.reason = _reason;

        vehicle.employeeAddress = msg.sender;

        vehiclesNumberPlate.push(_numberPlate);
        return true;
    }

    function updateVehiclePhotos
    (
        bytes32 _numberPlate,
        string _photos
    )
    public onlyEmployee returns (bool) {
        require(_numberPlate > 0, "Number plate can not be empty.");
        require(vehicles[_numberPlate].numberPlate > 0, "The vehicle is not registered.");

        vehicles[_numberPlate].photos = _photos;
        return true;
    }

    function updateVehicleDocuments
    (
        bytes32 _numberPlate,
        string _documents
    )
    public onlyEmployee returns (bool) {
        require(_numberPlate > 0, "Number plate can not be empty.");
        require(vehicles[_numberPlate].numberPlate > 0, "The vehicle is not registered.");

        vehicles[_numberPlate].documents = _documents;
        return true;
    }

    function updateVehicleOwner
    (
        bytes32 _numberPlate,
        bytes32[] _ownersId, bytes32[] _ownersNames
    )
    public onlyEmployee returns (bool) {
        require(_numberPlate > 0, "Number plate can not be empty.");
        require(vehicles[_numberPlate].numberPlate > 0, "The vehicle is not registered.");
        require(_ownersId.length == _ownersNames.length, "Owners data does not match.");

        vehicles[_numberPlate].ownersIds = _ownersId;
        vehicles[_numberPlate].ownersNames = _ownersNames;
        return true;
    }

    function getVehiclesFilteredWithContains
    (
        string _numberPlate, 
        string _brand, string _model,
        string _color
    )
    public view returns (bytes32[]) {
        bytes32[] memory vehiclesFiltered = new bytes32[](vehiclesNumberPlate.length);
        uint count = 0;
        uint i = 0;
        for(i = 0; i<vehiclesNumberPlate.length; i++) {

            string memory numberPlate = bytes32ToString(vehicles[vehiclesNumberPlate[i]].numberPlate);
            string memory brand = bytes32ToString(vehicles[vehiclesNumberPlate[i]].brand);
            string memory model = bytes32ToString(vehicles[vehiclesNumberPlate[i]].model);
            string memory color = bytes32ToString(vehicles[vehiclesNumberPlate[i]].color);

            if(!isEmpty(_numberPlate) && contains(numberPlate, _numberPlate) ||
                !isEmpty(_brand) && contains(brand, _brand) ||
                !isEmpty(_model) && contains(model, _model) ||
                !isEmpty(_color) && contains(color, _color)) {
                vehiclesFiltered[i] = vehiclesNumberPlate[i];
                count++;
            }
        }

        bytes32[] memory vehiclesResult = new bytes32[](count);
        uint j = 0;
        for(i = 0; i<vehiclesFiltered.length; i++) {
            if(vehiclesFiltered[i] != bytes32(0)) {
                vehiclesResult[j] = vehiclesFiltered[i];
                j++;
            }
        }

        return vehiclesResult;
    }


    function bytes32ToString(bytes32 x) internal pure returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    function contains
    (
        string word, string filter
    )
    public pure returns (bool) {
        return Strings.contains(Strings.toSlice(word), Strings.toSlice(filter));
    }

    function isEmpty
    (
        string word
    )
    public pure returns (bool) {
        return Strings.empty(Strings.toSlice(word));
    }
}