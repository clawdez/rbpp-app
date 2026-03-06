'use client';

import { useState, useMemo } from 'react';
import { runSimulation, SCENARIOS, type SimulationParams } from '@/lib/simulation';
import { Shield, TrendingUp, TrendingDown, Bitcoin, Wallet, ChevronRight, Zap, BarChart3, Users, Lock } from 'lucide-react';

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
function formatBTC(n: number) {
  return n.toFixed(6) + ' ₿';
}
function formatPct(n: number) {
  return (n >= 0 ? '+' : '') + n.toFixed(1) + '%';
}

export default function Home() {
  const [params, setParams] = useState<SimulationParams>({
    monthlyPremium: 200,
    reserveRatio: 10,
    months: 24,
    startIndex: 0,
    claimFree: true,
    discountCapPct: 50,
  });
  const [activeScenario, setActiveScenario] = useState<string>('fullCycle');
  const [showSim, setShowSim] = useState(false);

  const simulation = useMemo(() => runSimulation(params), [params]);

  const handleScenario = (key: string) => {
    const scenario = SCENARIOS[key as keyof typeof SCENARIOS];
    setActiveScenario(key);
    setParams(p => ({
      ...p,
      startIndex: scenario.params.startIndex,
      months: scenario.params.months,
    }));
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7931a]/10 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#f7931a]/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#f7931a]" />
            </div>
            <span className="text-sm font-mono text-[#8b949e] tracking-wider uppercase">Reverse Bitcoin-Backed Premium Policy</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Your insurance premiums<br />
            <span className="text-[#f7931a]">backed by Bitcoin.</span>
          </h1>
          <p className="text-xl text-[#8b949e] max-w-2xl mb-8">
            10% of every premium goes into an sBTC reserve on Stacks. 
            Drive safe, file no claims — earn discounts from Bitcoin&apos;s appreciation.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSim(true)}
              className="px-6 py-3 bg-[#f7931a] text-black font-semibold rounded-lg hover:bg-[#f7931a]/90 transition-colors flex items-center gap-2"
            >
              Run Simulation <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="px-6 py-3 border border-[#30363d] text-[#f0f6fc] font-semibold rounded-lg hover:border-[#f7931a]/50 transition-colors"
            >
              How It Works
            </a>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-y border-[#30363d] bg-[#0d1117]">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard icon={<Bitcoin className="w-5 h-5" />} label="Reserve Asset" value="sBTC" sub="1:1 Bitcoin peg" />
          <StatCard icon={<Lock className="w-5 h-5" />} label="Smart Contract" value="Clarity" sub="Decidable & secure" />
          <StatCard icon={<Zap className="w-5 h-5" />} label="Settlement" value="Bitcoin L1" sub="100% finality" />
          <StatCard icon={<Users className="w-5 h-5" />} label="Reserve Ratio" value="10%" sub="Of every premium" />
        </div>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">How RBPP Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard
            step={1}
            title="Pay Premium"
            desc="90% goes to the operating pool for claims. 10% is converted to sBTC and deposited into the on-chain reserve."
            icon={<Wallet className="w-6 h-6 text-[#f7931a]" />}
          />
          <StepCard
            step={2}
            title="Reserve Grows"
            desc="The sBTC reserve appreciates with Bitcoin. All holdings are transparent on-chain — anyone can verify the reserve balance."
            icon={<TrendingUp className="w-6 h-6 text-[#22c55e]" />}
          />
          <StepCard
            step={3}
            title="Earn Discounts"
            desc="Claim-free policyholders earn premium discounts proportional to reserve appreciation. Drive safe = save more."
            icon={<BarChart3 className="w-6 h-6 text-[#f7931a]" />}
          />
        </div>
      </section>

      {/* Simulation Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#30363d]">
        <h2 className="text-3xl font-bold mb-2">Backtest Simulator</h2>
        <p className="text-[#8b949e] mb-8">See how the RBPP reserve would have performed using real Bitcoin price data.</p>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
            <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4">Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#8b949e] block mb-1">Monthly Premium</label>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={params.monthlyPremium}
                  onChange={(e) => setParams(p => ({ ...p, monthlyPremium: Number(e.target.value) }))}
                  className="w-full accent-[#f7931a]"
                />
                <div className="text-right text-sm font-mono">{formatUSD(params.monthlyPremium)}/mo</div>
              </div>
              <div>
                <label className="text-sm text-[#8b949e] block mb-1">Reserve Ratio</label>
                <input
                  type="range"
                  min={5}
                  max={25}
                  step={1}
                  value={params.reserveRatio}
                  onChange={(e) => setParams(p => ({ ...p, reserveRatio: Number(e.target.value) }))}
                  className="w-full accent-[#f7931a]"
                />
                <div className="text-right text-sm font-mono">{params.reserveRatio}%</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-[#8b949e]">Claim-Free Driver</label>
                <button
                  onClick={() => setParams(p => ({ ...p, claimFree: !p.claimFree }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${params.claimFree ? 'bg-[#22c55e]' : 'bg-[#30363d]'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${params.claimFree ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
            <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4">Scenario</h3>
            <div className="space-y-2">
              {Object.entries(SCENARIOS).map(([key, scenario]) => (
                <button
                  key={key}
                  onClick={() => handleScenario(key)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    activeScenario === key
                      ? 'border-[#f7931a] bg-[#f7931a]/10'
                      : 'border-[#30363d] hover:border-[#8b949e]'
                  }`}
                >
                  <div className="font-medium text-sm">{scenario.label}</div>
                  <div className="text-xs text-[#8b949e]">{scenario.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <ResultCard
            label="Total Premium Paid"
            value={formatUSD(simulation.summary.totalPremiumPaid)}
          />
          <ResultCard
            label="Reserve Value"
            value={formatUSD(simulation.summary.finalReserveValueUSD)}
            sub={formatBTC(simulation.summary.totalReserveBTC)}
            positive={simulation.summary.appreciationPct > 0}
          />
          <ResultCard
            label="Reserve Appreciation"
            value={formatPct(simulation.summary.appreciationPct)}
            positive={simulation.summary.appreciationPct > 0}
          />
          <ResultCard
            label={params.claimFree ? 'Your Savings' : 'Savings (claim-free only)'}
            value={params.claimFree ? formatPct(simulation.summary.savingsPct) : 'N/A'}
            sub={params.claimFree ? formatUSD(simulation.summary.discountEarned) + ' saved' : 'File no claims to qualify'}
            positive={simulation.summary.savingsPct > 0}
            highlight
          />
        </div>

        {/* Monthly Breakdown Table */}
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
          <div className="p-4 border-b border-[#30363d]">
            <h3 className="font-semibold">Monthly Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#8b949e] text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">BTC Price</th>
                  <th className="text-right px-4 py-3">To Reserve</th>
                  <th className="text-right px-4 py-3">Reserve Value</th>
                  <th className="text-right px-4 py-3">Appreciation</th>
                  {params.claimFree && <th className="text-right px-4 py-3">Savings</th>}
                </tr>
              </thead>
              <tbody>
                {simulation.months.map((m, i) => (
                  <tr key={i} className="border-t border-[#30363d]/50 hover:bg-[#0d1117]">
                    <td className="px-4 py-2 font-mono text-xs">{m.date}</td>
                    <td className="px-4 py-2 text-right font-mono">{formatUSD(m.btcPrice)}</td>
                    <td className="px-4 py-2 text-right font-mono">{formatUSD(m.toReserve)}</td>
                    <td className="px-4 py-2 text-right font-mono">{formatUSD(m.reserveValueUSD)}</td>
                    <td className={`px-4 py-2 text-right font-mono ${m.appreciationPct >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      {formatPct(m.appreciationPct)}
                    </td>
                    {params.claimFree && (
                      <td className="px-4 py-2 text-right font-mono text-[#f7931a]">
                        {m.savingsPct > 0 ? formatPct(m.savingsPct) : '—'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#30363d]">
        <h2 className="text-3xl font-bold mb-8 text-center">Built on Bitcoin</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <TechCard
            title="sBTC Reserve"
            desc="Insurance reserves held in sBTC — a 1:1 Bitcoin-pegged SIP-010 token. Fully transparent on-chain."
            badge="Stacks"
          />
          <TechCard
            title="Clarity Contracts"
            desc="Decidable, interpreted smart contracts. No reentrancy, no overflow bugs. What you see is what executes."
            badge="Clarity"
          />
          <TechCard
            title="Bitcoin Finality"
            desc="All transactions settle on Bitcoin L1 with 100% finality. The most secure settlement layer."
            badge="Bitcoin"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#30363d] py-8">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-sm text-[#8b949e]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#f7931a]" />
            <span>RBPP — Stacks BUIDL BATTLE #2</span>
          </div>
          <div>Built by Premiere Insurance × EZ Designs</div>
        </div>
      </footer>
    </main>
  );
}

// ── Components ──

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[#f7931a]/10 flex items-center justify-center text-[#f7931a]">
        {icon}
      </div>
      <div>
        <div className="text-xs text-[#8b949e]">{label}</div>
        <div className="font-bold">{value}</div>
        <div className="text-xs text-[#8b949e]">{sub}</div>
      </div>
    </div>
  );
}

function StepCard({ step, title, desc, icon }: { step: number; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 relative">
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#f7931a] text-black font-bold text-sm flex items-center justify-center">
        {step}
      </div>
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-[#8b949e] leading-relaxed">{desc}</p>
    </div>
  );
}

function ResultCard({ label, value, sub, positive, highlight }: { label: string; value: string; sub?: string; positive?: boolean; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'border-[#f7931a] bg-[#f7931a]/5' : 'border-[#30363d] bg-[#161b22]'}`}>
      <div className="text-xs text-[#8b949e] mb-1">{label}</div>
      <div className={`text-2xl font-bold ${positive === true ? 'text-[#22c55e]' : positive === false ? 'text-[#ef4444]' : ''}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-[#8b949e] mt-1">{sub}</div>}
    </div>
  );
}

function TechCard({ title, desc, badge }: { title: string; desc: string; badge: string }) {
  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
      <div className="inline-block px-2 py-0.5 bg-[#f7931a]/10 text-[#f7931a] text-xs font-mono rounded mb-3">{badge}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[#8b949e] leading-relaxed">{desc}</p>
    </div>
  );
}
