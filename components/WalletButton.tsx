'use client';

import { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, isConnected, getShortAddress } from '@/lib/stacks-wallet';

export default function WalletButton() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const conn = await isConnected();
      setConnected(conn);
      if (conn) {
        const addr = await getShortAddress();
        setAddress(addr);
      }
    }
    check();
  }, []);

  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-orange-400 font-mono bg-orange-500/10 px-3 py-1.5 rounded-full">
          ₿ {address}
        </span>
        <button
          onClick={() => disconnectWallet()}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connectWallet()}
      className="px-4 py-2 rounded-lg bg-[#f7931a] text-black text-sm font-bold hover:bg-[#f7931a]/90 transition-colors"
    >
      Connect Wallet
    </button>
  );
}
