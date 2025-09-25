import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import "./InputModal.css";

export default function DebounceHookModal({ open, onClose, defaultDelay = 600 }) {
  const [query, setQuery] = useState("");
  const [delayMs, setDelayMs] = useState(defaultDelay);
  const debouncedQuery = useDebounce(query, delayMs);
  const [output, setOutput] = useState("");

  useEffect(() => {
    setOutput(debouncedQuery || "");
  }, [debouncedQuery]);

  if (!open) return null;

  return (
    <div className="overlayStyle" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="modalStyle" onClick={(e) => e.stopPropagation()}>
        <header className="headerStyle">
          <h2 style={{ margin: 0 }}>Debounce (Hook)</h2>
          <button className="closeBtnStyle" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <label className="labelStyle">
          <span>Type here:</span>
          <input className="inputStyle" autoFocus value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Hook: value updates after delay" />
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
          <div><b>Debounced:</b> <code>{debouncedQuery}</code></div>
        </section>

        <section className="outputRowStyle">
          <span><b>Output (after debounce):</b></span>
          <code>{output}</code>
        </section>
      </div>
    </div>
  );
}
