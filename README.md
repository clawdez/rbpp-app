# RBPP — Reverse Bitcoin-Backed Premium Policy

> **Stacks BUIDL BATTLE #2 Submission**

## What is RBPP?

RBPP flips insurance economics on its head. Instead of premiums going to shareholders, a portion of every premium is allocated to an **sBTC reserve pool**. When Bitcoin appreciates, claim-free policyholders earn **premium discounts** — aligning insurer and policyholder incentives for the first time.

**The Problem:** Traditional insurance creates perverse incentives. Insurers profit when claims are denied. Policyholders feel punished for being claim-free.

**The Solution:** RBPP creates a shared upside. Premium reserves are held in sBTC. If BTC goes up, claim-free policyholders get discounts on future premiums. Everyone wins when claims stay low.

## How It Works

```
Policyholder pays premium (e.g., $1,000)
         ↓
    ┌────────────────┐
    │  Split by ratio │
    │  (default 10%)  │
    └────────────────┘
    ↓                ↓
Reserve Pool     Operating Pool
(10% in sBTC)    (90% for claims)
    ↓
BTC appreciates?
    ↓
Claim-free policyholders
earn premium discounts
(up to 50% of premium paid)
```

## Key Features

- **sBTC Reserve Pool** — Premium reserves held in Bitcoin via Stacks
- **Claim-Free Discounts** — Rewarding responsible policyholders with real value
- **Transparent On-Chain** — All reserve balances, claims, and discounts verifiable on Stacks
- **Simulation Engine** — Backtest RBPP against historical BTC prices
- **Admin Controls** — Adjustable reserve ratios, BTC price oracle updates

## Architecture

### Smart Contract (`rbpp-reserve.clar`)
- SIP-010 sBTC integration for premium deposits
- Automatic reserve/operating split (configurable ratio)
- Claim processing from operating pool
- Reserve appreciation calculation in basis points
- Discount allocation for claim-free policyholders
- Admin functions: price oracle, ratio management

### Frontend (`rbpp-app`)
- Landing page explaining the RBPP concept
- Interactive simulation engine with historical BTC data
- Backtest dashboard showing reserve growth over time
- Policy management interface
- Built with Next.js 14, Tailwind CSS

## Testing

```bash
cd rbpp-project
npm install
npm test
```

**24 tests covering:**
- Policyholder management (add/remove/duplicate/auth)
- Premium deposits (split logic, accumulation, validation)
- Claims processing (payout, claim-free status, balance checks)
- Reserve appreciation & discount allocation
- Admin controls (price updates, ratio management)
- Read-only functions (status, lookups)

## Contract Details

| Function | Description |
|----------|-------------|
| `add-policyholder` | Register a new policyholder (admin) |
| `deposit-premium` | Pay premium, auto-split to reserve/operating |
| `file-claim` | Process a claim from operating pool (admin) |
| `withdraw-discount` | Claim-free policyholder withdraws earned discount |
| `allocate-discounts` | Move reserve appreciation to discount pool (admin) |
| `get-reserve-status` | View all pool balances and metrics |
| `calculate-discount` | Preview a policyholder's earned discount |
| `is-claim-free` | Check if a policyholder has zero claims |

## Error Codes

| Code | Constant | Meaning |
|------|----------|---------|
| u100 | ERR_UNAUTHORIZED | Only admin can call this |
| u101 | ERR_NOT_FOUND | Policyholder doesn't exist |
| u102 | ERR_ALREADY_EXISTS | Policyholder already registered |
| u103 | ERR_INSUFFICIENT_BALANCE | Not enough funds in pool |
| u104 | ERR_INVALID_AMOUNT | Zero or out-of-range amount |
| u105 | ERR_HAS_CLAIMS | Policyholder has filed claims (no discount) |
| u106 | ERR_NO_DISCOUNT | No discount available |

## Live Demo

**Frontend:** https://rbpp-app.vercel.app

## Tech Stack

- **Blockchain:** Stacks (Clarity smart contracts)
- **Token:** sBTC (SIP-010)
- **Frontend:** Next.js 14, React, Tailwind CSS
- **Testing:** Clarinet SDK + Vitest
- **Deploy:** Vercel

## Team

Built by EZ Designs / Ferxxo-pa for Stacks BUIDL BATTLE #2

## License

MIT
