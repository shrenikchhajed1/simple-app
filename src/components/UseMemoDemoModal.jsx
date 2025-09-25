import { useMemo, useState } from "react";
import "./InputModal.css";

// super fake expensive calc
function expensiveSquare(n) {
  // simulate heavy work
  let total = 0;
  for (let i = 0; i < 25_000_000; i++) total += i % 7;
  return n * n;
}

export default function UseMemoDemoModal({ open, onClose }) {
  const [num, setNum] = useState(10);
  const [dark, setDark] = useState(false);
  const [computeCount, setComputeCount] = useState(0);

  const squared = useMemo(() => {
    const val = expensiveSquare(num);
    setComputeCount(c => c + 1);
    return val;
  }, [num]); // only recompute when `num` changes

  if (!open) return null;

  return (
    <div className="overlayStyle" aria-modal="true" role="dialog" onClick={onClose}>
      <div
        className="modalStyle"
        onClick={(e) => e.stopPropagation()}
        style={{ background: dark ? "#111827" : "#fefefe", color: dark ? "#e5e7eb" : "#333" }}
      >
        <header className="headerStyle">
          <h2 style={{ margin: 0 }}>useMemo Demo</h2>
          <button className="closeBtnStyle" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <label className="labelStyle">
          <span>Number: {num}</span>
          <input type="range" min={0} max={50} value={num} onChange={(e) => setNum(Number(e.target.value))} />
        </label>

        <div className="panelStyle">
          <div><b>Squared (memoized):</b> <code>{squared}</code></div>
          <div><b>Times computed:</b> <code>{computeCount}</code></div>
          <small>Only changes when <code>num</code> changes.</small>
        </div>

        <div className="panelStyle">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
            <span>Toggle dark theme (does NOT recompute)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
