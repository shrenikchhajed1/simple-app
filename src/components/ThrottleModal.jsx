import { useState, useEffect } from "react";
import useThrottle from "../hooks/useThrottle";
import "./InputModal.css"; // reuse same styles

export default function ThrottleModal({ open, onClose, defaultDelay = 600 }) {
  const [query, setQuery] = useState("");
  const [delayMs, setDelayMs] = useState(defaultDelay);

  const throttledQuery = useThrottle(query, delayMs);
  const [output, setOutput] = useState("");

  // update output when throttled value changes
  useEffect(() => {
    setOutput(throttledQuery || "");
  }, [throttledQuery]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="overlayStyle"
      onClick={onClose}
    >
      <div className="modalStyle" onClick={(e) => e.stopPropagation()}>
        <header className="headerStyle">
          <h2 style={{ margin: 0 }}>Throttled Input</h2>
          <button onClick={onClose} aria-label="Close" className="closeBtnStyle">
            ✕
          </button>
        </header>

        <label className="labelStyle">
          <span>Type here:</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type and watch throttling…"
            className="inputStyle"
          />
        </label>

        <label className="labelStyle">
          <span>Throttle Interval (ms):</span>
          <div style={{ display: "grid", gap: 8 }}>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
            />
            <code>{delayMs} ms</code>
          </div>
        </label>

        <section className="panelStyle">
          <div>
            <b>Live value:</b> <code>{query}</code>
          </div>
          <div>
            <b>Throttled value:</b> <code>{throttledQuery}</code>
          </div>
        </section>

        <section className="outputRowStyle">
          <span>
            <b>Output (updated every {delayMs}ms at most):</b>
          </span>
          <code>{output}</code>
        </section>
      </div>
    </div>
  );
}
