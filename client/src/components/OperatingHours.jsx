import { useState, useEffect } from 'react';

function checkOpen() {
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours();
  const m = now.getMinutes();
  const t = h + m / 60;

  if (day === 0) return t >= 9 && t < 17;
  if (day >= 1 && day <= 6) return t >= 8 && t < 20;
  return false;
}

export default function OperatingHours() {
  const [open, setOpen] = useState(checkOpen);

  useEffect(() => {
    const interval = setInterval(() => setOpen(checkOpen()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className={`relative w-2.5 h-2.5 rounded-full ${open ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      <span className={`text-sm font-medium ${open ? 'text-green-600' : 'text-red-500'}`}>
        {open ? 'Buka Sekarang' : 'Tutup'}
      </span>
    </div>
  );
}
