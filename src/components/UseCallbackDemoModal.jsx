import { memo, useCallback, useMemo, useState } from "react";
import "./InputModal.css";

const ChildButton = memo(function ChildButton({ onIncrement }) {
  console.log("%cChildButton render", "color: #888");
  return (
    <button className="card" onClick={onIncrement}>Increment from child</button>
  );
});

export default function UseCallbackDemoModal({ open, onClose }) {
  const [count, setCount] = useState(0);
  const [dark, setDark] = useState(false);

  // Without useCallback: new function each render → ChildButton re-renders.
  // With useCallback: stable reference unless dependencies change.
  const handleIncrement = useCallback(() => {
    setCount(c => c + 1);
  }, []); // no deps → stable for lifetime

  const themeStyle = useMemo(
    () => ({
      background: dark ? "#0b1220" : "#fefefe",
      color: dark ? "#e5e7eb" : "#333",
    }),
    [dark]
  );

  if (!open) return null;

  return (
    <div className="overlayStyle" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="modalStyle" onClick={(e) => e.stopPropagation()} style={themeStyle}>
        <header className="headerStyle">
          <h2 style={{ margin: 0 }}>useCallback Demo</h2>
          <button className="closeBtnStyle" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="panelStyle">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="card" onClick={() => setCount(c => c + 1)}>+1 (parent)</button>
            <ChildButton onIncrement={handleIncrement} />
          </div>
          <div><b>Count:</b> <code>{count}</code></div>
          <small>Open DevTools console to see when <code>ChildButton</code> renders.</small>
        </div>

        <div className="panelStyle">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
            <span>Toggle theme (child should NOT re-render)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
