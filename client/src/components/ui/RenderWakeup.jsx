import { useState, useEffect } from "react";
import API from "../../services/api";
import "./RenderWakeup.css";

/**
 * RenderWakeup — shows a friendly banner when the Render backend is cold-starting.
 *
 * Shows after 4s of no response. Stops after 90s (Render cold start limit).
 * Auto-hides 2s after backend comes online.
 */
const MAX_WAIT_SECONDS = 90;

export default function RenderWakeup() {
  const [status,  setStatus]  = useState("idle");  // idle | waking | online | timeout
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let mounted  = true;
    let ticker   = null;
    let showTimer = null;
    let stopTimer = null;

    const ping = async () => {
      if (!mounted) return;
      try {
        await API.get("/health", { timeout: 10000, _retried: true });
        if (!mounted) return;
        setStatus("online");
        clearInterval(ticker);
        clearTimeout(stopTimer);
        setTimeout(() => mounted && setStatus("idle"), 2500);
      } catch {
        if (!mounted) return;
        // Retry every 6s
        setTimeout(ping, 6000);
      }
    };

    // Show banner after 4s with no response
    showTimer = setTimeout(() => {
      if (!mounted) return;
      setStatus("waking");
      ticker = setInterval(() => {
        setElapsed((s) => {
          if (s + 1 >= MAX_WAIT_SECONDS) {
            clearInterval(ticker);
            setStatus("timeout");
            return s + 1;
          }
          return s + 1;
        });
      }, 1000);
    }, 4000);

    // Hard stop after MAX_WAIT_SECONDS — server won't take longer than this
    stopTimer = setTimeout(() => {
      clearInterval(ticker);
      if (mounted) setStatus("timeout");
    }, (MAX_WAIT_SECONDS + 4) * 1000);

    ping();

    return () => {
      mounted = false;
      clearTimeout(showTimer);
      clearTimeout(stopTimer);
      clearInterval(ticker);
    };
  }, []);

  if (status === "idle") return null;

  if (status === "timeout") {
    return (
      <div className="render-wakeup render-wakeup--timeout" role="alert">
        <span className="render-wakeup__text">
          ⚠️ Backend taking longer than usual —{" "}
          <a
            href="https://codealpha-e-commerce-shopnest.onrender.com/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="render-wakeup__link"
          >
            check status
          </a>
        </span>
      </div>
    );
  }

  return (
    <div
      className={`render-wakeup render-wakeup--${status}`}
      role="status"
      aria-live="polite"
    >
      {status === "waking" ? (
        <>
          <span className="render-wakeup__dot" />
          <span className="render-wakeup__text">
            ⏳ Server waking up…{" "}
            <span className="render-wakeup__time">({elapsed}s)</span>
            <span className="render-wakeup__sub">
              {" "}— Render free tier cold start
            </span>
          </span>
        </>
      ) : (
        <span className="render-wakeup__text">✅ Server is online!</span>
      )}
    </div>
  );
}
