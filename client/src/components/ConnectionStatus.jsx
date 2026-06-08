import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function ConnectionStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = () => {
      fetch('/api/orders', { signal: AbortSignal.timeout(3000) })
        .then(() => { if (mounted) setOffline(false); })
        .catch(() => { if (mounted) setOffline(true); });
    };
    check();
    const interval = setInterval(check, 15000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  if (!offline) return null;

  return (
    <div className="bg-coral/10 border-b border-coral/20 px-4 py-2 text-center">
      <p className="text-xs text-coral flex items-center justify-center gap-2">
        <WifiOff className="w-3.5 h-3.5" />
        Server tidak terhubung. Jalankan <code className="bg-coral/10 px-1.5 py-0.5 rounded text-[10px] font-mono">npm run dev</code> di folder <strong>laundry-app</strong>
      </p>
    </div>
  );
}
