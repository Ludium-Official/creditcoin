### **유니스왑 V3/V4 딥다이브 (2)**

![Main](</Advanced-Resources/Uniswap-Deep-Dive(1)/Images/Main.png>)

### **1. V4 등장 배경**

Uniswap V3의 새로운 기능들은 유동성 공급에 대해 강력하고 명확한 접근을 취했으나, 더 높은 수수료와 코드 복잡성을 대가로 지불하게 되었다.

Uniswap V4에서는 "훅(Hooks)" 의 도입을 통해 이러한 트레이드오프 결정들을 누구나 자유롭게 추가할 수 있게 했다.

이러한 커스터마이징과 더불어, Uniswap V4의 아키텍처는 비용을 절감하고 효율성을 보장합니다. v4는 모든 풀이 단일 스마트 컨트랙트 안에 존재하는 새로운 "싱글턴(singleton)" 구조를 도입합니다. 우리는 훅과 싱글턴 아키텍처의 결합이 빠르고 안전한 풀 커스터마이징과 다수 풀 간 효율적인 라우팅을 가능하게 하는 매우 강력한 플랫폼을 만든다고 믿습니다. Uniswap v4는 하나의 강력한 생태계 안에서 빠르고 표현력 있는 AMM 혁신을 실현합니다.

---

### 2. V3 vs V4 가스 비용 비교

1️⃣ 시나리오
행동: ETH ↔ USDC 스왑, 멀티풀 라우팅 필요

가정:

v3: 각 풀별 컨트랙트 존재 → 토큰 이동 필요

v4: 싱글턴 풀 → 풀 내 토큰 직접 이동

EIP-1153 적용 시 임시 연산 데이터는 transient storage에 저장

2️⃣ v3 가스 예제
항목 gas cost
Swap 계산 80,000
Token transfer between pools 50,000 × 2 (입출금) = 100,000
SSTORE (임시 데이터 저장) 20,000 × 2 = 40,000
총합 220,000 gas

각 풀마다 컨트랙트가 분리되어 있어, 토큰 이동과 storage write 비용이 높음

3️⃣ v4 가스 예제 (EIP-1153 포함)
항목 gas cost
Swap 계산 80,000
Token transfer (싱글턴 풀) 10,000 × 2 = 20,000
Transient storage (EIP-1153) 1,000 × 2 = 2,000
총합 102,000 gas

v4에서는 토큰 이동이 싱글턴 풀 안에서 처리되고, 임시 데이터는 EIP-1153로 훨씬 저렴하게 처리됨 → 약 54% 절감

4️⃣ 핵심 포인트
토큰 이동 최소화 → gas 절약

임시 데이터는 transient storage → 추가 절감

멀티풀 스왑 시 v3 대비 gas 거의 절반 이하로 감소

Hook과 결합하면 자동 전략 실행 + 비용 최적화 가능

💡 한 줄 요약:

v4 + EIP-1153 → 단일 풀에서 모든 계산 처리 + 임시 데이터 cheap storage → gas 절약 극대화

![Gas](</Advanced-Resources/Uniswap-Deep-Dive(1)/Images/V4_Gas.png>)

---

### 3. Uniswap V4 코드기반 상세분석

### 3-1. Singleton 구조

가스 절감

### 3-2. Hook 시스템 심화 분석

swap/mint/burn 시점 활용 사례

### 3-3. Custom Pool Logic

스테이블스왑, 동적 수수료

---

#### 참고 문헌

[Uniswap V4 Deep Dive | 1 — 코드를 통해 알아보는 V4](https://medium.com/decipher-media/uniswap-v4-deep-dive-1-%EC%BD%94%EB%93%9C%EB%A5%BC-%ED%86%B5%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EB%8A%94-v4-2881fa0358aa)
