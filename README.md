# Jeepney Driver Cooperative Wallet (JeepneyCoop)

A decentralized mutual aid and savings platform for Jeepney drivers built on Stellar/Soroban.

## Problem
Jeepney drivers in the Philippines often face financial instability due to fixed daily boundaries, high maintenance costs, and a lack of social safety nets. Slow days or health emergencies can be devastating.

## Solution
JeepneyCoop allows drivers to pool their daily earnings into a transparent, smart-contract-governed fund.
- **Pooling:** Drivers contribute a small daily amount.
- **Insurance:** The pool acts as a buffer for slow days or emergencies.
- **Governance:** Transparent request and approval process (can be expanded to full DAO voting).

## Technical Stack
- **Backend:** Soroban Smart Contracts (Rust)
- **Frontend:** Next.js, Tailwind CSS, Stellar SDK
- **Wallet:** Freighter

## Project Structure
- `/contracts`: Soroban smart contract source code and tests.
- `/frontend`: Next.js web application.
- `/frontend/src/contracts/coop_pool`: Generated TypeScript bindings for the smart contract.

## Getting Started

### Backend (Smart Contract)
1. Navigate to `/contracts`.
2. Run tests: `cargo test`.
3. Build contract: `stellar contract build`.

### Frontend
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Run development server: `npm run dev`.
4. Connect your Freighter wallet (ensure it's on Testnet).

## Future Roadmap
- [ ] Implement full DAO voting for payout approvals.
- [ ] Add yield-generating mechanisms for the pool (e.g., lending on-chain).
- [ ] Mobile app for easier access by drivers on the road.
