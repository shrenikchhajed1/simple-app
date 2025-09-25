import { useState } from "react";
import "./App.css";
import CounterCard from "./components/CounterCard";

// Your existing modals…
import DebounceHookModal from "./components/DebounceHookModal";
import DebounceLodashModal from "./components/DebounceLodashModal";
import DebounceInlineModal from "./components/DebounceInlineModal";
import ThrottleModal from "./components/ThrottleModal";

// New explainer modals
import UseEffectDemoModal from "./components/UseEffectDemoModal";
import UseMemoDemoModal from "./components/UseMemoDemoModal";
import UseCallbackDemoModal from "./components/UseCallbackDemoModal";

import InputModal from "./components/InputModal";

export default function App() {
  // existing state
  const [openHook, setOpenHook] = useState(false);
  const [openLodash, setOpenLodash] = useState(false);
  const [openInline, setOpenInline] = useState(false);
  const [throttleOpen, setThrottleOpen] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);

  // new state
  const [openEffect, setOpenEffect] = useState(false);
  const [openMemo, setOpenMemo] = useState(false);
  const [openCallback, setOpenCallback] = useState(false);


  return (
    <>
      <CounterCard />

      {/* Debounce row (your existing three) */}
      <div className="buttonRow">
        <button className="card" onClick={() => setOpenHook(true)}>Debounce (Hook)</button>
        <button className="card" onClick={() => setOpenLodash(true)}>Debounce (Lodash)</button>
        <button className="card" onClick={() => setOpenInline(true)}>Debounce (Inline)</button>
      </div>

      {/* Throttle (its own row) */}
      <div style={{ marginTop: 16 }}>
        <button className="card" onClick={() => setThrottleOpen(true)}>Open Throttle Modal</button>
      </div>

      {/* New: Hook explainers (same row) */}
      <div className="buttonRow" style={{ marginTop: 16 }}>
        <button className="card" onClick={() => setOpenEffect(true)}>Open useEffect Demo</button>
        <button className="card" onClick={() => setOpenMemo(true)}>Open useMemo Demo</button>
        <button className="card" onClick={() => setOpenCallback(true)}>Open useCallback Demo</button>
      </div>

      {/* Row 3: input modal button in its own row */}
      <div style={{ marginTop: 16 }}>
        <button className="card" onClick={() => setInputOpen(true)}>
          Open Input Modal
        </button>
      </div>
      
      <p className="read-the-docs">
        useEffect: side effects & cleanup • useMemo: memoize expensive values • useCallback: memoize function identity for children.
      </p>

      {/* existing modals */}
      <DebounceHookModal open={openHook} onClose={() => setOpenHook(false)} />
      <DebounceLodashModal open={openLodash} onClose={() => setOpenLodash(false)} />
      <DebounceInlineModal open={openInline} onClose={() => setOpenInline(false)} />
      <ThrottleModal open={throttleOpen} onClose={() => setThrottleOpen(false)} />

      {/* new modals */}
      <UseEffectDemoModal open={openEffect} onClose={() => setOpenEffect(false)} />
      <UseMemoDemoModal open={openMemo} onClose={() => setOpenMemo(false)} />
      <UseCallbackDemoModal open={openCallback} onClose={() => setOpenCallback(false)} />

      <p className="read-the-docs">
        InputModal logs inside/outside clicks and closes with ✕ or Esc.
      </p>

      {/* Input modal (with Esc + inside/outside logging) */}
      <InputModal open={inputOpen} onClose={() => setInputOpen(false)} />
    </>
  );
}
