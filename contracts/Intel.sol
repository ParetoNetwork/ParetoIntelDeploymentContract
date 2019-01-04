pragma solidity ^0.4.25;

library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}


contract ERC20Basic {
    function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}


contract ERC20 is ERC20Basic {
    function allowance(address owner, address spender) public view returns (uint256);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
    function approve(address spender, uint256 value) public returns (bool);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


/// @title Intel contract

/// @notice Intel, A contract for creating, rewarding and distributing Intels
contract Intel{
    
    using SafeMath for uint256;
    
    struct IntelState {
        address intelProvider;
        uint depositAmount;
        uint desiredReward;
        // total balance of Pareto tokens given for this intel
        // including the intel provider’s deposit
        uint balance;
        uint intelID;
        // timestamp for when rewards can be collected
        uint rewardAfter;
        // flag indicating whether the rewards have been collected
        bool rewarded;
                // stores how many Pareto tokens were given for this intel
        // in case you want to enforce a max amount per contributor
        address[] contributionsList;
        mapping(address => uint) contributions;

    }


    mapping(uint => IntelState) intelDB;    // mapping for all of the Intels
    mapping(address => IntelState[]) public IntelsByProvider;  // mapping of Intels by a single provider
    mapping(address => uint) public balances;  // mapping for the storage of deposit amounts by addresses
    mapping(address => bool) public registered; // mapping for storage of addresses who have atleast deposited once
    address[] public participants; // list of addresses who have had made deposited to the smart contract
    uint public totalParetoBalance; // total Pareto token balance inside the Intel contract
    uint[] intelIndexes;
    
    uint public intelCount;  // total count of Intels
    

    address public owner;    // Storage variable to hold the address of owner
    
    ERC20 public token;   // Storage variable of type ERC20 to hold Pareto token's address
    address public ParetoAddress;

    
    constructor(address _owner, address _token) public {
        owner = _owner;  // owner is a Pareto wallet which should be able to perform admin functions
        token = ERC20(_token);
        ParetoAddress = _token;
    }
    

    // modifier to check of the sender of transaction is the owner
    modifier onlyOwner(){
        require(msg.sender == owner, "sender must be the owner only");
        _;
    }


    function changeOwner(address _newOwner) public onlyOwner{
        require(_newOwner != address(0x0), "New owner address is not valid");
        owner = _newOwner;
    }
    

    event Reward( address sender, uint intelIndex, uint rewardAmount);
    event NewIntel(address intelProvider, uint depositAmount, uint desiredReward, uint intelID, uint ttl);
    event RewardDistributed(uint intelIndex, uint provider_amount, address provider, address distributor, uint distributor_amount);
    event LogProxy(address destination, address account, uint amount, uint gasLimit);
    


    event Depsosited(address from, address to, uint amount);
    function makeDeposit(address _address, uint _amount) public {
        require(_address != address(0x0), "address is invalid");
        require(_amount > 0, "amount should be greater than 0");

        token.transferFrom(_address, address(this), _amount);  // Transfer token for depositing address to the Intel smart contract
        balances[_address] = balances[_address].add(_amount);  // Increase balance for the depositing address in balances map

        if(!registered[_address]) {     // check if the user is already registered
            participants.push(_address);
            registered[_address] = true;
        }

        totalParetoBalance = totalParetoBalance.add(_amount);  // add amount to total to keep track of total deposited pareto inside the smart contract
        
        emit Depsosited(_address, address(this), _amount);
    }
    
    /// @notice this function creates an Intel
    /// @dev Uses 'now' for timestamps.
    /// @param intelProvider is the address of the Intel's provider
    /// @param depositAmount is the amount of Pareto tokens deposited by provider
    /// @param desiredReward is the amount of Pareto tokens desired by provider as reward
    /// @param intelID is the ID of Intel which is mapped against an Intel in IntelDB as well as the database external to Ethereum
    /// @param ttl is the time in EPOCH format until the Intel remains active and accepts rewards
    /// requires 210769 gas in Rinkeby Network
    function create(address intelProvider, uint depositAmount, uint desiredReward, uint intelID, uint ttl) public {

        require(address(intelProvider) != address(0x0), "Intel Provider's address provided is invalid.");
        require(depositAmount > 0, "Amount should be greater than 0.");
        require(desiredReward > 0, "Desired reward should be greater than 0.");
        require(ttl > now, "Expiration date for Intel should be greater than now.");
                
        IntelState storage intel = intelDB[intelID];
        require(intel.depositAmount == 0, "Intel with the provided ID already exists");

        if(depositAmount <= balances[intelProvider]) {                      // check if the user already has deposit amount worth of tokens deposited in balances
            balances[intelProvider] = balances[intelProvider].sub(depositAmount);   // decrease user's token amount in balances by deposit amount
            balances[address(this)] = balances[address(this)].add(depositAmount);   // add token amount in balances worth despositAmount to this smart contract
        } else {
            token.transferFrom(intelProvider, address(this), depositAmount);  // transfer token from caller to Intel contract
            balances[address(this)] = balances[address(this)].add(depositAmount); // add token amount in balances worth despositAmount for this smart contract
            totalParetoBalance = totalParetoBalance.add(depositAmount);    // add amount to total to keep track of total deposited pareto inside the smart contract
        }

        address[] memory contributionsList;
        IntelState memory newIntel = IntelState(intelProvider, depositAmount, desiredReward, depositAmount, intelID, ttl, false, contributionsList);
        intelDB[intelID] = newIntel;
        IntelsByProvider[intelProvider].push(newIntel);

        intelIndexes.push(intelID);
        intelCount++;
        

        emit NewIntel(intelProvider, depositAmount, desiredReward, intelID, ttl);
        
    }
    

    
    /// @notice this function sends rewards to the Intel
    /// @dev Uses 'now' for timestamps.
    /// @param intelIndex is the ID of the Intel to send the rewards to
    /// @param rewardAmount is the amount of Pareto tokens the rewarder wants to reward to the Intel
    /// @return returns true in case of successful completion
    /// requires 72283 gas on Rinkeby Network
    function sendReward(uint intelIndex, uint rewardAmount) public returns(bool success){

        require(intelIndex > 0, "Intel's ID should be greater than 0.");
        require(rewardAmount > 0, "Reward amount should be greater than 0.");

        IntelState storage intel = intelDB[intelIndex];
        require(intel.intelProvider != address(0x0), "Intel for the provided ID does not exist.");  // make sure that Intel exists
        require(msg.sender != intel.intelProvider, "msg.sender should not be the current Intel's provider."); // rewarding address should not be an intel address
        require(intel.rewardAfter > now, "Intel is expired");       //You cannot reward intel if the timestamp of the transaction is greater than rewardAfter
        require(!intel.rewarded, "Intel is already rewarded");  // You cannot reward intel if the intel’s rewards have already been distributed
        
        if(rewardAmount <= balances[msg.sender]) {      // check if the user already has rewardAmount worth of tokens deposited in balances
            balances[msg.sender] = balances[msg.sender].sub(rewardAmount);  // decrease user's token amount in balances by rewardAmount
            balances[address(this)] = balances[address(this)].add(rewardAmount); // add token amount in balances worth rewardAmount to this smart contract
        } else {
            token.transferFrom(msg.sender, address(this), rewardAmount);  // transfer token from caller to Intel contract
            balances[address(this)] = balances[address(this)].add(rewardAmount); // add token amount in balances worth rewardAmount for this smart contract
            totalParetoBalance = totalParetoBalance.add(rewardAmount);   // add amount to total to keep track of total deposited pareto inside the smart contract
        }

        intel.balance = intel.balance.add(rewardAmount);

        if(intel.contributions[msg.sender] == 0){
            intel.contributionsList.push(msg.sender);
        }
        
        intel.contributions[msg.sender] = intel.contributions[msg.sender].add(rewardAmount);
        

        emit Reward(msg.sender, intelIndex, rewardAmount);


        return true;

    }
    

    
    /// @notice this function distributes rewards to the Intel provider
    /// @dev Uses 'now' for timestamps.
    /// @param intelIndex is the ID of the Intel to distribute tokens to
    /// @return returns true in case of successful completion
    /// requires 91837 gas on Rinkeby Network
    function distributeReward(uint intelIndex) public returns(bool success){

        require(intelIndex > 0, "Intel's ID should be greater than 0.");
        

        IntelState storage intel = intelDB[intelIndex];
        
        require(!intel.rewarded, "Intel is already rewarded.");
        require(now >= intel.rewardAfter, "Intel needs to be expired for distribution.");
        

        intel.rewarded = true;
        uint distributed_amount = 0;

        distributed_amount = intel.balance;
        
        balances[address(this)] = balances[address(this)].sub(distributed_amount);  // subtract distributed_amount worth of tokens from balances for the Intel smart contract
        intel.balance = 0;

        uint fee = distributed_amount.div(10);    // calculate 10% as the fee for distribution
        distributed_amount = distributed_amount.sub(fee);   // calculate final distribution amount

        token.transfer(msg.sender, fee/2);  // transfer 5% fee to the distributor
        balances[owner] = balances[owner].add(fee/2);  // update balances with 5% worth of distribution amount for the owner
        token.transfer(intel.intelProvider, distributed_amount); // transfer the 90% token to the intel provider
        totalParetoBalance = totalParetoBalance.sub(distributed_amount.add(fee/2)); // update balances with subtraction of 95% of distributing tokens from the Intel contract
       

        emit RewardDistributed(intelIndex, distributed_amount, intel.intelProvider, msg.sender, fee);


        return true;

    }
    
    function getParetoBalance(address _address) public view returns(uint) {
        return balances[_address];
    }

    function distributeFeeRewards(address[] _participants, uint _amount) public onlyOwner {
        uint totalCirculatingAmount = totalParetoBalance - balances[address(this)] - balances[owner];

        for( uint i = 0; i < _participants.length; i++) {
            if(balances[_participants[i]] > 0) {
                uint amountToAdd = _amount.mul(balances[_participants[i]]).div(totalCirculatingAmount);
                balances[_participants[i]] = balances[_participants[i]].add(amountToAdd);
                balances[owner] = balances[owner].sub(amountToAdd);
            }
        }
    }

    function getParticipants() public view returns(address[] memory _participants) {
        _participants = new address[](participants.length);
        
        for(uint i = 0; i < participants.length; i++) {
            _participants[i] = participants[i];
        }
        return;
    }

    /// @notice this function sets the address of Pareto Token
    /// @dev only owner can call it
    /// @param _token is the Pareto token address
    /// requires 63767 gas on Rinkeby Network
    function setParetoToken(address _token) public onlyOwner{

        token = ERC20(_token);
        ParetoAddress = _token;

    }
    

    
    /// @notice this function sends back the mistakenly sent non-Pareto ERC20 tokens
    /// @dev only owner can call it
    /// @param destination is the contract address where the tokens were received from mistakenly
    /// @param account is the external account's address which sent the wrong tokens
    /// @param amount is the amount of tokens sent
    /// @param gasLimit is the amount of gas to be sent along with external contract's transfer call
    /// requires 27431 gas on Rinkeby Network
    function proxy(address destination, address account, uint amount, uint gasLimit) public onlyOwner{

        require(destination != ParetoAddress, "Pareto Token cannot be assigned as destination.");    // check that the destination is not the Pareto token contract

        // make the call to transfer function of the 'destination' contract
        // if(!address(destination).call.gas(gasLimit)(bytes4(keccak256("transfer(address,uint256)")),account, amount)){
        //     revert();
        // }


        // ERC20(destination).transfer(account,amount);


        bytes4  sig = bytes4(keccak256("transfer(address,uint256)"));

        assembly {
            let x := mload(0x40) //Find empty storage location using "free memory pointer"
        mstore(x,sig) //Place signature at beginning of empty storage 
        mstore(add(x,0x04),account)
        mstore(add(x,0x24),amount)

        let success := call(      //This is the critical change (Pop the top stack value)
                            gasLimit, //5k gas
                            destination, //To addr
                            0,    //No value
                            x,    //Inputs are stored at location x
                            0x44, //Inputs are 68 bytes long
                            x,    //Store output over input (saves space)
                            0x0) //Outputs are 32 bytes long

        // Check return value and jump to bad destination if zero
		jumpi(0x02,iszero(success))

        }
        emit LogProxy(destination, account, amount, gasLimit);
    }

    
    /// @notice It's a fallback function supposed to return sent Ethers by reverting the transaction
    function() external{
        revert();
    }

    
    /// @notice this function provide the Intel based on its index
    /// @dev it's a constant function which can be called
    /// @param intelIndex is the ID of Intel that is to be returned from intelDB
    function getIntel(uint intelIndex) public view returns(address intelProvider, uint depositAmount, uint desiredReward, uint balance, uint intelID, uint rewardAfter, bool rewarded) {
        
        IntelState storage intel = intelDB[intelIndex];
        intelProvider = intel.intelProvider;
        depositAmount = intel.depositAmount;
        desiredReward = intel.desiredReward;
        balance = intel.balance;
        rewardAfter = intel.rewardAfter;
        intelID = intel.intelID;
        rewarded = intel.rewarded;

    }

    function getAllIntel() public view returns (uint[] intelID, address[] intelProvider, uint[] depositAmount, uint[] desiredReward, uint[] balance, uint[] rewardAfter, bool[] rewarded){
        
        uint length = intelIndexes.length;
        intelID = new uint[](length);
        intelProvider = new address[](length);
        depositAmount = new uint[](length);
        desiredReward = new uint[](length);
        balance = new uint[](length);
        rewardAfter = new uint[](length);
        rewarded = new bool[](length);

        for(uint i = 0; i < intelIndexes.length; i++){
            intelID[i] = intelDB[intelIndexes[i]].intelID;
            intelProvider[i] = intelDB[intelIndexes[i]].intelProvider;
            depositAmount[i] = intelDB[intelIndexes[i]].depositAmount;
            desiredReward[i] = intelDB[intelIndexes[i]].desiredReward;
            balance[i] = intelDB[intelIndexes[i]].balance;
            rewardAfter[i] = intelDB[intelIndexes[i]].rewardAfter;
            rewarded[i] = intelDB[intelIndexes[i]].rewarded;
        }
    }


    function getIntelsByProvider(address _provider) public view returns (uint[] intelID, address[] intelProvider, uint[] depositAmount, uint[] desiredReward, uint[] balance, uint[] rewardAfter, bool[] rewarded){
        
        uint length = IntelsByProvider[_provider].length;

        intelID = new uint[](length);
        intelProvider = new address[](length);
        depositAmount = new uint[](length);
        desiredReward = new uint[](length);
        balance = new uint[](length);
        rewardAfter = new uint[](length);
        rewarded = new bool[](length);

        IntelState[] memory intels = IntelsByProvider[_provider];

        for(uint i = 0; i < length; i++){
            intelID[i] = intels[i].intelID;
            intelProvider[i] = intels[i].intelProvider;
            depositAmount[i] = intels[i].depositAmount;
            desiredReward[i] = intels[i].desiredReward;
            balance[i] = intels[i].balance;
            rewardAfter[i] = intels[i].rewardAfter;
            rewarded[i] = intels[i].rewarded;
        }
    }

    function contributionsByIntel(uint intelIndex) public view returns(address[] memory addresses, uint[] memory amounts){
        IntelState storage intel = intelDB[intelIndex];
                
        uint length = intel.contributionsList.length;

        addresses = new address[](length);
        amounts = new uint[](length);

        for(uint i = 0; i < length; i++){
            addresses[i] = intel.contributionsList[i]; 
            amounts[i] = intel.contributions[intel.contributionsList[i]];       
        }

    }

}
