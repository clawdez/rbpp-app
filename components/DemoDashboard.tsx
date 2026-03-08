'use client';

import { useState, useEffect } from 'react';
import { Shield, TrendingUp, FileCheck, AlertTriangle, Clock, CheckCircle2, Car, DollarSign, Bitcoin } from 'lucide-react';

interface PolicyState {
  monthsActive: number;
  monthlyPremium: number;
  totalPaid: number;
  reserveBalance: number; // in sBTC
  reserveValueUSD: number;
  claimsFiled: number;
  discountEarned: number;
  status: 'active' | 'lapsed';
  btcPrice: number;
}

const INITIAL_BTC_PRICE = 92000;

/**
 * Interactive demo dashboard showing how a Premiere Insurance policyholder
 * would experience the RBPP system.
 */
export default function DemoDashboard() {
  const [step, setStep] = useState(0);
  const [policy, setPolicy] = useState<PolicyState>({
    monthsActive: 0,
    monthlyPremium: 200,
    totalPaid: 0,
    reserveBalance: 0,
    reserveValueUSD: 0,
    claimsFiled: 0,
    discountEarned: 0,
    status: 'active',
    btcPrice: INITIAL_BTC_PRICE,
  });
  const [animating, setAnimating] = useState(false);

  const DEMO_STEPS = [
    {
      title: 'Customer Signs Up',
      description: 'Maria enrolls in Premiere Insurance auto coverage at $200/month. The RBPP system automatically allocates 10% ($20) of each premium to the sBTC reserve.',
      action: 'Enroll Policy',
      effect: () => setPolicy(p => ({
        ...p,
        monthsActive: 1,
        totalPaid: 200,
        reserveBalance: 20 / INITIAL_BTC_PRICE,
        reserveValueUSD: 20,
      })),
    },
    {
      title: '6 Months — No Claims',
      description: 'Maria drives safely for 6 months. Each month, $20 goes to the sBTC reserve. Meanwhile, Bitcoin appreciates from $92K to $98K.',
      action: 'Fast Forward 6 Months',
      effect: () => {
        const newBtcPrice = 98000;
        const totalReserve = 120 / ((INITIAL_BTC_PRICE + newBtcPrice) / 2); // DCA average
        setPolicy(p => ({
          ...p,
          monthsActive: 6,
          totalPaid: 1200,
          reserveBalance: totalReserve,
          reserveValueUSD: totalReserve * newBtcPrice,
          btcPrice: newBtcPrice,
        }));
      },
    },
    {
      title: '12 Months — Reserve Grows',
      description: 'After a full year, Maria has $240 in reserve deposits. BTC has risen to $105K. Her reserve is now worth $278 — a 15.8% appreciation. She qualifies for a discount.',
      action: 'Complete Year 1',
      effect: () => {
        const newBtcPrice = 105000;
        const totalReserveBTC = 240 / 96000; // ~DCA average over the year
        const reserveValue = totalReserveBTC * newBtcPrice;
        const appreciation = reserveValue - 240;
        const discount = Math.min(appreciation * 0.5, 2400 * 0.5); // 50% cap
        setPolicy(p => ({
          ...p,
          monthsActive: 12,
          totalPaid: 2400,
          reserveBalance: totalReserveBTC,
          reserveValueUSD: reserveValue,
          btcPrice: newBtcPrice,
          discountEarned: discount,
        }));
      },
    },
    {
      title: 'Discount Applied',
      description: `Maria's claim-free status plus reserve appreciation earns her a premium discount. Her effective annual cost drops significantly — she saved money by driving safe AND by Bitcoin going up.`,
      action: 'Apply Discount',
      effect: () => {
        setPolicy(p => ({
          ...p,
          discountEarned: Math.min((p.reserveValueUSD - 240) * 0.5, p.totalPaid * 0.5),
        }));
      },
    },
  ];

  const handleStep = () => {
    if (step >= DEMO_STEPS.length) return;
    setAnimating(true);
    DEMO_STEPS[step].effect();
    setTimeout(() => {
      setAnimating(false);
      setStep(s => s + 1);
    }, 600);
  };

  const resetDemo = () => {
    setStep(0);
    setPolicy({
      monthsActive: 0,
      monthlyPremium: 200,
      totalPaid: 0,
      reserveBalance: 0,
      reserveValueUSD: 0,
      claimsFiled: 0,
      discountEarned: 0,
      status: 'active',
      btcPrice: INITIAL_BTC_PRICE,
    });
  };

  const effectiveCost = policy.totalPaid - policy.discountEarned;
  const savingsPct = policy.totalPaid > 0 ? (policy.discountEarned / policy.totalPaid) * 100 : 0;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-[#30363d]">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f7931a]/10 text-[#f7931a] text-xs font-semibold mb-4">
          <Car className="w-3.5 h-3.5" /> Interactive Demo
        </div>
        <h2 className="text-3xl font-bold mb-3">See RBPP in Action</h2>
        <p className="text-[#8b949e] max-w-lg mx-auto">
          Walk through how a Premiere Insurance customer benefits from the Bitcoin-backed reserve system.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left: Story / Steps */}
        <div className="md:col-span-2 space-y-4">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {DEMO_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < step ? 'bg-[#f7931a]' : i === step ? 'bg-[#f7931a]/50' : 'bg-[#30363d]'
                }`}
              />
            ))}
          </div>

          {step < DEMO_STEPS.length ? (
            <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
              <div className="text-xs text-[#f7931a] font-mono mb-2">Step {step + 1} of {DEMO_STEPS.length}</div>
              <h3 className="text-lg font-semibold mb-3">{DEMO_STEPS[step].title}</h3>
              <p className="text-sm text-[#8b949e] leading-relaxed mb-6">{DEMO_STEPS[step].description}</p>
              <button
                onClick={handleStep}
                disabled={animating}
                className="w-full px-4 py-3 bg-[#f7931a] text-black font-semibold rounded-lg hover:bg-[#f7931a]/90 transition-colors disabled:opacity-50"
              >
                {animating ? 'Processing...' : DEMO_STEPS[step].action}
              </button>
            </div>
          ) : (
            <div className="bg-[#161b22] rounded-xl border border-[#22c55e]/50 p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#22c55e] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Demo Complete!</h3>
              <p className="text-sm text-[#8b949e] mb-4">
                Maria saved <span className="text-[#22c55e] font-bold">${policy.discountEarned.toFixed(0)}</span> on her insurance — 
                a <span className="text-[#22c55e] font-bold">{savingsPct.toFixed(1)}%</span> reduction — 
                just by driving safe while Bitcoin appreciated.
              </p>
              <button
                onClick={resetDemo}
                className="px-4 py-2 border border-[#30363d] text-sm rounded-lg hover:border-[#f7931a] transition-colors"
              >
                Restart Demo
              </button>
            </div>
          )}

          {/* Premiere Integration Note */}
          <div className="bg-[#0d1117] rounded-xl border border-[#30363d] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#f7931a]" />
              <span className="text-xs font-semibold text-[#f7931a]">Premiere Insurance Integration</span>
            </div>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              RBPP integrates directly into Premiere Insurance&apos;s existing billing system. 
              Customers don&apos;t interact with crypto — they just see lower premiums when they 
              qualify. All sBTC operations happen behind the scenes via Clarity smart contracts.
            </p>
          </div>
        </div>

        {/* Right: Live Dashboard */}
        <div className="md:col-span-3 space-y-4">
          {/* Policy Card */}
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#f7931a]" />
                <span className="font-semibold">Policy Dashboard</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                policy.monthsActive > 0 ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#30363d] text-[#8b949e]'
              }`}>
                {policy.monthsActive > 0 ? '● Active' : '○ Not Enrolled'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0d1117] rounded-lg p-3">
                <div className="text-xs text-[#8b949e] mb-1">Months Active</div>
                <div className={`text-2xl font-bold font-mono transition-all duration-500 ${animating ? 'scale-110 text-[#f7931a]' : ''}`}>
                  {policy.monthsActive}
                </div>
              </div>
              <div className="bg-[#0d1117] rounded-lg p-3">
                <div className="text-xs text-[#8b949e] mb-1">Total Premium Paid</div>
                <div className={`text-2xl font-bold font-mono transition-all duration-500 ${animating ? 'scale-110 text-[#f7931a]' : ''}`}>
                  ${policy.totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#0d1117] rounded-lg p-3">
                <div className="text-xs text-[#8b949e] mb-1">Claims Filed</div>
                <div className="text-2xl font-bold font-mono text-[#22c55e]">
                  {policy.claimsFiled}
                  <span className="text-xs ml-1 text-[#8b949e]">✓ clean record</span>
                </div>
              </div>
              <div className="bg-[#0d1117] rounded-lg p-3">
                <div className="text-xs text-[#8b949e] mb-1">Monthly Premium</div>
                <div className="text-2xl font-bold font-mono">
                  ${policy.monthlyPremium}
                </div>
              </div>
            </div>
          </div>

          {/* Reserve Card */}
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bitcoin className="w-5 h-5 text-[#f7931a]" />
              <span className="font-semibold">sBTC Reserve</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0d1117] rounded-lg p-3">
                <div className="text-xs text-[#8b949e] mb-1">Reserve (sBTC)</div>
                <div className={`text-lg font-bold font-mono transition-all duration-500 ${animating ? 'scale-110 text-[#f7931a]' : ''}`}>
                  {policy.reserveBalance.toFixed(6)} ₿
                </div>
              </div>
              <div className="bg-[#0d1117] rounded-lg p-3">
                <div className="text-xs text-[#8b949e] mb-1">Reserve Value</div>
                <div className={`text-lg font-bold font-mono transition-all duration-500 ${
                  policy.reserveValueUSD > (policy.monthsActive * 20) ? 'text-[#22c55e]' : ''
                }`}>
                  ${policy.reserveValueUSD.toFixed(0)}
                </div>
              </div>
              <div className="bg-[#0d1117] rounded-lg p-3">
                <div className="text-xs text-[#8b949e] mb-1">BTC Price</div>
                <div className="text-lg font-bold font-mono">
                  ${policy.btcPrice.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Appreciation bar */}
            {policy.reserveValueUSD > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                  <span>Reserve Appreciation</span>
                  <span className={policy.reserveValueUSD > (policy.monthsActive * 20) ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                    {(((policy.reserveValueUSD / (policy.monthsActive * 20)) - 1) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-[#0d1117] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f7931a] to-[#22c55e] rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(((policy.reserveValueUSD / Math.max(policy.monthsActive * 20, 1)) * 100), 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Savings Card */}
          {policy.discountEarned > 0 && (
            <div className="bg-gradient-to-r from-[#f7931a]/10 to-[#22c55e]/10 rounded-xl border border-[#f7931a]/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-[#22c55e]" />
                <span className="font-semibold">Your RBPP Savings</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-[#8b949e] mb-1">Discount Earned</div>
                  <div className="text-2xl font-bold text-[#22c55e]">${policy.discountEarned.toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b949e] mb-1">Effective Cost</div>
                  <div className="text-2xl font-bold">${effectiveCost.toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b949e] mb-1">Savings Rate</div>
                  <div className="text-2xl font-bold text-[#f7931a]">{savingsPct.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          )}

          {/* On-Chain Verification */}
          <div className="bg-[#0d1117] rounded-xl border border-[#30363d] p-4 flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-[#f7931a] shrink-0" />
            <div className="text-xs text-[#8b949e]">
              All reserve deposits and discount calculations are executed on-chain via the{' '}
              <code className="text-[#f7931a] bg-[#f7931a]/10 px-1 rounded">rbpp-reserve.clar</code>{' '}
              Clarity smart contract. Anyone can verify the reserve balance and discount eligibility.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
