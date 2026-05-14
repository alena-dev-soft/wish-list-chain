// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract WishlistV3 {
    struct Goal {
        string name;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 dreamPower;

        bool isFulfilled;
        uint256 createdAt;
    }

    mapping (address => Goal[]) public goals;
    uint256 public totalDreamPower;

    event DreamPowerIncreased(
        address indexed owner,
        uint256 indexed goalIndex,
        uint256 addedPower,
        uint256 newTotalPower
    );

    function addGoal(string memory _name, uint256 _targetAmount)  public {
        goals[msg.sender].push(Goal({
            name: _name,
            targetAmount: _targetAmount,
            currentAmount: 0,
            dreamPower: 0,
            isFulfilled: false,
            createdAt: block.timestamp
        }));
    }

    function getGoals(address _owner) public view returns (Goal[] memory) {
        return goals[_owner];
    }

    function donate(address _owner, uint256 _goalIndex) external payable {
        require(msg.value > 0, "Send some ETH");
        require(_goalIndex < goals[_owner].length, "Invalid goal");

        Goal storage goal = goals[_owner][_goalIndex];
        require(!goal.isFulfilled, "Goal already fulfilled");

        goal.currentAmount += msg.value;
        goal.dreamPower += msg.value;
        totalDreamPower += msg.value;

        if(goal.currentAmount >= goal.targetAmount){ 
            goal.isFulfilled = true;
        }

        emit DreamPowerIncreased(_owner, _goalIndex, msg.value, totalDreamPower);
    }
}