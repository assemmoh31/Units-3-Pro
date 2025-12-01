import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  layoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ 
  slot, 
  format = 'auto', 
  layoutKey,
  style = { display: 'block' },
  className = ''
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode or fast re-renders
    if (initialized.current) return;
    
    // Check if script is loaded and if the element exists
    if (adRef.current && !adRef.current.getAttribute('data-adsbygoogle-status')) {
      try {
        initialized.current = true;
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div className={`ad-container my-4 text-center overflow-hidden ${className}`} aria-hidden={false}>
      <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1 block">Advertisement</span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-2239313494905583"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      />
    </div>
  );
};

export default AdUnit;