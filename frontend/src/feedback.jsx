// ---------------------------------------------------------------------------
// feedback.jsx — small pop-ups that talk to the user.
//
//   const { toast, confirm } = useFeedback();
//
//   toast('Product saved');                      → green message in the corner
//   toast('Something went wrong', 'error');      → red message
//
//   if (await confirm({ title: 'Cancel order?', message: '...', confirmLabel: 'Cancel order', danger: true })) {
//     ...only runs if the user clicked the confirm button
//   }
//
// <FeedbackProvider> wraps the whole app (see main.jsx) so every page can use it.
// ---------------------------------------------------------------------------
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const FeedbackContext = createContext(null);

export function useFeedback() {
  return useContext(FeedbackContext);
}

let nextToastId = 1;

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null); // { title, message, confirmLabel, danger, resolve }

  const toast = useCallback((message, tone = 'success') => {
    const id = nextToastId++;
    setToasts((current) => [...current, { id, message, tone }]);
    // Each message disappears by itself after 3.5 seconds.
    setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), 3500);
  }, []);

  // Returns a Promise that becomes true (confirmed) or false (cancelled).
  const confirm = useCallback(
    (options) => new Promise((resolve) => setDialog({ confirmLabel: 'Confirm', ...options, resolve })),
    []
  );

  function closeDialog(answer) {
    dialog.resolve(answer);
    setDialog(null);
  }

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone}`}>
            {t.tone === 'success' ? '✓ ' : ''}
            {t.message}
          </div>
        ))}
      </div>

      {dialog && <ConfirmDialog dialog={dialog} onAnswer={closeDialog} />}
    </FeedbackContext.Provider>
  );
}

// Uses the browser's built-in <dialog>: it blocks the page behind it,
// and pressing Esc closes it (counts as "No").
function ConfirmDialog({ dialog, onAnswer }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="dialog"
      onCancel={(event) => {
        event.preventDefault();
        onAnswer(false);
      }}
    >
      <h2 className="dialog-title">{dialog.title}</h2>
      {dialog.message && <p className="dialog-message">{dialog.message}</p>}
      <div className="dialog-actions">
        <button type="button" className="button" onClick={() => onAnswer(false)} autoFocus>
          Go back
        </button>
        <button
          type="button"
          className={`button ${dialog.danger ? 'button-danger' : 'button-primary'}`}
          onClick={() => onAnswer(true)}
        >
          {dialog.confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
