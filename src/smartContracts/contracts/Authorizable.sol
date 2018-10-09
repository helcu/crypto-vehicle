pragma solidity ^0.4.24;

import "./ownable.sol";

/**
 * @title Authorizable
 * @dev The Authorizable contract allows the owner to manage permissions.
 */
contract Authorizable is Ownable {

    struct Employee {
        bytes32 dni;
        bytes32 name;
        bool isInArray;
        bool isAdministrator;
        bool isEmployee;
    }

    address[] public employeesAccounts;
    mapping (address => Employee) public employees;
    

    modifier onlyAdministrator() {
        require(employees[msg.sender].isAdministrator || owner == msg.sender, "You are not a administrator. You are not authorized.");
        _;
    }

    modifier onlyEmployee() {
        require(employees[msg.sender].isEmployee || owner == msg.sender, "You are not a employee. You are not authorized.");
        _;
    }

    function isEmployee(address _employeeAddress)
    public view returns (bool) {
        return employees[_employeeAddress].isEmployee;
    }

    function isAdministrator(address _employeeAddress)
    public view returns (bool) {
        return employees[_employeeAddress].isAdministrator;
    }

    function getOnlyEmployeesAddresses()
    public view returns (address[]){
        address[] memory employeesFiltered = new address[](employeesAccounts.length);
        uint count = 0;
        uint i = 0;
        for(i = 0; i<employeesAccounts.length; i++) {
            if(employees[employeesAccounts[i]].isEmployee) {
                employeesFiltered[i] = employeesAccounts[i];
                count++;
            }
        }

        address[] memory employeesResult = new address[](count);
        uint j = 0;
        for(i = 0; i<employeesFiltered.length; i++) {
            if(employeesFiltered[i] != address(0)) {
                employeesResult[j] = employeesFiltered[i];
                j++;
            }
        }
        return employeesResult;
    }

    function getOnlyAdministratorsAddresses()
    public view returns (address[]){
        address[] memory employeesFiltered = new address[](employeesAccounts.length);
        uint count = 0;
        uint i = 0;
        for(i = 0; i<employeesAccounts.length; i++) {
            if(employees[employeesAccounts[i]].isAdministrator) {
                employeesFiltered[i] = employeesAccounts[i];
                count++;
            }
        }

        address[] memory employeesResult = new address[](count);
        uint j = 0;
        for(i = 0; i<employeesFiltered.length; i++) {
            if(employeesFiltered[i] != address(0)) {
                employeesResult[j] = employeesFiltered[i];
                j++;
            }
        }
        return employeesResult;
    }

    function getEmployeesAddresses()
    public view returns (address[]){
        return employeesAccounts;
    }

    function getEmployeesCount() 
    public view returns (uint) {
        return employeesAccounts.length;
    }

    function getEmployee(address _employeeAddress) 
    public view returns (bytes32, bytes32, bool, bool) {
        Employee storage employee = employees[_employeeAddress];
        return (employee.dni, employee.name, employee.isAdministrator, employee.isEmployee);
    }

    function setAdministrator(address _toAdd, bytes32 _dni, bytes32 _name) 
    public onlyOwner {
        require(_toAdd != address(0), "You attempted to add permissions to 0x0 address.");

        if(employees[_toAdd].isInArray) {
            employees[_toAdd].dni = _dni;
            employees[_toAdd].name = _name;
            employees[_toAdd].isAdministrator = true;
        } else {
            employees[_toAdd] = Employee(_dni, _name, true, true, true);
            employeesAccounts.push(_toAdd);
        }
    }

    function removeAdministrator(address _toRemove) 
    public onlyOwner {
        require(_toRemove != address(0), "You attempted to add permissions to 0x0 address.");
        employees[_toRemove].isAdministrator = false;
    }

    function setEmployee(address _toAdd, bytes32 _dni, bytes32 _name) 
    public onlyAdministrator {
        require(_toAdd != address(0), "You attempted to add permissions to 0x0 address.");

        if(employees[_toAdd].isInArray) {
            employees[_toAdd].dni = _dni;
            employees[_toAdd].name = _name;
            employees[_toAdd].isEmployee = true;
        } else {
            employees[_toAdd] = Employee(_dni, _name, true, false, true);
            employeesAccounts.push(_toAdd);
        }
    }

    function removeEmployee(address _toRemove) 
    public onlyAdministrator {
        require(_toRemove != address(0), "You attempted to add permissions to 0x0 address.");
        employees[_toRemove].isEmployee = false;
        //employees[_toRemove].isAdministrator = false;
    }
}