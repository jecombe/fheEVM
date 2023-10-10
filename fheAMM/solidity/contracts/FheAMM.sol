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

    function createPool(address _token0, address _token1) public returns (uint256) {
        uint256 PID = PIDs.length;

        require(_token0 != address(0), "not initialized X");
        require(_token1 != address(0), "not initialized Y");

        Pools[PID].token0 = _token0;
        Pools[PID].token1 = _token1;

        PIDs.push(PID);

        return PID;
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

    // @dev given a pool id and a token address, return the other token address
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

    function _getLiquidity(uint256 _PID) internal view returns (ebool, ebool) {
        return (TFHE.gt(Pools[_PID].reserve0, 0), TFHE.gt(Pools[_PID].reserve1, 0));
    }

    // @dev deposit tokens into pool and create liquidity position
    function addLiquidity(uint256 PID, bytes calldata amount_token0, bytes calldata amount_token1) public {
        address token0 = Pools[PID].token0;
        address token1 = Pools[PID].token1;

        require(token0 != address(0), "not initialized X");
        require(token1 != address(0), "not initialized Y");

        euint32 amount0 = TFHE.asEuint32(amount_token0);
        euint32 amount1 = TFHE.asEuint32(amount_token1);

        require(TFHE.decrypt(TFHE.gt(amount0, 0)), "amount0 need to be greether than 0");
        require(TFHE.decrypt(TFHE.gt(amount1, 0)), "amount1 need to be greether than 0");

        //  checkLiquidity(amount0, amount1);

        EncryptedERC20(token0).transferFrom(msg.sender, address(this), amount0);
        EncryptedERC20(token1).transferFrom(msg.sender, address(this), amount1);

        Pools[PID].reserve0 = Pools[PID].reserve0 + amount0;
        Pools[PID].reserve1 = Pools[PID].reserve1 + amount1;
    }

    function swap(bytes calldata _amount, address _tokenIn, uint256 _PID) public {
        euint32 amountOut;
        euint32 amount = TFHE.asEuint32(_amount);

        require(TFHE.decrypt(TFHE.gt(amount, 0)), "Amount must be greater than 0.");
        require(_tokenIn != address(0), "TokenIn with address null");

        EncryptedERC20(_tokenIn).transferFrom(msg.sender, address(this), amount);
        address tokenOut = _getOtherTokenAddr(_PID, _tokenIn);
        if (Pools[_PID].token0 == _tokenIn) {
            amountOut = _getAmount(amount, Pools[_PID].reserve0, Pools[_PID].reserve1);
        } else {
            amountOut = _getAmount(amount, Pools[_PID].reserve1, Pools[_PID].reserve0);
        }
        EncryptedERC20(tokenOut).transfer(msg.sender, amountOut);
    }
}
