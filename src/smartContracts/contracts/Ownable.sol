pragma solidity ^0.4.24;
/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed _newOwner);

    /**
    * @dev The Ownable constructor sets the original `owner` of the contract to the sender
    * account.
    */
    constructor() public {
        owner = msg.sender;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner. You are not authorized.");
        _;
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a _newOwner.
    * @param _newOwner The address to transfer ownership to.
    */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "You attempted to add permissions to 0x0 address.");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
}
