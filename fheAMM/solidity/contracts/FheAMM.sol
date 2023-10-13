pragma solidity ^0.8.19;
import "fhevm/lib/TFHE.sol";
import "./EncryptedERC20.sol";

contract FheAMM {
    struct Pool {
        address token0;
        address token1;
        euint32 reserve0;
        euint32 reserve1;
    }
    mapping(uint256 => Pool) public Pools;

    uint256[] public PIDs;

    constructor() {}

    modifier _isExistedPool(uint _PID) {
        require(_PID <= PIDs.length, "Pool not exist.");
        _;
    }

    modifier _isValidToken(address _tokenIn, uint _PID) {
        require(_tokenIn == address(Pools[_PID].token0) || _tokenIn == address(Pools[_PID].token1), "Invalid token.");
        require(_tokenIn != address(0), "TokenIn with address null.");
        _;
    }

    modifier _isNullAddress(address token0, address token1) {
        require(token0 != address(0), "not initialized X.");
        require(token1 != address(0), "not initialized Y.");
        _;
    }

    function _getAmount(
        euint32 inputAmount,
        euint32 reserveX,
        euint32 reserveY
    ) internal view returns (euint32 outputAmount) {
        euint32 numerator = (reserveY * inputAmount);
        euint32 denominator = (reserveX + inputAmount);
        uint32 decrypt = TFHE.decrypt(denominator);
        outputAmount = TFHE.div(numerator, decrypt);
        return outputAmount;
    }

    function _getOtherTokenAddr(uint PID, address _token0) public view returns (address _token1) {
        address poolX = Pools[PID].token0;
        address poolY = Pools[PID].token1;

        if (_token0 == poolX) {
            _token1 = poolY;
        }
        if (_token0 == poolY) {
            _token1 = poolX;
        }
        return _token1;
    }

    function createPool(address _token0, address _token1) public _isNullAddress(_token0, _token1) returns (uint256) {
        uint256 PID = PIDs.length;

        Pools[PID].token0 = _token0;
        Pools[PID].token1 = _token1;

        PIDs.push(PID);

        return PID;
    }

    function addLiquidity(
        uint256 _PID,
        bytes calldata amount_token0,
        bytes calldata amount_token1
    ) public _isExistedPool(_PID) _isNullAddress(Pools[_PID].token0, Pools[_PID].token0) {
        euint32 amount0 = TFHE.asEuint32(amount_token0);
        euint32 amount1 = TFHE.asEuint32(amount_token1);

        require(TFHE.decrypt(TFHE.ge(amount0, 0)), "amount0 need to be greether or equal than 0.");
        require(TFHE.decrypt(TFHE.ge(amount1, 0)), "amount1 need to be greether or equal than 0.");

        if (TFHE.decrypt(TFHE.gt(Pools[_PID].reserve0, 0)) || TFHE.decrypt(TFHE.gt(Pools[_PID].reserve1, 0))) {
            require(
                TFHE.decrypt(TFHE.eq(Pools[_PID].reserve0 * amount1, Pools[_PID].reserve1 * amount0)),
                "x / y != dx / dy"
            );
        }

        if (TFHE.decrypt(TFHE.gt(amount0, 0))) {
            EncryptedERC20(Pools[_PID].token0).transferFrom(msg.sender, address(this), amount0);
            Pools[_PID].reserve0 = Pools[_PID].reserve0 + amount0;
        }
        if (TFHE.decrypt(TFHE.gt(amount1, 0))) {
            EncryptedERC20(Pools[_PID].token1).transferFrom(msg.sender, address(this), amount1);
            Pools[_PID].reserve1 = Pools[_PID].reserve1 + amount1;
        }
    }

    function removeLiquidity(
        uint256 _PID,
        bytes calldata amount_token0,
        bytes calldata amount_token1
    ) public _isExistedPool(_PID) _isNullAddress(Pools[_PID].token0, Pools[_PID].token0) {
        euint32 amount0 = TFHE.asEuint32(amount_token0);
        euint32 amount1 = TFHE.asEuint32(amount_token1);

        require(TFHE.decrypt(TFHE.ge(amount0, 0)), "amount0 need to be greether or equal than 0.");
        require(TFHE.decrypt(TFHE.ge(amount1, 0)), "amount1 need to be greether or equal than 0.");

        if (TFHE.decrypt(TFHE.gt(amount0, 0))) {
            EncryptedERC20(Pools[_PID].token0).transfer(msg.sender, amount0);
            Pools[_PID].reserve0 = Pools[_PID].reserve0 - amount0;
        }
        if (TFHE.decrypt(TFHE.gt(amount1, 0))) {
            EncryptedERC20(Pools[_PID].token1).transfer(msg.sender, amount1);
            Pools[_PID].reserve1 = Pools[_PID].reserve1 - amount1;
        }
    }

    function swap(
        bytes calldata _amount,
        address _tokenIn,
        uint256 _PID
    ) public _isExistedPool(_PID) _isValidToken(_tokenIn, _PID) {
        euint32 amountOut;
        euint32 amount = TFHE.asEuint32(_amount);
        address tokenOut = _getOtherTokenAddr(_PID, _tokenIn);

        require(TFHE.decrypt(TFHE.gt(amount, 0)), "Amount must be greater than 0.");

        EncryptedERC20(_tokenIn).transferFrom(msg.sender, address(this), amount);

        if (Pools[_PID].token0 == _tokenIn) {
            amountOut = _getAmount(amount, Pools[_PID].reserve0, Pools[_PID].reserve1);
        } else {
            amountOut = _getAmount(amount, Pools[_PID].reserve1, Pools[_PID].reserve0);
        }
        EncryptedERC20(tokenOut).transfer(msg.sender, amountOut);
    }
}
