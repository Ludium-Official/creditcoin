# ERC-4337 : 계정 추상화(Account Abstraction)의 진화

## 1. 들어가며 — ERC란 무엇인가?

이더리움은 계속해서 새로운 아이디어를 받아들이며 진화해 왔다. 이때 특정 기능이나 규격을 공식적으로 제안하는 문서 형식이 바로 <strong>ERC(Ethereum Request for Comment)</strong>다.

이 문서는 말 그대로 “이더리움에 이런 기능을 추가하면 어떨까?”라는 의견을 담는 제안서다. 개발자, 연구자, 기업 누구나 작성할 수 있고, 커뮤니티의 토론과 피드백을 거쳐 합의가 되면 <strong>공식 표준</strong>(EIP)으로 채택된다.

이미 잘 알려진 표준들이 있다.

* <strong>ERC-20</strong> : 대체 가능한 토큰(Fungible Token)의 기본 규격으로, 디파이(DeFi) 프로젝트와 ICO에서 널리 사용된다.
* <strong>ERC-721</strong> : 대체 불가능 토큰(NFT) 표준으로, 디지털 아트, 게임 아이템, 메타버스 자산 같은 고유 자산을 표현할 수 있게 해줬다.

이런 표준들은 지금의 이더리움 생태계를 키운 핵심 도구라고 할 수 있다. <strong>ERC-4337</strong> 역시 같은 맥락에서 나온 제안이지만, 단순히 기능 몇 개를 늘리는 게 아니라 “지갑과 트랜잭션이 작동하는 방식 자체”를 새롭게 설계하려는 점에서 주목받고 있다.

하나의 제안이 표준으로 자리 잡기까지는 단계적인 과정을 거친다. 아이디어가 포럼이나 깃허브에서 논의되고, 초안(Draft)으로 정리된 뒤, 커뮤니티 검토(Review)를 통해 다듬어지며, 최종적으로 공식 표준(Final)로 채택된다. <strong>ERC-4337</strong> 역시 이러한 과정을 거쳐 탄생한 제안이다.

<img width="2936" height="675" alt="image" src="https://github.com/user-attachments/assets/7e43da85-2a09-4cae-a64b-79dcf060534a" />


---

## 2. Ethereum의 계정 구조: EOA와 CA

이더리움에는 기본적으로 두 가지 계정이 있다. <strong>EOA(Externally Owned Account)</strong>와 <strong>CA(Contract Account)</strong>다. 이름만 봐도 느낌이 오지만, 둘은 역할과 동작 방식이 꽤 다르다.

### 2.1 EOA (Externally Owned Account)

EOA는 개인이 직접 소유하고 제어하는 계정이다. 개인키(Private Key)로 서명해 트랜잭션을 발생시키는 구조라, 우리가 흔히 쓰는 메타마스크 지갑이나 하드웨어 월렛이 여기에 해당한다.

장점은 단순하고 직관적이라는 점이다. 하지만 단점도 명확하다.

* 개인키를 잃으면 계정을 복구할 수 없다.
* 지갑에 ETH가 없으면 아무 동작도 할 수 없다. (토큰이 아무리 많아도 ETH가 없으면 전송조차 불가능하다.)

즉, 구조는 단순하지만 사용자 경험(UX) 측면에서는 진입 장벽이 높은 셈이다.

### 2.2 CA (Contract Account)

CA는 말 그대로 스마트 컨트랙트가 담긴 계정이다. 이 계정은 사용자가 직접 서명하지 않고, 블록체인에 기록된 로직에 따라 자동으로 움직인다.

특징은 이렇다

* 외부에서 트랜잭션을 받아야만 실행된다.
* 내부 로직에 맞게 조건부 송금, DAO 운영, 토큰 발행 같은 복잡한 기능을 처리할 수 있다.
* 예컨대 유니스왑 같은 탈중앙 거래소도 컨트랙트 계정을 기반으로 동작한다.

다만, CA는 스스로 트랜잭션을 만들 수 없다는 점에서 수동적이다.

<img width="2937" height="975" alt="image" src="https://github.com/user-attachments/assets/85d175ed-2a02-4383-9f0c-a53b7f8cd0fb" />

---

## 3. 왜 계정 추상화(Account Abstraction)가 필요한가?

EOA와 CA는 서로 다른 장단점을 가진다. 문제는 이 두 구조가 분리돼 있다는 점이다. 이로 인해 실제 사용자 입장에서는 불편이 많다.

예를 들어,

* 블록체인 초보자는 개인키, 가스비, 지갑 연결 같은 개념부터 낯설다.
* ETH가 없으면 아무것도 못 한다는 점에서 진입 장벽이 높다.
* 지갑 복구 기능이 없어 개인키를 잃으면 자산도 함께 사라진다.
* 스마트 컨트랙트는 강력하지만, 스스로 트랜잭션을 만들 수 없는 수동적 구조다.

쉽게 말해, 지금의 계정 구조는 “기술적으로는 뛰어나지만 사용자 친화적이지 못하다.” <strong>Account Abstraction</strong>은 이 문제를 해결하려는 아이디어다. EOA와 CA의 경계를 없애고, 모든 계정을 스마트 컨트랙트처럼 유연하게 동작하도록 설계하자는 것이다.

<img width="2587" height="989" alt="image" src="https://github.com/user-attachments/assets/55199989-d1b2-4fcb-ae94-d680bd24b465" />


---

## 4. Account Abstraction: EOA와 CA의 경계를 허물다

앞에서 본 것처럼 EOA와 CA는 각자 장점은 있지만 서로 다른 한계 때문에 불편이 많다. <strong>Account Abstraction(계정 추상화)</strong>은 이 두 계정 사이의 경계를 없애고, 계정 자체를 더 똑똑하게 만들자는 아이디어다.

쉽게 말해, “모든 계정을 스마트 컨트랙트처럼 동작하게 하자”는 것이다.
이렇게 하면 계정 자체가 다양한 기능을 내장할 수 있다.

예를 들어, 기존 EOA에서는 불가능했던 기능들이 계정 추상화 구조에서는 가능해진다.

| 기존 EOA에서 불가능했던 것 | Account Abstraction에서 가능한 것      |
| ---------------- | -------------------------------- |
| 하루 송금 한도 없음      | 하루 최대 송금액 제한 가능                  |
| 자동 이체 불가         | 특정 날짜나 주기에 맞춰 자동 송금 가능           |
| 키 분실 시 복구 불가     | 소셜 리커버리 기능으로 복구 가능               |
| 가스비는 본인만 부담      | Paymaster 같은 제3자가 가스비를 대신 낼 수 있음 |

즉, 지금까지 은행 계좌에서는 당연하게 가능했던 기능들을 블록체인 지갑에서도 구현할 수 있게 되는 것이다. <strong>계정 추상화</strong>는 Web2에서 익숙했던 편리한 사용자 경험을 Web3에도 도입하려는 핵심 개념이라고 할 수 있다.

---

## 5. 계정 추상화를 위한 세 가지 주요 제안

계정 추상화를 구현하기 위한 논의는 2017년부터 이어져 왔다. 그 과정에서 세 가지 중요한 제안이 나왔다.

1. <strong>EIP-86 (2017)</strong>
2. <strong>ERC-2938 (2020)</strong>
3. <strong>ERC-4337 (2021)</strong>

모두 같은 목표(계정 추상화)를 가지고 있지만, 접근 방식과 프로토콜 변경 여부에서 차이를 보인다.
하나는 과감한 아이디어였고, 또 하나는 현실적인 시도였으며, 마지막은 하드포크 없이 가능한 길을 제시했다.

<img width="2537" height="575" alt="image" src="https://github.com/user-attachments/assets/90571948-8e13-4acb-933f-2bd4b4e0fe2f" />


---

## 6. EIP-86 (2017): 최초의 계정 추상화 제안

2017년, 비탈릭 부테린은 <strong>EIP-86</strong>이라는 제안을 내놓았다.
핵심은 간단하다. 지갑을 단순히 서명하고 송금하는 도구로 두지 말고, 스마트 컨트랙트처럼 로직을 담을 수 있는 형태로 바꾸자는 것이다.

예를 들어 이런 식이다.
“내 지갑에서 하루에 최대 10 ETH까지만 송금 가능하게 하자”
“특정 주소로는 절대 송금하지 못하도록 막자”

이런 규칙을 지갑 자체에 코드로 직접 넣어두자는 발상이다. 지금 들으면 꽤 당연해 보이지만, 당시에는 혁신적인 아이디어였다.

하지만 문제는 현실성이었다.
당시 이더리움은 <strong>EOA 중심 구조</strong>로 설계되어 있었기 때문에, 이 제안을 반영하려면 프로토콜 레벨에서 대대적인 수정이 필요했다. 즉, 사실상 <strong>하드포크</strong>가 불가피했던 것이다.

결국 EIP-86은 “기술적으로 이런 것도 가능하다”는 가능성을 보여주는 데 그쳤다. 실제 메인넷에서 채택되지는 못했지만, 이후 계정 추상화 논의의 출발점이 되었다는 점에서 의미가 크다.

<img width="2225" height="576" alt="image" src="https://github.com/user-attachments/assets/3acea477-eaaa-4342-8b8b-1335fec02a36" />


---

## 7. ERC-2938 (2020): 트랜잭션 타입의 진화

EIP-86은 아이디어는 훌륭했지만, 현실적으로는 너무 큰 변화를 요구했다.
“프로토콜 자체를 뜯어고쳐야 한다”는 부담 때문에 실제 적용은 불가능했던 것이다.

그래서 2020년에 등장한 <strong>ERC-2938</strong>은 좀 더 현실적인 접근을 시도했다. 핵심은 새로운 트랜잭션 타입을 추가해 계정 추상화를 구현하자는 아이디어였다.

여기서 제안된 주요 필드는 다음과 같다.

* `initCode` : 지갑이 어떤 로직을 기준으로 동작할지 초기화 코드를 담는다.
* `validationGas` : 트랜잭션 검증에 필요한 예상 가스량을 지정한다.
* `paymaster` : 가스비를 대신 내줄 주체를 지정할 수 있다.

즉, 트랜잭션 구조 안에 계정 추상화를 위한 필드를 심어놓는 방식이다.
또한 트랜잭션 처리 과정에 <strong>검증 단계(VALIDATE)</strong>를 추가해, 지갑이 실행 전에 직접 서명이나 정책 조건을 확인하도록 설계했다.

이 방식은 “사용자 맞춤형 지갑”이라는 계정 추상화의 핵심 기능을 어느 정도 실현할 수 있게 해줬다. 다양한 지갑 UX를 구현할 가능성을 보여준 셈이다.

하지만 한계는 여전했다.

* 트랜잭션 구조 자체를 바꾸어야 하므로 여전히 프로토콜 레벨 수정이 필요했다.
* 결과적으로 <strong>하드포크</strong> 없이는 메인넷 적용이 불가능했다.

정리하자면, ERC-2938은 EIP-86보다는 훨씬 현실적인 시도였지만, “프로토콜 변경”이라는 벽을 끝내 넘지 못했다.

<img width="2225" height="575" alt="image" src="https://github.com/user-attachments/assets/82cb7c0d-d60e-499e-8b10-df984bc3ed82" />

---

## 8. ERC-4337 (2021): 하드포크 없는 계정 추상화

그리고 2021년, 마침내 <strong>ERC-4337</strong>이 등장했다.
이 제안이 특별한 이유는, 앞선 두 제안과 달리 <strong>하드포크 없이</strong> 계정 추상화를 구현할 수 있다는 점이다.

즉, 이더리움의 코어 프로토콜을 건드리지 않고도, 스마트 컨트랙트와 새로운 구조만으로 계정 추상화를 실현할 수 있게 된 것이다.

여기서 중요한 개념이 바로 <strong>UserOperation</strong>이다.
ERC-4337은 기존 트랜잭션 대신 UserOperation이라는 구조체를 사용해 계정의 동작을 정의한다.

이를 처리하는 새로운 구성 요소도 함께 제안됐다.

| 구성 요소                                   | 설명                                                             |
| --------------------------------------- | -------------------------------------------------------------- |
| <strong>UserOperation</strong>          | 사용자의 요청. 송금 금액, 호출할 컨트랙트, 서명, 제한 정책 등이 담긴다.                    |
| <strong>Bundler</strong>                | 여러 UserOperation을 모아 EntryPoint로 전달하는 역할. 기존 채굴자/검증자와 비슷한 포지션. |
| <strong>EntryPoint</strong>             | 핵심 스마트 컨트랙트. UserOperation을 검증하고 실행하는 중재자.                     |
| <strong>Smart Wallet</strong>           | 사용자 정의 지갑. validateUserOp(), execute() 같은 로직을 직접 수행한다.         |
| <strong>Paymaster / Aggregator</strong> | 수수료 대납(Paymaster)이나 서명 검증 최적화(Aggregator)를 담당하는 보조 컴포넌트.       |

또 하나 중요한 차별점은 <strong>Alt Mempool</strong>이라는 별도의 메모풀 개념이다.
여기서는 기존 트랜잭션이 아니라 UserOperation을 수집하고 처리한다. 이 덕분에 EOA 기반과는 다른 흐름으로 트랜잭션을 다룰 수 있게 된다.

정리하자면, ERC-4337은 “하드포크 없는 계정 추상화”라는 점에서 앞선 제안들과 완전히 다른 길을 열어줬다.
쉽게 말해, 기존 구조를 무너뜨리지 않고도 계정 추상화를 현실로 만들 수 있는 첫 번째 제안이었던 것이다.

<img width="2538" height="481" alt="image" src="https://github.com/user-attachments/assets/b50d845b-5d85-4d7e-8206-7db3ccc625d2" />


---


## 9. ERC-4337은 어떻게 동작하는가?

그렇다면 실제로 ERC-4337은 어떻게 돌아갈까?
흐름을 간단히 살펴보면 다음과 같다.

1. 사용자가 스마트 월렛 앱에서 “10 ETH 보내기” 버튼을 누른다.
2. 이 요청은 기존 트랜잭션이 아니라 <strong>UserOperation</strong>이라는 구조체로 만들어진다.
3. UserOperation은 <strong>Bundler</strong>에게 전달된다.
4. Bundler는 <strong>EntryPoint</strong>라는 핵심 컨트랙트의 `handleOps()` 함수를 호출한다.
5. EntryPoint는 Smart Wallet의 `validateUserOp()`와 `execute()`를 실행한다.
6. Smart Wallet은 조건을 확인하고, 문제가 없으면 송금을 수행한다.

즉, 기존에는 EOA가 직접 트랜잭션을 발생시켰다면, 이제는 UserOperation → Bundler → EntryPoint → Smart Wallet이라는 새로운 경로를 거치게 되는 것이다.

여기서 핵심은 모든 과정이 <strong>스마트 컨트랙트 기반</strong>으로 처리된다는 점이다. 덕분에 지갑 로직을 자유롭게 설계할 수 있고, 다양한 기능을 계정 단위에서 구현할 수 있다.

<img width="2730" height="1330" alt="image" src="https://github.com/user-attachments/assets/f5a69c51-351b-47ae-9678-34147ef907a5" />

---

## 10. Paymaster: 가스비를 대신 내주는 존재

지금까지 블록체인을 처음 접하는 사람들이 가장 당황하는 부분은 바로 가스비(Gas Fee)다.
토큰은 있는데 ETH가 없어서 아무것도 못 해본 경험, 다들 한 번쯤 있지 않은가?

기존 구조에서는 트랜잭션을 실행하려면 무조건 ETH를 보유해야 했다.
“내가 NFT를 샀는데, 전송하려면 또 ETH를 사야 해?”라는 불편함이 발생했던 이유다.

ERC-4337에서는 이 문제를 <strong>Paymaster</strong>라는 구조로 풀어냈다.

Paymaster는 특별한 스마트 컨트랙트로, 사용자의 가스비를 대신 지불한다.
사용자는 UserOperation 안에 “paymasterAndData”라는 정보를 담아 어떤 Paymaster를 쓸지 지정할 수 있다.
이후 EntryPoint는 Paymaster의 검증 로직을 호출하고, 조건이 맞으면 가스비를 대납한다.

<img width="2002" height="650" alt="image" src="https://github.com/user-attachments/assets/610707c5-856d-41e5-be4f-6816c9ef9f17" />


---

## 11. Paymaster의 동작 방식

Paymaster가 실제로 작동하는 흐름은 이렇다.

1. 사용자가 스마트 월렛에서 UserOperation을 생성한다. 이때 Paymaster 관련 정보도 함께 포함된다.
2. Bundler가 이 UserOperation을 EntryPoint로 전달한다.
3. EntryPoint는 먼저 Paymaster의 `validatePaymasterUserOp()` 함수를 실행한다.

   * 여기서 조건 검증이 이루어진다. (예: 사용자가 특정 NFT를 가지고 있는지, 화이트리스트에 포함됐는지 등)
4. 조건이 충족되면 Paymaster가 가스비를 대납한다.
5. 이후 Smart Wallet의 `validateUserOp()`와 `execute()`가 순차적으로 실행된다.
6. 최종적으로 트랜잭션이 성공적으로 완료된다.

즉, 사용자는 ETH가 없어도 블록체인 상에서 원하는 작업을 수행할 수 있게 된다.

<img width="3069" height="1319" alt="image" src="https://github.com/user-attachments/assets/a49e812b-bee3-465d-a9a5-a4f184e4d8df" />


---

## 12. Paymaster가 바꾸는 사용자 경험(UX)

Paymaster는 단순히 “가스비를 대신 내준다”는 것 이상의 의미를 가진다.
프로젝트나 서비스 운영자가 조건부로 수수료 정책을 설계할 수 있기 때문이다.

예를 들어,

* 특정 NFT 보유자에게는 가스비 무료 혜택을 제공한다.
* 신규 가입자에게는 일정 기간 동안 수수료를 면제해준다.
* 특정 국가나 시간대에만 무료 이벤트를 진행한다.
* 광고나 제휴 프로모션을 통해 특정 행동을 하면 가스비를 대신 내준다.

이렇게 되면 사용자 경험은 크게 달라진다.

| Before (기존)              | After (ERC-4337 + Paymaster) |
| ------------------------ | ---------------------------- |
| ETH 없으면 아무것도 못함          | 토큰만 있어도 전송이나 게임 실행 가능        |
| 신규 유저는 온보딩 전에 ETH부터 사야 함 | 무료 체험처럼 가볍게 바로 시작 가능         |
| 모든 수수료는 사용자가 부담          | 플랫폼이나 프로젝트가 전략적으로 대납 가능      |
| 수수료 정책은 고정적              | 마케팅, 이벤트에 맞춰 유연한 설계 가능       |

쉽게 말해, Paymaster 덕분에 Web3 서비스도 Web2 앱처럼 “무료 체험 → 편리한 온보딩 → 조건부 혜택 제공”이 가능해진 것이다.

---


## 13. Aggregator: 서명 검증 비용 문제를 해결하다

ERC-4337 구조에서는 모든 UserOperation이 실행되기 전에 반드시 \*\*서명 검증(validateUserOp)\*\*을 거쳐야 한다.
문제는 수백, 수천 명의 사용자가 동시에 요청을 보내면 서명 검증만으로도 막대한 가스비가 발생한다는 점이다.

<img width="1688" height="483" alt="image" src="https://github.com/user-attachments/assets/ce07ee74-969b-46ae-978a-e5a8131b221e" />


왜 이렇게 부담이 클까?

* 각 지갑은 서로 다른 서명 알고리즘을 사용할 수 있다.
* UserOperation마다 개별적으로 서명을 확인해야 한다.
* 이 과정이 모두 스마트 컨트랙트 안에서 처리된다.

이 상황을 그대로 두면 번들러(Bundler)는 여러 요청을 묶어 처리할수록 손해를 보게 된다.
즉, ERC-4337의 확장성에 큰 걸림돌이 되는 셈이다.

이 문제를 풀기 위해 나온 개념이 바로 <strong>Aggregator(집계자)</strong>다.
말 그대로 “여러 서명을 하나로 합쳐서” 검증 부담을 줄이는 역할을 한다.

---

## 14. Aggregator의 핵심 아이디어

기존 방식과 Aggregator 방식을 비교해보면 훨씬 이해가 쉽다.

| 기존 방식                           | Aggregator 방식                  |
| ------------------------------- | ------------------------------ |
| 각 지갑이 개별적으로 서명 검증을 수행           | Aggregator가 여러 서명을 하나로 합성      |
| 트랜잭션마다 가스비 발생                   | 단 한 번의 검증으로 여러 트랜잭션 처리         |
| EntryPoint가 모든 지갑의 서명 검증을 직접 수행 | EntryPoint는 Aggregator의 결과만 확인 |

즉, EntryPoint가 Smart Wallet을 일일이 호출해 검증하는 대신, Aggregator가 미리 서명을 모아 하나의 결과만 전달한다.
이 덕분에 가스비를 크게 절약하고, 처리 속도도 빨라진다.

쉽게 말해, Aggregator는 “대신 검사해주는 심사원” 같은 역할을 한다. EntryPoint는 이 심사원(Aggregator)이 내린 결과만 확인하면 된다.

<img width="3077" height="1321" alt="image" src="https://github.com/user-attachments/assets/d85088a2-7499-4e23-adbd-478d9c71c012" />


---

## 15. 어떤 서명 알고리즘이 Aggregator에 적합할까?

그렇다면 어떤 서명 알고리즘이 Aggregator 구조에 잘 맞을까?
핵심은 “여러 개의 서명을 하나로 합칠 수 있느냐”에 있다.

대표적으로 다음 두 가지가 많이 언급된다.

* <strong>BLS (Boneh–Lynn–Shacham)</strong>

  * 여러 개의 서명을 단일 서명으로 합성할 수 있다.
  * 한 번 검증으로 n개의 서명을 모두 확인할 수 있다.
  * 이더리움 2.0에서도 채택된 방식이다.

* <strong>Schnorr Signature</strong>

  * 비트코인의 Taproot 업그레이드에서 사용된 서명 알고리즘이다.
  * 구조가 단순하고, 합성·검증이 효율적이다.

예를 들어, A, B, C 세 명이 각각 메시지에 서명했다고 해보자.
기존 방식에서는 서명 세 개(σ1, σ2, σ3)를 모두 검증해야 한다.
하지만 BLS 기반 Aggregator는 이들을 합쳐 σagg라는 단일 서명을 만들 수 있다.
EntryPoint는 σagg 하나만 확인하면 된다.

이렇게 하면 번들러는 수십, 수백 건의 요청을 **한 번의 검증**으로 처리할 수 있다.
결과적으로 ERC-4337의 확장성을 현실적으로 끌어올려 주는 핵심 장치가 된다.

<img width="2473" height="843" alt="image" src="https://github.com/user-attachments/assets/0d9dd698-df91-43e1-aa0b-36c76064613f" />


---

## 16. ERC-4337의 현실적 한계: 높은 가스비

ERC-4337은 사용자 경험(UX) 관점에서 혁신적이지만, 현실적으로는 큰 약점이 하나 있다. 바로 **높은 가스비**다.

기존 EOA 계정은 단순히 서명하고 전송만 하면 되기 때문에 가스 사용량이 상대적으로 적다.
반면, ERC-4337은 계정 추상화를 구현하기 위해 여러 스마트 컨트랙트를 거쳐야 한다.

흐름을 보면 이렇다.

```
UserOperation
 → Bundler
   → EntryPoint.handleOps()
     → SmartWallet.validateUserOp()
       → SmartWallet.execute()
         → (선택) Paymaster.validatePaymasterUserOp()
         → (선택) Aggregator.validateSignatures()
```

즉, 단순 송금 하나를 하더라도 EntryPoint, Smart Wallet, Paymaster, Aggregator까지 연달아 호출된다.
이 과정에서 당연히 가스가 많이 든다.

실제로 분석에 따르면, EOA 대비 최대 **2배 이상**의 가스가 소모될 수 있다고 한다.

왜 이렇게 많은 가스가 들까?

1. **EntryPoint 호출 비용** : handleOps()는 여러 유효성 검사를 동시에 처리해야 하므로 무겁다.
2. **컨트랙트 중첩 호출** : EntryPoint → SmartWallet → 다른 컨트랙트로 이어지는 계층 구조 때문에 오버헤드가 크다.
3. **검증 절차의 중복** : 서명 검증, Nonce 확인, 예치금 확인, 조건부 대납 여부 확인 등이 모두 스마트 컨트랙트 안에서 일어난다.

즉, ERC-4337은 편리하지만 그만큼 “무거운 구조”를 가지고 있다고 볼 수 있다.

---

## 17. 해결책: Layer 2와 Rollup

그렇다고 “가스비가 많이 든다”는 이유만으로 ERC-4337을 포기할 수는 없다.
이 문제를 해결하기 위한 방법으로 가장 많이 언급되는 것이 바로 **Layer 2**다.

### Layer 2란?

Layer 2(L2)는 이더리움 메인체인(L1) 위에서 돌아가는 보조 네트워크다.
대부분의 연산을 L2에서 처리하고, 최종 결과만 L1에 기록한다.
이렇게 하면 가스비를 크게 줄이면서도 L1의 보안성을 유지할 수 있다.

### Rollup: 가장 유망한 방식

특히 <strong>Rollup</strong>이 주목받는다.
Rollup은 수많은 트랜잭션을 묶어 압축한 뒤, 이를 한 번에 메인넷(L1)에 기록한다.
즉, 처리 속도는 빨라지고 비용은 줄어드는 구조다.

ERC-4337이 Rollup 기반 L2에서 동작한다면 어떤 이점이 있을까?

* EntryPoint, Smart Wallet 같은 다단계 호출이 L2에서 처리되므로 비용이 훨씬 저렴하다.
* Paymaster 정책도 L2 환경에서 더 빠르고 유연하게 적용할 수 있다.
* 최종 결과만 L1에 기록하기 때문에 보안성은 유지된다.

쉽게 말해, ERC-4337은 L1 단독으로 쓰기에는 가스비가 너무 크지만, Rollup 같은 L2와 결합하면 UX 혁신을 현실적으로 구현할 수 있다.

<img width="2291" height="574" alt="image" src="https://github.com/user-attachments/assets/b6b88efc-9050-4843-93c2-ed532a833987" />

---

## 18. Account Abstraction(ERC-4337) 구현 시 핵심 포인트

### 서명 검증은 반드시 Smart Wallet 안에서 이뤄져야 한다

ERC-4337 구조에서 <strong>EntryPoint</strong>는 UserOperation을 받아 <code>validateUserOp()</code>를 호출하는 중재자 역할을 한다.
여기서 흔히 하는 착각이 있다. “서명 검증을 EntryPoint에서 하면 되지 않을까?”라는 생각이다.

하지만 EntryPoint는 누구나 호출할 수 있는 **공개 컨트랙트**다.
만약 Smart Wallet 자체에 서명 검증 로직이 없다면, 악의적인 사용자가 유효하지 않은 서명으로도 EntryPoint를 통해 Smart Wallet을 실행시킬 수 있게 된다.

즉, Smart Wallet 내부에 반드시 <code>validateUserOp()</code>를 구현해 서명 유효성, 정책 조건, 접근 권한 등을 철저히 확인해야 한다.
EntryPoint는 단지 트리거일 뿐, 실제 검증 책임은 Smart Wallet이 져야 한다는 점을 명심해야 한다.

---

### Nonce 검증은 Smart Wallet이 직접 관리해야 한다

ERC-4337에서는 트랜잭션이 아니라 <strong>UserOperation</strong> 단위로 요청이 처리된다.
그런데 중요한 차이가 하나 있다. EntryPoint는 **nonce(순서값)를 추적하지 않는다**는 점이다.

이게 무슨 뜻일까?
과거에 제출된 UserOperation을 누군가 다시 제출해도, EntryPoint는 그것이 중복인지 아닌지를 알지 못한다는 의미다.

따라서 Smart Wallet 내부에서 직접 nonce를 관리하고 업데이트해야 한다.
예를 들어, 이런 식이다.

```solidity
mapping(address => uint256) public nonces;

function validateUserOp(UserOperation calldata op, ...) external {
    require(op.nonce == nonces[msg.sender], "Invalid nonce");
    nonces[msg.sender]++;
    ...
}
```

이 로직이 없다면 <strong>Replay Attack(재전송 공격)</strong>에 노출된다.
누군가 과거의 유효했던 UserOperation을 다시 제출하면, 같은 트랜잭션이 여러 번 실행될 수 있다는 말이다.
그 결과 자산 탈취나 중복 결제 같은 심각한 문제가 발생할 수 있다.

따라서 ERC-4337에서 nonce 관리자는 EntryPoint가 아니라 Smart Wallet이다.

---

### EntryPoint의 예치금(Deposit) 잔액을 반드시 확인해야 한다

ERC-4337에서 번들러(Bundler)는 선결제 방식으로 움직인다.
즉, 번들러가 먼저 가스비를 내고, 나중에 Smart Wallet이나 Paymaster로부터 돌려받는 구조다.

그런데 만약 Smart Wallet에 예치금이 부족하다면 어떻게 될까?
트랜잭션은 중간에 실패하고, 그 피해는 번들러가 고스란히 떠안게 된다.

이를 막기 위해 Smart Wallet은 항상 자신의 잔액을 확인해야 한다.
예를 들어, 다음과 같이 검사할 수 있다.

```solidity
function validateUserOp(...) external returns (...) {
    require(address(this).balance >= op.maxFee, "Insufficient deposit");
    ...
}
```

또는 EntryPoint의 <code>deposit</code> 상태를 조회하거나 <code>addDeposit()</code>을 통해 사전에 충분한 자금을 확보하도록 설계할 수도 있다.

이 부분을 놓치면 번들러는 반복적으로 손해를 보게 되고, 결국 네트워크 참여 유인이 줄어들 수 있다.
따라서 **예치금 확인은 ERC-4337 구조의 안정성을 지탱하는 핵심 안전장치**라고 할 수 있다.

---


## 19. Web3 지갑의 미래: 왜 ERC-4337인가?

이더리움 창시자인 비탈릭 부테린(Vitalik Buterin)은 여러 자리에서 <strong>“탈중앙화된 수수료 시장(Decentralized Fee Market)”</strong>의 중요성을 강조해 왔다.
ERC-4337은 바로 이 구조를 실현할 수 있는 토대를 제공한다.

### 기존 모델의 한계

지금까지의 Web3 지갑은 이런 구조였다.

* 가스비는 무조건 사용자가 ETH로 직접 지불해야 한다.
* 검증자는 메인넷 채굴자나 소수의 검증자에 집중되어 있다.
* 수수료 정책은 일률적이고, 개인 맞춤형으로 조정하기 어렵다.
* 플랫폼이 사용자의 조건에 따라 유연하게 대처하기 어렵다.

즉, “블록체인은 신기하지만 쓰기 불편하다”라는 인식을 낳은 주범이 바로 이 지갑 구조였다.

<img width="1252" height="812" alt="image" src="https://github.com/user-attachments/assets/c6028967-386d-44cd-adcc-2a4de119ef03" />


---

### ERC-4337이 만들어내는 변화

쉽게 말해, 이제는 “가스비는 당연히 내가 낸다”라는 개념에서 벗어나,
“가스비도 서비스 전략의 일부가 될 수 있다”라는 패러다임으로 이동하는 것이다.

사용자는 ETH가 없어도 서비스를 시작할 수 있고, 프로젝트는 자신만의 수수료 정책을 설계하며 사용자 경험을 차별화할 수 있다.


| 항목     | 기존 방식       | ERC-4337 방식                      |
| ------ | ----------- | -------------------------------- |
| 수수료 납부 | 사용자 본인만 가능  | Paymaster, 플랫폼, 서드파티 등 다양한 주체 가능 |
| 수수료 기준 | ETH 고정      | 조건 기반 (NFT 보유, 위치, 이벤트 참여 등)     |
| 검증자    | 소수의 채굴자/검증자 | 누구나 참여할 수 있는 Bundler 시장          |
| UX 설계  | 고정적         | 스마트 컨트랙트 기반으로 자유롭게 설계 가능         |


---

### 마무리: Web3 대중화를 향한 발걸음

그동안 Web3는 늘 기술적 잠재력은 인정받았지만, 사용자 친화적이지 못해 대중화에 어려움을 겪어왔다. <strong>ERC-4337</strong>은 이 문제의 본질, 즉 **계정 구조 자체**를 손보는 제안이다.

이 제안이 실현되면,

* 사용자에게는 더 안전하고 편리한 지갑 경험이,
* 개발자에게는 더 다양한 서비스 설계의 자유가 주어진다.

결국 ERC-4337은 단순한 기술 표준을 넘어, \*\*“Web3를 누구나 쓸 수 있는 서비스로 만드는 관문”\*\*이라고 할 수 있다.

