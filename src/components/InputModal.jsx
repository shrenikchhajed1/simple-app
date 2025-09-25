import { useEffect, useRef } from "react";
import "./InputModal.css";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 */
export default function InputModal({ open, onClose }) {
    const modalRef = useRef(null);

    // 🔹 handle Esc key close
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                console.log("[InputModal] Escape key pressed → closing modal");
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    // overlay click: log outside (no close)
    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            console.log("[InputModal] click OUTSIDE modal");
        }
    };

    // modal click: log inside
    const handleModalClick = () => {
        console.log("[InputModal] click INSIDE modal");
    };

    return (
        <div
            aria-modal="true"
            role="dialog"
            className="overlayStyle"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="modalStyle"
                onClick={(e) => {
                    e.stopPropagation();
                    handleModalClick();
                }}
            >
                <header className="headerStyle">
                    <h2 style={{ margin: 0 }}>Simple Modal</h2>
                    <button
                        className="closeBtnStyle"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </header>

                <section className="panelStyle">
                    <p>This is a plain modal box.</p>
                    <p>Click inside → logs “inside”</p>
                    <p>Click outside → logs “outside”</p>
                    <p>Press Esc or ✕ to close.</p>
                </section>
            </div>
        </div>
    );
}
