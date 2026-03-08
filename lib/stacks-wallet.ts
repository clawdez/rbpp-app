// Stacks wallet connection - client-side only

let showConnectFn: any = null;
let UserSessionClass: any = null;
let AppConfigClass: any = null;
let session: any = null;

async function init() {
  if (session) return;
  if (typeof window === 'undefined') return;
  
  const mod = await import('@stacks/connect');
  showConnectFn = mod.showConnect;
  UserSessionClass = mod.UserSession;
  AppConfigClass = mod.AppConfig;
  
  const appConfig = new AppConfigClass(['store_write', 'publish_data']);
  session = new UserSessionClass({ appConfig });
}

export async function connectWallet(onFinish?: () => void) {
  await init();
  if (!showConnectFn) return;
  
  showConnectFn({
    appDetails: {
      name: 'RBPP - Reverse Bitcoin-Backed Premium',
      icon: '/favicon.ico',
    },
    onFinish: () => {
      if (onFinish) onFinish();
      window.location.reload();
    },
    userSession: session,
  });
}

export async function disconnectWallet() {
  await init();
  if (!session) return;
  session.signUserOut();
  window.location.reload();
}

export async function isConnected(): Promise<boolean> {
  await init();
  if (!session) return false;
  return session.isUserSignedIn();
}

export async function getAddress(): Promise<string | null> {
  await init();
  if (!session || !session.isUserSignedIn()) return null;
  const userData = session.loadUserData();
  return userData.profile.stxAddress?.testnet || userData.profile.stxAddress?.mainnet || null;
}

export async function getShortAddress(): Promise<string | null> {
  const addr = await getAddress();
  if (!addr) return null;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
