export function SignalWordmark({ className = '' }: { className?: string }) {
  return (
    <div className={'signal-wordmark ' + className} aria-label="GH Creative">
      <span className="signal-wordmark__echo" aria-hidden="true">
        GH CREATIVE
      </span>
      <span className="signal-wordmark__solid" aria-hidden="true">
        GH CREATIVE
      </span>
      <span className="signal-wordmark__echo" aria-hidden="true">
        GH CREATIVE
      </span>
    </div>
  );
}
