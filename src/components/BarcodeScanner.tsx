import { useEffect, useRef, useState } from 'react';

interface Props {
  onDetected: (value: string) => void;
  onClose: () => void;
}

const SUPPORTED = typeof window !== 'undefined' && 'BarcodeDetector' in window;

export function BarcodeScanner({ onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [manualValue, setManualValue] = useState('');

  useEffect(() => {
    if (!SUPPORTED) return;

    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();

        // BarcodeDetector is not yet in all TS libs — access via window cast
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detector = new (window as any).BarcodeDetector();

        async function tick() {
          if (cancelled) return;
          if (video.readyState >= 2) {
            const barcodes = await detector.detect(video);
            if (barcodes.length > 0) {
              onDetected(barcodes[0].rawValue as string);
              return;
            }
          }
          rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);
      } catch (e) {
        if (!cancelled) setError('Camera access denied or unavailable.');
      }
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onDetected]);

  function submitManual(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = manualValue.trim();
    if (trimmed) onDetected(trimmed);
  }

  return (
    <div className="scanner-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="scanner-modal">
        <div className="scanner-header">
          <span className="scanner-title">📷 Summon Enemy</span>
          <button className="scanner-close" onClick={onClose}>✕</button>
        </div>

        {SUPPORTED && !error ? (
          <>
            <div className="scanner-viewport">
              <video ref={videoRef} className="scanner-video" playsInline muted />
              <div className="scanner-reticle" />
            </div>
            <p className="scanner-hint">Point at any barcode to summon your enemy</p>
            <div className="scanner-divider"><span>or enter manually</span></div>
          </>
        ) : (
          <p className="scanner-unsupported">
            {error ?? 'Barcode scanning not supported in this browser.'}
          </p>
        )}

        <form className="scanner-manual" onSubmit={submitManual}>
          <input
            className="scanner-input"
            type="text"
            placeholder="Paste barcode value…"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            autoFocus={!SUPPORTED || !!error}
          />
          <button className="btn btn--primary" type="submit" disabled={!manualValue.trim()}>
            Summon
          </button>
        </form>
      </div>
    </div>
  );
}
