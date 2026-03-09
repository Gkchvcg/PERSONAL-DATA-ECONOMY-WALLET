// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DataMarketplace
 * @notice Smart contract for data permissions, requests, and payments.
 *         Users grant access; companies pay in tokens to receive anonymized insights.
 */
contract DataMarketplace is Ownable, ReentrancyGuard {
    IERC20 public paymentToken;

    enum DataCategory {
        HEALTH,
        SHOPPING,
        FITNESS,
        LOCATION,
        SOCIAL
    }

    enum RequestStatus {
        Pending,
        Approved,
        Rejected,
        Fulfilled
    }

    struct DataPermission {
        address user;
        DataCategory category;
        uint256 pricePerAccess; // in wei/smallest unit
        bool allowFitnessCompanies;
        bool allowHealthcareCompanies;
        bool allowMarketingCompanies;
        bool allowInsuranceCompanies;
        uint256 expiresAt;
        bool active;
    }

    struct DataRequest {
        address requester;
        address dataOwner;
        DataCategory category;
        uint256 offeredAmount;
        RequestStatus status;
        uint256 createdAt;
        string insightCid; // IPFS CID of anonymized insight delivered
    }

    mapping(bytes32 => DataPermission) public permissions;
    mapping(bytes32 => DataRequest) public requests;
    mapping(address => uint256) public userEarnings;
    mapping(address => uint256) public reputationScore;

    event PermissionCreated(bytes32 indexed permissionId, address indexed user, DataCategory category, uint256 price);
    event RequestCreated(bytes32 indexed requestId, address requester, address dataOwner, DataCategory category, uint256 amount);
    event RequestApproved(bytes32 indexed requestId, address dataOwner);
    event RequestFulfilled(bytes32 indexed requestId, string insightCid);
    event PaymentReleased(address indexed user, uint256 amount);
    event ReputationUpdated(address indexed user, uint256 newScore);

    constructor(address _paymentToken) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
    }

    function _permissionId(address user, DataCategory category) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(user, category));
    }

    function _requestId(address requester, address owner, DataCategory category, uint256 createdAt) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(requester, owner, category, createdAt));
    }

    function createPermission(
        DataCategory category,
        uint256 pricePerAccess,
        bool allowFitness,
        bool allowHealthcare,
        bool allowMarketing,
        bool allowInsurance,
        uint256 durationSeconds
    ) external {
        bytes32 id = _permissionId(msg.sender, category);
        require(!permissions[id].active, "Permission already exists");
        permissions[id] = DataPermission({
            user: msg.sender,
            category: category,
            pricePerAccess: pricePerAccess,
            allowFitnessCompanies: allowFitness,
            allowHealthcareCompanies: allowHealthcare,
            allowMarketingCompanies: allowMarketing,
            allowInsuranceCompanies: allowInsurance,
            expiresAt: block.timestamp + durationSeconds,
            active: true
        });
        emit PermissionCreated(id, msg.sender, category, pricePerAccess);
    }

    function createRequest(address dataOwner, DataCategory category, uint256 offeredAmount) external returns (bytes32) {
        bytes32 permId = _permissionId(dataOwner, category);
        DataPermission storage perm = permissions[permId];
        require(perm.active, "No permission");
        require(block.timestamp <= perm.expiresAt, "Permission expired");
        require(offeredAmount >= perm.pricePerAccess, "Amount too low");

        uint256 createdAt = block.timestamp;
        bytes32 requestId = _requestId(msg.sender, dataOwner, category, createdAt);
        require(requests[requestId].createdAt == 0, "Duplicate request");

        requests[requestId] = DataRequest({
            requester: msg.sender,
            dataOwner: dataOwner,
            category: category,
            offeredAmount: offeredAmount,
            status: RequestStatus.Pending,
            createdAt: createdAt,
            insightCid: ""
        });
        emit RequestCreated(requestId, msg.sender, dataOwner, category, offeredAmount);
        return requestId;
    }

    function approveRequest(bytes32 requestId) external nonReentrant {
        DataRequest storage req = requests[requestId];
        require(req.dataOwner == msg.sender, "Not data owner");
        require(req.status == RequestStatus.Pending, "Invalid status");

        req.status = RequestStatus.Approved;
        emit RequestApproved(requestId, msg.sender);

        // Transfer payment from requester to contract (escrow)
        require(paymentToken.transferFrom(req.requester, address(this), req.offeredAmount), "Transfer failed");
        userEarnings[msg.sender] += req.offeredAmount;
    }

    function fulfillRequest(bytes32 requestId, string calldata insightCid) external {
        DataRequest storage req = requests[requestId];
        require(req.dataOwner == msg.sender, "Not data owner");
        require(req.status == RequestStatus.Approved, "Not approved");
        req.status = RequestStatus.Fulfilled;
        req.insightCid = insightCid;
        emit RequestFulfilled(requestId, insightCid);

        // Bump reputation for quality fulfillment
        reputationScore[msg.sender] = reputationScore[msg.sender] + 1;
        emit ReputationUpdated(msg.sender, reputationScore[msg.sender]);
    }

    function withdrawEarnings() external nonReentrant {
        uint256 amount = userEarnings[msg.sender];
        require(amount > 0, "No earnings");
        userEarnings[msg.sender] = 0;
        require(paymentToken.transfer(msg.sender, amount), "Transfer failed");
        emit PaymentReleased(msg.sender, amount);
    }

    function getPermission(address user, DataCategory category) external view returns (DataPermission memory) {
        return permissions[_permissionId(user, category)];
    }

    function getRequest(bytes32 requestId) external view returns (DataRequest memory) {
        return requests[requestId];
    }
}
