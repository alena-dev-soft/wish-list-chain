# Getting Started with WishList Chain

> WishList Chain runs on **Ethereum Sepolia Testnet** — a sandbox blockchain that works exactly like Ethereum mainnet, but uses test tokens with no real value. Perfect for trying out the app risk-free.

---

## Step 1 — Install MetaMask

1. Go to [metamask.io](https://metamask.io) and install the browser extension (Chrome, Firefox, or Brave)
2. Create a new wallet and **save your Secret Recovery Phrase** somewhere safe — never share it with anyone
3. Set a strong password

---

## Step 2 — Add Sepolia Testnet to MetaMask

By default MetaMask shows Ethereum Mainnet. You need to enable Sepolia:

1. Open MetaMask → click the **network selector** at the top (says "Ethereum Mainnet")
2. Click **"Show test networks"** toggle if testnets are hidden
   - Go to **Settings** → **Advanced** → enable **"Show test networks"**
3. Select **"Sepolia"** from the network list

> ✅ You should now see **"Sepolia"** in the top bar and a balance of **0 SepoliaETH**

---

## Step 3 — Get Free Sepolia ETH

You need test ETH to pay for gas (transaction fees). It's free — use any of these faucets:

### Option A — Google Cloud Faucet (recommended, no mainnet ETH required)
1. Go to [cloud.google.com/application/web3/faucet/ethereum/sepolia](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
2. Sign in with your Google account
3. Paste your wallet address (copy it from MetaMask)
4. Click **"Request ETH"**
5. Wait ~30 seconds — you'll receive **0.03 SepoliaETH**

### Option B — Alchemy Faucet
1. Go to [sepoliafaucet.com](https://sepoliafaucet.com)
2. Sign in with your Alchemy account (free registration)
3. Paste your wallet address
4. Receive **0.03 SepoliaETH** per day

### Option C — Chainlink Faucet (also gives testnet LINK)
1. Go to [faucets.chain.link](https://faucets.chain.link/sepolia)
2. Connect your wallet
3. Receive **0.1 SepoliaETH** + testnet LINK

> ⚠️ **Never** connect your wallet or sign a transaction on a faucet site — legitimate faucets only need your **public address** (starts with `0x...`), never your private key or seed phrase.

---

## Step 4 — Use WishList Chain

1. Go to [wish-list-chain.vercel.app](https://wish-list-chain.vercel.app)
2. Click **"Connect Wallet"**
3. Select **MetaMask** from the list
4. Approve the connection in the MetaMask popup
5. Make sure MetaMask is on **Sepolia** network — the app will show your balance

### Create a Goal
1. Enter a name for your dream (e.g. "New Laptop")
2. Enter a target amount in ETH (e.g. `0.01`)
3. Click **"Create Goal"**
4. Confirm the transaction in MetaMask
5. Wait ~15 seconds for the transaction to be confirmed on-chain

### Donate to a Goal
1. Find a goal in the list
2. Click **"💜 Donate"**
3. Enter an amount (e.g. `0.001`)
4. Click **"Send"**
5. Confirm in MetaMask

After a successful donation:
- The goal progress bar updates
- **Global DreamPower** increases
- The goal owner receives a **Telegram notification** with an AI-generated comment 🤖

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Connect Wallet" doesn't work | Make sure MetaMask extension is installed and unlocked |
| Transaction fails | Check you have enough SepoliaETH for gas (~0.001 ETH per transaction) |
| Wrong network warning | Switch MetaMask to **Sepolia** network |
| Goals not showing | Refresh the page after your transaction is confirmed |
| Faucet says "already claimed" | Wait 24 hours or try a different faucet |

---

## What is Sepolia Testnet?

Sepolia is Ethereum's official test network. It behaves exactly like Ethereum mainnet but:

- 🆓 All tokens are **free and have no real value**
- 🔒 Your mainnet ETH and assets are **completely safe**
- ⚡ Great for learning Web3 without financial risk

When WishList Chain launches on mainnet, real ETH will be used. For now — enjoy testing for free!

---

*Built with ❤️ — [GitHub](https://github.com/alena-dev-soft/wish-list-chain)*
