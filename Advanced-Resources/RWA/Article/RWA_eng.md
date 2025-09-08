### **RWA (Real-World Assets)**

![RWA](/Advanced-Resources/RWA/Images/RWA.jpg)
Source: Tokeny

### **1. RWA (Real World Assets) Overview**

### 1-1. What is RWA (Real World Assets)?

RWA is the technology of tokenizing real-world assets (e.g., gold, stocks, bonds, real estate, artwork, etc.) using blockchain, making them tradable and investable.

Traditional asset trading has evolved over time as follows:

| Era          | Trading Method          | Characteristics                             | Limitations                                                                   |
| ------------ | ----------------------- | ------------------------------------------- | ----------------------------------------------------------------------------- |
| **Past**     | Paper certificate       | Physical certificates, face-to-face trading | Storage risk, forgery risk, lack of liquidity                                 |
| **Web2 Era** | Online platforms        | Centralized exchanges, digitized            | Reliance on central authority, fees, trading hours, cross-border restrictions |
| **Web3 Era** | Blockchain tokenization | Decentralized, 24/7 global access           | Regulatory uncertainty, technical complexity                                  |

**Why do we need Web3?**

Although Web2 platforms already provide efficient asset trading, they have inherent limitations:

1. **Limitations of Centralization**

   - Single Point of Failure (SPOF) risk
   - Vulnerable to hacks, downtime, or operational risks
   - Users lack full control over their assets

2. **Limitations of Transaction Efficiency**

   - Trading hours restricted (weekends, holidays)
   - High costs and complexity of cross-border trades
   - Delays caused by intermediaries

3. **Limitations of Transparency and Trust**
   - Opaque transaction history
   - Discretionary decisions by central authorities
   - Difficult to audit and verify

**Web3 Innovations Provided by RWA**

- **Accessibility:** Fractional ownership of high-value assets
- **Liquidity:** Ability to trade traditionally illiquid assets
- **Efficiency:** Reduced intermediary costs, 24/7 availability
- **Transparency:** All transactions recorded on blockchain
- **Regulatory compliance:** Leverages blockchain while meeting financial regulations

Because of these advantages, more and more assets are being tokenized.

**RWA vs STO**

Before RWAs, there were STOs (Security Token Offerings). While similar, they differ in the following ways:

|            | STO                                        | RWA                                                                             |
| ---------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| Main Goal  | Asset liquidity / fundraising / investment | Operate and trade real-world assets on-chain → enhance liquidity and efficiency |
| Target     | Securities (stocks, bonds, etc.)           | All real assets (gold, real estate, artwork, etc.)                              |
| Regulation | Strictly managed under securities law      | Must comply with property laws and asset-specific regulations                   |
| Scope      | Only securities-related assets             | Broader: encompasses all real-world assets                                      |

STOs tokenize only **securities** under financial regulations, while RWAs tokenize **all types of real assets** (including real estate and art) for decentralized trading (e.g., DeFi). STO can be seen as a subset of RWA.

**Examples of Assets Being Tokenized**

1. **Currency** – On-chain dollars backed by fiat (e.g., USDT, USDC)
2. **Bonds** – Tokenized government/corporate bonds, fractionalized for retail investors (e.g., BlackRock BUIDL Fund)
3. **Stocks & Funds** – Direct access to traditional funds via blockchain (e.g., Securitize x KKR)
4. **Commodities** – Precious metals like gold backed 1:1 (e.g., Tether Gold (XAUT))
5. **Real Estate** – Fractional ownership of illiquid property (e.g., MUFG Osaka commercial district tokenization)

Other examples include art, intellectual property, or even game items.

---

### 1-2. Global Market Outlook

The RWA market is growing rapidly.  
According to Boston Consulting Group (BCG), asset tokenization could reach **$16 trillion** by 2030.

![Market](/Advanced-Resources/RWA/Images/Market.webp)

**[Current Market Composition]**

Real-world asset data can be tracked in real-time at [RWA.xyz](https://app.rwa.xyz/).

![TotalValue](/Advanced-Resources/RWA/Images/TotalValue.png)

So far:

- Stablecoins dominate (~$300B)
- Private credit (~$16B)
- Bonds (~$7B)

![Chain1](/Advanced-Resources/RWA/Images/Chain1.png)

**Chain selection is critical** in RWAs, since these assets must run reliably over long periods. Security, sustainability, and trust matter.

Ethereum leads with over **50% market share** thanks to standards like ERC-1400 and ERC-3643, proven security, and institutional trust.

![Chain2](/Advanced-Resources/RWA/Images/Chain2.png)

However, Ethereum has limitations—slow throughput, latency, and unpredictable gas fees.

As a result, faster and cheaper L1s (e.g., Solana, Polygon, Avalanche) are gaining traction.

For example, **Securitize** expanded to Solana, Polygon, and Avalanche, while offering cross-chain support via Wormhole.

![Chain3](/Advanced-Resources/RWA/Images/Chain3.png)

Another issue: KYC/AML processes are usually handled **off-chain**, which weakens on-chain transparency and governance.

To address this, several platforms are building **dedicated RWA chains** with:

- Integrated compliance modules
- Embedded oracles/reserves
- End-to-end tokenization solutions

---

### **2. ERC-3643 Overview**

### 2-1. ERC-20 vs ERC-3643

ERC-3643 is a token standard specifically designed for RWA. Differences from ERC-20:

| Feature       | ERC-20            | ERC-3643             |
| :------------ | :---------------- | :------------------- |
| Asset backing | ❌ None           | ✅ Real asset backed |
| Regulation    | ❌ None           | ✅ Full compliance   |
| Identity      | ❌ Anonymous      | ✅ KYC/AML required  |
| Transfer      | ❌ Free transfers | ✅ Conditional only  |
| Legal binding | ❌ None           | ✅ Yes               |
| Risk          | ⬆️ High           | ⬇️ Low               |

### 2-2. Core Functions

- **On-chain Identity Management (ONCHAINID):** Stores KYC/AML info securely on-chain
- **Permissioned Transfers:** Rule-based token transfers
- **Modular Compliance:** Smart contracts define issuance/transfer conditions
- **ERC-20 Compatibility:** Works with existing ERC-20 infrastructure

### 2-3. Key Components

1. **Permissioned Token (ERC-20 Compatible)**

   - Functions like ERC-20 but adds compliance/KYC checks before transfers.
   - Includes bulk transfers, forced transfers, freezing/pausing.

2. **Identity Registry (IR) + Storage (IRS)**

   - Maps wallet addresses to ONCHAINID (decentralized identity).
   - Verifies if sender/receiver is qualified via claims and trusted issuers.

3. **ONCHAINID (Identity Contract)**

   - Stores keys, permissions, and claims (KYC, AML, accredited investor).
   - Claims are signed by trusted issuers and validated on-chain.

4. **Trusted Issuers Registry (TIR)**

   - Manages which issuers can grant claims for specific topics.

5. **Claim Topics Registry (CTR)**

   - Stores required claim topics (e.g., KYC+AML, residency, accreditation).

6. **Modular Compliance Contract**

   - Gatekeeper enforcing rules like country restrictions, holding limits, transfer limits.

7. **Factory (Deployment Suite)**
   - Deploys Token + IR/IRS + CTR + TIR + Compliance in one transaction.

### 2-4. ERC-3643 Token Issuance

![Architecture1_eng](/Advanced-Resources/RWA/Images/Architecture1_eng.png)

Steps:

1. Issuer requests token creation via Factory.
2. Factory deploys Token, IR/IRS, CTR, TIR, Compliance.
3. Register identities in IR.
4. Define required claims in CTR.
5. Register trusted issuers in TIR.
6. Configure compliance modules.
7. Launch Permissioned Token.

### 2-4. ERC-3643 Token Transfer

![Architecture2_eng](/Advanced-Resources/RWA/Images/Architecture2_eng.png)

1. **Transfer Request**

   - Investor calls `transfer`/`transferFrom`.

2. **Identity Verification**

   - IR checks `isVerified(address)` against CTR/TIR.
   - Confirms claims via ONCHAINID (KYC/AML).

3. **Compliance Verification**

   - Compliance contract calls active modules via `canTransfer()`.
   - Checks residency restrictions, holding limits, etc.

4. **Transfer Execution or Rejection**

---

## 3. RWA Tokenization Process

RWA tokenization is a **multi-disciplinary process**, requiring technical, legal, regulatory, and business considerations.

The process typically takes **6 months to 2 years**, depending on asset complexity.

<details>
<summary>Step 1 - Asset Selection & Evaluation</summary>
<div markdown="1" style="font-size:0.8em">

Select and assess the asset to tokenize. Evaluate feasibility beyond just value.

**Criteria**

- Tokenization suitability (e.g., real estate, art, commodities)
- Regulatory compliance feasibility
- Clear legal ownership
- Objective valuation methods
- Liquidity creation potential

**Due Diligence**

1. Legal review
2. Financial review
3. Operational review
4. Regulatory review

The key is **early identification of unsuitable assets**.

</div>
</details>

<details>
<summary>Step 2 - Legal Structuring</summary>
<div markdown="1" style="font-size:0.8em">

Design the legal framework to give tokens valid claims over the asset.

**Rights Tokenized**

- Ownership
- Income rights
- Voting rights
- Usage rights

**Structures**

1. **SPV Tokenization (Indirect)**

   - Common approach: entity (SPV/trust) holds the asset, and tokens represent its shares.
   - Fits well with securities regulation.

2. **Direct Tokenization**
   - Token directly represents claim over asset.
   - Less common due to regulatory complexity and limited use cases.

</div>
</details>

<details>
<summary>Step 3 - Custody of Assets & Tokens</summary>
<div markdown="1" style="font-size:0.8em">

Before tokenization, assets must be securely custodied.

**Options**

- **Self-Custody:** User fully controls private keys.
- **Licensed Custodian:** Regulated, insured, uses advanced security (e.g., MPC, multisig).

</div>
</details>

<details>
<summary>Step 4 - Token Issuance</summary>
<div markdown="1" style="font-size:0.8em">

Convert asset ownership into tokens, issued via blockchain.

**Process**

- Select blockchain
- Choose token standard (e.g., ERC-3643)
- Develop smart contracts
- Security audit
- Testnet deployment
- Mainnet launch

</div>
</details>

<details>
<summary>Step 5 - Primary Token Offering</summary>
<div markdown="1" style="font-size:0.8em">

The first issuance (similar to IPO/ICO).

- Raise capital directly from investors
- Access global investor base
- Ensure securities compliance
- Provide transparency

</div>
</details>

<details>
<summary>Step 6 - Secondary Trading (Ongoing)</summary>
<div markdown="1" style="font-size:0.8em">

After issuance, RWA tokens can trade on:

- Licensed broker-dealer platforms
- Licensed RWA exchanges
- Decentralized exchanges (DEXs)

Provides liquidity, unlike traditional long lock-up funds.

</div>
</details>

<details>
<summary>Step 7 - Ongoing Lifecycle Management</summary>
<div markdown="1" style="font-size:0.8em">

Covers compliance, taxation, asset revaluation, corporate actions, investor relations, and audits throughout the token lifecycle.

</div>
</details>

**Source:** [InvestaX - Real World Asset Tokenization Process Explained](https://www.investax.io/blog/real-world-asset-tokenization-process-explained)

---

#### References

- [RWA.xyz](https://app.rwa.xyz/)
- [BCG RWA Report](https://web-assets.bcg.com/1e/a2/5b5f2b7e42dfad2cb3113a291222/on-chain-asset-tokenization.pdf)
- [ERC-3643 Standard](https://eips.ethereum.org/EIPS/eip-3643)
- [Real World Asset Tokenization Process Explained](https://www.investax.io/blog/real-world-asset-tokenization-process-explained)
- [Tiger Research - How MANTRA is Leading the RWA Market Revolution](https://reports.tiger-research.com/p/how-mantra-is-leading-the-rwa-market-eng)
- [Tiger Research - Ethereum’s Dominance in the RWA Market: Who’s Next in Line?](https://reports.tiger-research.com/p/ethereums-dominance-in-the-rwa-market-eng)
- [The T-REX protocol](https://tokeny.com/wp-content/uploads/2023/05/ERC3643-Whitepaper-T-REX-v4.pdf?utm_source=chatgpt.com)
