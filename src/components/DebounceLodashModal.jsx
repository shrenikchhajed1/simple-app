import { useMemo, useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import "./InputModal.css";

/**
 * Debounces the onChange handler (callback style).
 * Demonstrates leading/trailing behavior as well.
 */
export default function DebounceLodashModal({ open, onClose, defaultDelay = 600 }) {
  const [query, setQuery] = useState("");
  const [delayMs, setDelayMs] = useState(defaultDelay);
  const [leading, setLeading] = useState(false);
  const [trailing, setTrailing] = useState(true);
  const [output, setOutput] = useState("");

  // Stable setter for output
  const updateOutput = (val) => setOutput(val);

  // Recreate the debounced function when delay/leading/trailing change
  const debouncedFn = useMemo(() => {
    const fn = debounce((val) => updateOutput(val), delayMs, { leading, trailing });
    return fn;
  }, [delayMs, leading, trailing]);

  // Cleanup on unmount or when options change
  useEffect(() => {
    return () => debouncedFn.cancel();
  }, [debouncedFn]);

  // Call debounced function on each keystroke
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    debouncedFn(val);
  };

  if (!open) return null;

  return (
    <div className="overlayStyle" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="modalStyle" onClick={(e) => e.stopPropagation()}>
        <header className="headerStyle">
          <h2 style={{ margin: 0 }}>Debounce (Lodash)</h2>
          <button className="closeBtnStyle" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <label className="labelStyle">
          <span>Type here:</span>
          <input className="inputStyle" autoFocus value={query}
                 onChange={handleChange}
                 placeholder="Lodash: callback fires debounced" />
        </label>

        <div className="panelStyle">
          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={leading}
                     onChange={(e) => setLeading(e.target.checked)} />
              <span>leading</span>
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={trailing}
                     onChange={(e) => setTrailing(e.target.checked)} />
              <span>trailing</span>
            </label>
          </div>
        </div>

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
          <div><b>Debounced (callback result):</b> <code>{output}</code></div>
        </section>
      </div>
    </div>
  );
}
