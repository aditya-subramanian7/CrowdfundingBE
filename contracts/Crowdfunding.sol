pragma solidity >=0.4.21 <0.6.0;
// SPDX-License-Identifier: MIT
contract CampaignFactory{
    Crowdfunding[] public deployedCampaigns;

    function createCampaign(uint minimumContribution,string memory campaignName,string memory description) public {
        Crowdfunding newCampaign = new Crowdfunding(minimumContribution,campaignName,msg.sender,description);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(Crowdfunding[] memory) {
        return deployedCampaigns;
    }

    function campaignCount() public view returns(uint){
        return deployedCampaigns.length;
    }
}

contract Crowdfunding{
    
    struct Withdrawal{
        address payable recipient;
        uint value;
        string description;
        bool complete;
        uint approvalCount;
        mapping (address=>bool) approvals;
    }
    
    Withdrawal[] public withdrawals;
    uint public withdrawalCount;
    address public owner;
    address[] public contributorAddresses;
    mapping (address=>bool) public contributors;
    mapping (address=>uint) public contributions;
    uint public contributorsCount;
    uint public minimumContribution;
    uint public totalContribution;
    string public campaignName;
    string public description;
    
    constructor(uint minimum, string memory name,address _owner,string memory _description) public {
        minimumContribution = minimum;
        campaignName = name;
        owner = _owner;
        description = _description;
        withdrawalCount = 0;
    }
    
    function contribute() public payable {
        require(msg.value>=minimumContribution,"Please check the minimum contribution");
        uint contribution = msg.value;
        totalContribution += msg.value;
        contributorsCount++;
        contributors[msg.sender] = true;
        contributorAddresses.push(msg.sender);
        contributions[msg.sender] = contributions[msg.sender] + contribution;
    }
    
    function weightage(address contributor)view public returns (uint){
        uint256 _weightage = (contributions[contributor] * 100 ) / totalContribution;
        return _weightage;
    }
    
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyContributor(){
        require(contributors[msg.sender]);
        _;
    }
    
    function createWithdrawal(
        string memory _description,
        uint _value,
        address payable _recipient

    ) public onlyOwner {

            Withdrawal memory newWihtdrawal = Withdrawal({
                recipient: _recipient,
                value: _value,
                description: _description,
                complete: false,
                approvalCount: 0
            });
        
            withdrawals.push(newWihtdrawal);
            withdrawalCount = withdrawalCount + 1;
    }
    
    function approveWithdrawal(uint index) public onlyContributor {

        Withdrawal storage withdrawal = withdrawals[index];
        
        uint w = weightage(msg.sender);
        
        require(!withdrawal.approvals[msg.sender]);
        
        withdrawal.approvals[msg.sender] = true;
        withdrawal.approvalCount+=w;
        
    }
    
    function finalizeWithdrawal(uint index) public onlyOwner {
        
        Withdrawal storage withdrawal = withdrawals[index];
        
        require(withdrawal.approvalCount >= (50),"Please check approval count");
        require(!withdrawal.complete);
        
        withdrawal.recipient.transfer(withdrawal.value);
        
        totalContribution = totalContribution - withdrawal.value; 
        withdrawal.complete = true;
    }
}