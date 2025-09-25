import { useEffect, useRef, useState } from "react";
import "./InputModal.css";

/**
 * Manual debounce: manages a timeout ref; only updates output after `delayMs`
 * with the latest typed value.
 */
export default function DebounceInlineModal({ open, onClose, defaultDelay = 600 }) {
  const [query, setQuery] = useState("");
  const [delayMs, setDelayMs] = useState(defaultDelay);
  const [output, setOutput] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current); // cleanup on unmount
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOutput(val);
    }, delayMs);
  };

  if (!open) return null;

  return (
    <div className="overlayStyle" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="modalStyle" onClick={(e) => e.stopPropagation()}>
        <header className="headerStyle">
          <h2 style={{ margin: 0 }}>Debounce (Inline)</h2>
          <button className="closeBtnStyle" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <label className="labelStyle">
          <span>Type here:</span>
          <input className="inputStyle" autoFocus value={query}
                 onChange={handleChange}
                 placeholder="Inline: custom setTimeout debounce" />
        </label>

        <label className="labelStyle">
          <span>Delay (ms):</span>
          <div style={{ display: "grid", gap: 8 }}>
            <input type="range" min={100} max={2000} step={50}
                   value={delayMs} onChange={(e) => setDelayMs(Number(e.target.value))}/>
            <code>{delayMs} ms</code>
          </div>
        </label>

        <section className="panelStyle">
          <div><b>Live:</b> <code>{query}</code></div>
          <div><b>Debounced (timeout):</b> <code>{output}</code></div>
        </section>
      </div>
    </div>
  );
}
