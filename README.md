# LensCollective 🌿
A Web3 content curation platform built on Lens Protocol where users can collect and organize valuable posts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Open in Gitpod](https://img.shields.io/badge/Open%20in-Gitpod-908A85?logo=gitpod)](https://gitpod.io/#https://github.com/Dafalah01/lenscollective)

## The Story
**Problem:** On traditional social platforms, valuable content gets lost in endless feeds.  
**Solution:** LensCollective filters the noise, showcasing only collectible content from Lens Protocol and turning engagement into on-chain collections.

![App Preview](./public/preview.gif)

## ✨ What It Does
- **Curated Feed**: Only shows posts with collectible content
- **Smart Collections**: Organize saved posts into groups
- **On-Chain Profile**: Your collections become part of your Web3 identity

## ⚙️ How It Works
1. Users connect wallet (ConnectKit)
2. Browse filtered feed of collectible Lens posts
3. Collect posts (stored on-chain)
4. Organize into groups in profile

```mermaid
sequenceDiagram
    User->>+Frontend: Connect Wallet
    Frontend->>+Lens API: Fetch Collectible Posts
    User->>+Smart Contract: Collect Post
    Smart Contract-->>-User: NFT Receipt
```

---

## 🚀 Run It Yourself

### Prerequisites
- Node.js v18+
- MetaMask atau Coinbase Wallet

### Quick Start
```bash
git clone https://github.com/Dafalah01/lenscollective.git
cd lenscollective
npm install
npm run dev
```
