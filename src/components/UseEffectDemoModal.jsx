import { useEffect, useState } from "react";
import "./InputModal.css";

export default function UseEffectDemoModal({ open, onClose }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  // 1) Run after every render where `count` changed: syncs document title
  useEffect(() => {
    const prev = document.title;
    document.title = `Count: ${count}`;
    return () => {
      // restore on unmount or before next run
      document.title = prev;
    };
  }, [count]);

  // 2) Subscribe to window resize ONCE; cleanup the listener on unmount
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []); // empty deps → run once

  // 3) React to a specific value changing
  const [nameEcho, setNameEcho] = useState("");
  useEffect(() => {
    setNameEcho(name.trim());
  }, [name]);

  if (!open) return null;

  return (
    <div className="overlayStyle" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="modalStyle" onClick={(e) => e.stopPropagation()}>
        <header className="headerStyle">
          <h2 style={{ margin: 0 }}>useEffect Demo</h2>
          <button className="closeBtnStyle" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <section className="panelStyle">
          <b>Document title effect (depends on <code>count</code>)</b>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="card" onClick={() => setCount(c => c + 1)}>+1</button>
            <code>count = {count}</code>
          </div>
          <small>Check the browser tab title updating.</small>
        </section>

        <section className="panelStyle">
          <b>Resize subscription (mount/unmount cleanup)</b>
          <div><code>{size.w} × {size.h}</code></div>
          <small>Resize the window — effect updates size; listener is cleaned up on unmount.</small>
        </section>

        <section className="panelStyle">
          <b>Effect with dependencies</b>
          <label className="labelStyle">
            <span>Name:</span>
            <input
              className="inputStyle"
              placeholder="Type your name…"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <div><b>Echo:</b> <code>{nameEcho}</code></div>
        </section>
      </div>
    </div>
  );
}
