### **유니스왑 V3/V4 딥다이브 (2)**

![Main](/Advanced-Resources/Uniswap-Deep-Dive/Images/Main.png)

### **1. V3 등장 배경**

...

### **2. Uniswap V3 코드기반 상세분석**

#### 2-1. Immutable & Concentrated Liquidity

**Immutable (불변성):**
Uniswap V3는 모든 풀이 단일 Factory 컨트랙트에서 생성되며, 각 풀은 고유한 주소를 가진다.

```solidity
// UniswapV3Factory.sol
contract UniswapV3Factory is IUniswapV3Factory {
    // [토큰A 주소][토큰B 주소][수수료] = 풀 주소
    mapping(address => mapping(address => mapping(uint24 => address))) public override getPool;

    function createPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external override returns (address pool) {
        require(tokenA != tokenB); // 서로 다른 토큰인지 확인
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA); // 주소 알파벳 순 정렬
        require(token0 != address(0)); // 0 주소 아닌지 확인

        int24 tickSpacing = feeAmountTickSpacing[fee]; // tick 간격 가져오기
        require(tickSpacing != 0);

        // 풀 주소 계산 (CREATE2 사용)
        // CREATE2: 파라미터가 동일하면 항상 같은 주소로 컨트랙트가 배포됨 (일관성 유지)
        pool = IUniswapV3PoolDeployer(deployer).deploy(
            address(this),
            token0,
            token1,
            fee,
            tickSpacing
        );

        getPool[token0][token1][fee] = pool;
        getPool[token1][token0][fee] = pool;

        emit PoolCreated(token0, token1, fee, tickSpacing, pool);
    }
}
```

**Concentrated Liquidity (집중 유동성):** 기존 V2의 `x * y = k` 공식을 확장하여 특정 가격 구간에만 유동성을 집중시킨다.

```solidity
// UniswapV3Pool.sol - 핵심 수학 공식
contract UniswapV3Pool {
    // 가격을 로그 스케일로 표현 (tick)
    function getSqrtRatioAtTick(int24 tick) internal pure returns (uint160) {
        return TickMath.getSqrtRatioAtTick(tick);
    }

    // 유동성 계산
    function getLiquidityForAmounts(
        uint160 sqrtRatioX96, // 현재 가격의 제곱근
        uint160 sqrtRatioAX96, // 하한 가격의 제곱근
        uint160 sqrtRatioBX96, // 상한 가격의 제곱근
        uint256 amount0, // token0의 양
        uint256 amount1 // token1의 양
    ) internal pure returns (uint128 liquidity) {
        if (sqrtRatioX96 <= sqrtRatioAX96) {
            // 현재 가격이 하한선보다 낮은 경우 token0만 사용하여 유동성 계산
            liquidity = getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
        } else if (sqrtRatioX96 >= sqrtRatioBX96) {
            // 현재 가격이 상한선보다 높은 경우 token1만 사용하여 유동성 계산
            liquidity = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
        } else {
            // 현재 가격이 범위 내에 있는 경우 두 토큰 모두 사용하여 유동성 계산
            uint128 liquidity0 = getLiquidityForAmount0(sqrtRatioX96, sqrtRatioBX96, amount0);
            uint128 liquidity1 = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioX96, amount1);
            liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1; // 더 작은 값 선택
        }
    }
}
```

#### 2-2. LP NFT (Non-Fungible Position)

V3에서는 LP 포지션이 NFT로 표현된다. 각 포지션은 고유한 가격 구간과 유동성 양을 가진다.

```solidity
// NonfungiblePositionManager.sol
contract NonfungiblePositionManager is
    INonfungiblePositionManager,
    Multicall,
    ERC721Permit
{
    struct Position {
        uint96 nonce;                    // 재사용 공격 방지를 위한 nonce
        address operator;                // 포지션을 조작할 수 있는 주소
        address token0;                  // 첫 번째 토큰 주소 (정렬됨)
        address token1;                  // 두 번째 토큰 주소 (정렬됨)
        uint24 fee;                      // 수수료 티어 (예: 3000 = 0.3%)
        int24 tickLower;                 // 하한 가격 tick
        int24 tickUpper;                 // 상한 가격 tick
        uint128 liquidity;               // 유동성 양
        uint256 feeGrowthInside0LastX128; // token0의 수수료 성장률 (마지막 업데이트 시점)
        uint256 feeGrowthInside1LastX128; // token1의 수수료 성장률 (마지막 업데이트 시점)
        uint128 tokensOwed0;             // 수집 가능한 token0 수수료
        uint128 tokensOwed1;             // 수집 가능한 token1 수수료
    }

    // [NFT ID] = 포지션 정보
    mapping(uint256 => Position) public positions;

    function mint(MintParams calldata params)
        external
        payable
        override
        returns (
            uint256 tokenId,    // 생성된 NFT ID
            uint128 liquidity,  // 생성된 유동성 양
            uint256 amount0,    // 사용된 token0 양
            uint256 amount1     // 사용된 token1 양
        )
    {
        // 팩토리에서 해당 토큰 쌍의 풀 주소 가져오기
        IUniswapV3Pool pool = IUniswapV3Pool(
            factory.getPool(params.token0, params.token1, params.fee)
        );

        // 유동성 추가
        (liquidity, amount0, amount1) = pool.mint(
            address(this),           // 이 컨트랙트가 LP 역할
            params.tickLower,        // 하한 가격
            params.tickUpper,        // 상한 가격
            params.amount0Desired,   // 원하는 token0 양
            params.amount1Desired,   // 원하는 token1 양
            params.amount0Min,       // 최소 token0 양 (슬리피지 보호)
            params.amount1Min        // 최소 token1 양 (슬리피지 보호)
        );

        // NFT 민팅
        _mint(params.recipient, (tokenId = _nextId++));

        // 포지션 정보 저장
        positions[tokenId] = Position({
            nonce: pool.nonces(address(this)),  // 풀의 nonce 가져오기
            operator: params.operator,           // 포지션 조작자
            token0: params.token0,               // 첫 번째 토큰
            token1: params.token1,               // 두 번째 토큰
            fee: params.fee,                     // 수수료
            tickLower: params.tickLower,         // 하한 tick
            tickUpper: params.tickUpper,         // 상한 tick
            liquidity: liquidity,                // 생성된 유동성
            feeGrowthInside0LastX128: 0,         // 초기값 0
            feeGrowthInside1LastX128: 0,         // 초기값 0
            tokensOwed0: 0,                      // 초기값 0
            tokensOwed1: 0                       // 초기값 0
        });
    }
}
```

#### 2-3. Tick System (가격 구간 시스템)

V3는 가격을 이산적인 "tick" 단위로 나누어 관리한다.

```solidity
// TickMath.sol
library TickMath {
    /// @dev 최소 tick 값
    int24 internal constant MIN_TICK = -887272;
    /// @dev 최대 tick 값
    int24 internal constant MAX_TICK = -MIN_TICK;

    /// @dev tick을 sqrt price로 변환
    function getSqrtRatioAtTick(int24 tick) internal pure returns (uint160) {
        require(tick >= MIN_TICK && tick <= MAX_TICK, 'T');

        // tick의 절댓값
        uint256 absTick = tick < 0 ? uint256(-int256(tick)) : uint256(int256(tick));
        require(absTick <= uint256(uint24(MAX_TICK)), 'T');

        // 각 비트가 1인지 확인하여 해당하는 승수를 곱함
        uint256 ratio = absTick & 0x1 != 0
            ? 0xfffcb933bd6fad37aa2d162d1a594001
            : 0x100000000000000000000000000000000;


        if (absTick & 0x2 != 0) ratio = (ratio * 0xfff97272373d413259a46990580e213a) >> 128;
        if (absTick & 0x4 != 0) ratio = (ratio * 0xfff2e50f5f656932ef12357cf3c7fdcc) >> 128;
        if (absTick & 0x8 != 0) ratio = (ratio * 0xffe5caca7e10e4e61c3624eaa0941cd0) >> 128;
        // ...

        // tick이 음수인 경우 역수 계산
        if (tick > 0) ratio = type(uint256).max / ratio;

        // 최종 결과를 uint160으로 변환 (2^96 스케일링)
        return uint160((ratio >> 32) + (ratio % (1 << 32) == 0 ? 0 : 1));
    }
}
```

#### 2-4. Swap 로직 구현

V3의 스왑은 현재 가격과 목표 가격 사이의 모든 tick을 순회하며 유동성을 소모한다.

```solidity
// UniswapV3Pool.sol - swap 함수
function swap(
    address recipient,           // 스왑 결과를 받을 주소
    bool zeroForOne,            // true: token0 → token1, false: token1 → token0
    int256 amountSpecified,     // 스왑할 양 (양수: 정확한 입력, 음수: 정확한 출력)
    uint160 sqrtPriceLimitX96,  // 가격 한계 (슬리피지 보호)
    bytes calldata data         // 콜백 함수에 전달할 데이터
) external override returns (int256 amount0, int256 amount1) {
    require(amountSpecified != 0, 'AS');

    Slot0 memory slot0Start = slot0; // 현재 풀 상태 저장 (스왑 중 재진입 방지)

    // 풀이 잠겨있지 않은지 확인
    require(slot0Start.unlocked, 'LOK');
    // 가격 한계가 유효한지 확인
    require(
        zeroForOne
            ? sqrtPriceLimitX96 < slot0Start.sqrtPriceX96 && sqrtPriceLimitX96 > TickMath.MIN_SQRT_RATIO
            : sqrtPriceLimitX96 > slot0Start.sqrtPriceX96 && sqrtPriceLimitX96 < TickMath.MAX_SQRT_RATIO,
        'SPL'
    );

    slot0.unlocked = false; // 풀을 잠금 (재진입 공격 방지)

    SwapCache memory cache = SwapCache({
        liquidityStart: liquidity,
        blockTimestamp: _blockTimestamp(),
        feeProtocol: zeroForOne ? (slot0Start.feeProtocol % 16) : (slot0Start.feeProtocol >> 4),
        secondsPerLiquidityCumulativeX128: 0,
        tickCumulative: 0,
        computedLatestObservation: false
    });

    bool exactInput = amountSpecified > 0;

    SwapState memory state = SwapState({
        amountSpecifiedRemaining: amountSpecified,
        amountCalculated: 0,
        sqrtPriceX96: slot0Start.sqrtPriceX96,
        tick: slot0Start.tick,
        feeGrowthGlobalX128: zeroForOne ? feeGrowthGlobal0X128 : feeGrowthGlobal1X128,
        protocolFee: 0,
        liquidity: cache.liquidityStart
    });

    // 스왑 루프: 모든 tick을 순회하며 유동성 소모
    while (state.amountSpecifiedRemaining != 0 && state.sqrtPriceX96 != sqrtPriceLimitX96) {
        SwapStep memory step = SwapStep({
            sqrtPriceStartX96: state.sqrtPriceX96,
            tickNext: initializedTicks[state.tick].nextInitializedTickWithinOneWord,
            initialized: initializedTicks[state.tick].nextInitializedTickWithinOneWord != state.tick,
            sqrtPriceNextX96: 0,
            amountIn: 0,
            amountOut: 0,
            feeAmount: 0
        });

        // 다음 가격 계산
        (step.sqrtPriceNextX96, step.amountIn, step.amountOut, step.feeAmount) = SwapMath
            .getNextSqrtPriceFromInput(
                state.sqrtPriceX96,      // 현재 가격
                state.liquidity,         // 현재 유동성
                state.amountSpecifiedRemaining, // 남은 양
                zeroForOne              // 방향
            );

        // 스왑 실행
        if (exactInput) {
            // 정확한 입력: 입력 양과 수수료를 차감
            state.amountSpecifiedRemaining -= (step.amountIn + step.feeAmount).toInt256();
            state.amountCalculated = state.amountCalculated.sub(step.amountOut.toInt256());
        } else {
            // 정확한 출력: 출력 양을 추가
            state.amountSpecifiedRemaining += step.amountOut.toInt256();
            state.amountCalculated = state.amountCalculated.add((step.amountIn + step.feeAmount).toInt256());
        }

        // 가격이 변경된 경우 tick 업데이트
        if (state.sqrtPriceX96 != step.sqrtPriceNextX96) {
            state.sqrtPriceX96 = step.sqrtPriceNextX96;
            state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
        }
    }

    // 최종 상태 업데이트
    (amount0, amount1) = zeroForOne
        ? (amountSpecified - state.amountSpecifiedRemaining, state.amountCalculated)
        : (state.amountCalculated, amountSpecified - state.amountSpecifiedRemaining);

    // 토큰 전송
    if (zeroForOne) {
        // token0 → token1 스왑
        if (amount1 < 0) TransferHelper.safeTransfer(token1, recipient, uint256(-amount1));
        uint256 balance0Before = balance0();
        IUniswapV3SwapCallback(msg.sender).uniswapV3SwapCallback(amount0, amount1, data);
        require(balance0Before.add(uint256(amount0)) <= balance0(), 'IIA');
    } else {
        // token1 → token0 스왑
        if (amount0 < 0) TransferHelper.safeTransfer(token0, recipient, uint256(-amount0));
        uint256 balance1Before = balance1();
        IUniswapV3SwapCallback(msg.sender).uniswapV3SwapCallback(amount0, amount1, data);
        require(balance1Before.add(uint256(amount1)) <= balance1(), 'IIA');
    }

    // 풀 상태 업데이트
    slot0.sqrtPriceX96 = state.sqrtPriceX96;
    slot0.tick = state.tick;

    slot0.unlocked = true; // 풀 잠금 해제
}
```

#### 2-5. 개발 최적화 기법들

**1. 가스 최적화**

여러 변수를 하나의 스토리지 슬롯에 패킹하여 가스 비용 절약한다.

```solidity
struct Slot0 {
    uint160 sqrtPriceX96;
    int24 tick;
    uint16 observationIndex;
    uint16 observationCardinality;
    uint16 observationCardinalityNext;
    uint8 feeProtocol;
    bool unlocked;
}
```

**2. 수수료 티어 시스템**

Factory에서 수수료별 풀을 관리한다.

```solidity
mapping(address => mapping(address => mapping(uint24 => address))) public override getPool;

// 수수료별 tick spacing
mapping(uint24 => int24) public override feeAmountTickSpacing;
```

**3. Oracle 기능 (TWAP)**

시간 가중 평균 가격을 계산하여 가격 조작을 방지한다.

```solidity
struct Observation {
    uint32 blockTimestamp;       // 블록 타임스탬프
    int56 tickCumulative;        // 누적 tick (시간 가중 계산용)
    bool initialized;            // 초기화 여부
}

// 특정 시간 간격의 평균 가격을 계산
function observe(uint32[] calldata secondsAgos)
    external
    view
    override
    returns (int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidityCumulativeX128s)
{
    return oracle.observe(secondsAgos);
}
```

이러한 구조를 통해 V3는 기존 V2 대비 **자본 효율성을 4000배 향상**시켰으며, LP들이 더 전략적으로 유동성을 배치할 수 있게 되었다.

---

#### 참고 문헌

[What is an Automated Market Maker?](https://blog.uniswap.org/what-is-an-automated-market-maker)

[Uniswap v2 Overview](https://blog.uniswap.org/uniswap-v2)

[Introducing Uniswap v3](https://blog.uniswap.org/uniswap-v3)

[Our Vision for Uniswap v4](https://blog.uniswap.org/uniswap-v4)
