/**
 * RBPP Simulation Engine
 * 
 * Backtests the Bitcoin-backed reserve model against historical BTC prices.
 * Shows how claim-free policyholders would have benefited from reserve appreciation.
 */

// Historical BTC monthly close prices (USD) — 2020-2025 sampling
export const BTC_HISTORICAL: { date: string; price: number }[] = [
  { date: '2020-01', price: 9350 },
  { date: '2020-04', price: 8624 },
  { date: '2020-07', price: 11351 },
  { date: '2020-10', price: 13804 },
  { date: '2021-01', price: 33141 },
  { date: '2021-04', price: 57750 },
  { date: '2021-07', price: 41461 },
  { date: '2021-10', price: 61318 },
  { date: '2022-01', price: 38483 },
  { date: '2022-04', price: 37644 },
  { date: '2022-07', price: 23296 },
  { date: '2022-10', price: 20495 },
  { date: '2023-01', price: 23139 },
  { date: '2023-04', price: 29252 },
  { date: '2023-07', price: 29233 },
  { date: '2023-10', price: 34494 },
  { date: '2024-01', price: 42584 },
  { date: '2024-04', price: 60100 },
  { date: '2024-07', price: 64620 },
  { date: '2024-10', price: 72394 },
  { date: '2025-01', price: 94500 },
  { date: '2025-04', price: 84000 },
  { date: '2025-07', price: 98000 },
  { date: '2025-10', price: 105000 },
  { date: '2026-01', price: 92000 },
];

export interface SimulationParams {
  /** Monthly premium in USD */
  monthlyPremium: number;
  /** Reserve allocation percentage (0-100) */
  reserveRatio: number;
  /** Number of months to simulate */
  months: number;
  /** Starting month index in BTC_HISTORICAL */
  startIndex: number;
  /** Whether the policyholder is claim-free */
  claimFree: boolean;
  /** Discount cap as percentage of total premium paid */
  discountCapPct: number;
}

export interface SimulationMonth {
  date: string;
  btcPrice: number;
  premiumPaid: number;
  toReserve: number;
  toOperating: number;
  reserveValueUSD: number;
  reserveBTC: number;
  totalPremiumPaid: number;
  appreciationPct: number;
  discountEarned: number;
  effectivePremium: number;
  savingsPct: number;
}

export interface SimulationResult {
  months: SimulationMonth[];
  summary: {
    totalPremiumPaid: number;
    totalToReserve: number;
    totalToOperating: number;
    finalReserveValueUSD: number;
    totalReserveBTC: number;
    totalAppreciation: number;
    appreciationPct: number;
    discountEarned: number;
    effectiveTotalPremium: number;
    savingsPct: number;
    worstDrawdownPct: number;
    bestAppreciationPct: number;
  };
}

export function runSimulation(params: SimulationParams): SimulationResult {
  const {
    monthlyPremium,
    reserveRatio,
    months,
    startIndex,
    claimFree,
    discountCapPct,
  } = params;

  const reservePct = reserveRatio / 100;
  const results: SimulationMonth[] = [];
  let totalBTC = 0;
  let totalPremiumPaid = 0;
  let totalToReserve = 0;
  let totalToOperating = 0;
  let initialReserveCostBasis = 0;
  let peakReserveValue = 0;
  let worstDrawdownPct = 0;
  let bestAppreciationPct = 0;

  for (let i = 0; i < months; i++) {
    const priceIdx = Math.min(startIndex + i, BTC_HISTORICAL.length - 1);
    const btcPrice = BTC_HISTORICAL[priceIdx].price;
    const date = BTC_HISTORICAL[priceIdx].date;

    const toReserve = monthlyPremium * reservePct;
    const toOperating = monthlyPremium - toReserve;
    const btcBought = toReserve / btcPrice;

    totalBTC += btcBought;
    totalPremiumPaid += monthlyPremium;
    totalToReserve += toReserve;
    totalToOperating += toOperating;
    initialReserveCostBasis += toReserve;

    const reserveValueUSD = totalBTC * btcPrice;
    const appreciationPct = initialReserveCostBasis > 0
      ? ((reserveValueUSD - initialReserveCostBasis) / initialReserveCostBasis) * 100
      : 0;

    // Track peak and drawdown
    peakReserveValue = Math.max(peakReserveValue, reserveValueUSD);
    if (peakReserveValue > 0) {
      const drawdown = ((peakReserveValue - reserveValueUSD) / peakReserveValue) * 100;
      worstDrawdownPct = Math.max(worstDrawdownPct, drawdown);
    }
    bestAppreciationPct = Math.max(bestAppreciationPct, appreciationPct);

    // Calculate discount for claim-free holders
    let discountEarned = 0;
    if (claimFree && appreciationPct > 0) {
      const rawDiscount = totalPremiumPaid * (appreciationPct / 100);
      const maxDiscount = totalPremiumPaid * (discountCapPct / 100);
      discountEarned = Math.min(rawDiscount, maxDiscount);
    }

    const effectivePremium = totalPremiumPaid - discountEarned;
    const savingsPct = totalPremiumPaid > 0
      ? ((totalPremiumPaid - effectivePremium) / totalPremiumPaid) * 100
      : 0;

    results.push({
      date,
      btcPrice,
      premiumPaid: monthlyPremium,
      toReserve,
      toOperating,
      reserveValueUSD,
      reserveBTC: totalBTC,
      totalPremiumPaid,
      appreciationPct,
      discountEarned,
      effectivePremium,
      savingsPct,
    });
  }

  const lastMonth = results[results.length - 1];

  return {
    months: results,
    summary: {
      totalPremiumPaid,
      totalToReserve,
      totalToOperating,
      finalReserveValueUSD: lastMonth.reserveValueUSD,
      totalReserveBTC: totalBTC,
      totalAppreciation: lastMonth.reserveValueUSD - initialReserveCostBasis,
      appreciationPct: lastMonth.appreciationPct,
      discountEarned: lastMonth.discountEarned,
      effectiveTotalPremium: lastMonth.effectivePremium,
      savingsPct: lastMonth.savingsPct,
      worstDrawdownPct,
      bestAppreciationPct,
    },
  };
}

// Preset scenarios
export const SCENARIOS = {
  bullRun: {
    label: 'Bull Run (2020-2021)',
    params: { startIndex: 0, months: 8 },
    description: 'BTC went from $9K to $61K — massive reserve appreciation',
  },
  bearMarket: {
    label: 'Bear Market (2022)',
    params: { startIndex: 8, months: 5 },
    description: 'BTC dropped from $38K to $20K — worst case scenario',
  },
  recovery: {
    label: 'Recovery (2023-2024)',
    params: { startIndex: 12, months: 8 },
    description: 'BTC recovered from $23K to $72K — steady growth',
  },
  fullCycle: {
    label: 'Full Cycle (2020-2026)',
    params: { startIndex: 0, months: 24 },
    description: 'Complete market cycle — bull, bear, and recovery',
  },
};
