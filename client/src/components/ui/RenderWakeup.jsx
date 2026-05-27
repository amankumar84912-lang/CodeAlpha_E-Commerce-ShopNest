import { useState, useEffect } from "react";
import API from "../../services/api";
import "./RenderWakeup.css";


/**
 * RenderWakeup — shows a friendly banner when the Render backend is cold-starting.
 *
 * How it works:
 * 1. On mount, pings /api/health
 * 2. If it takes > 4s, shows "Server waking up..." banner with animated progress
 * 3. Keeps pinging every 5s until backend responds
 * 4. Fades out once online
 *
 * Render free tier cold starts take 30-50s after 15min of inactivity.
 */
export default function RenderWakeup() {
  const [status,   setStatus]   = useState("idle");  // idle | waking | online
  const [elapsed,  setElapsed]  = useState(0);

  useEffect(() => {
    let mounted   = true;
    let ticker    = null;
    let attempts  = 0;
    const showAt  = 4000; // show banner after 4s of no response
    let showTimer = null;

    const ping = async () => {
      try {
        const start = Date.now();
        await API.get("/health", { timeout: 12000, _retried: true }); // skip retry here
        const took = Date.now() - start;

        if (!mounted) return;
        setStatus("online");
        clearInterval(ticker);
        // Auto-hide after 2s
        setTimeout(() => mounted && setStatus("idle"), 2000);
      } catch {
        if (!mounted) return;
        attempts++;
        // Try again in 5s
        setTimeout(ping, 5000);
      }
    };

    // Show the waking banner only if backend doesn't respond quickly
    showTimer = setTimeout(() => {
      if (mounted && status === "idle") {
        setStatus("waking");
        // Start elapsed counter
        ticker = setInterval(() => {
          setElapsed((s) => s + 1);
        }, 1000);
      }
    }, showAt);

    ping();

    return () => {
      mounted = false;
      clearTimeout(showTimer);
      clearInterval(ticker);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "idle") return null;

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
            ⏳ Server waking up… <span className="render-wakeup__time">({elapsed}s)</span>
            <span className="render-wakeup__sub"> — Render free tier may take up to 50s on first visit</span>
          </span>
        </>
      ) : (
        <>
          <span className="render-wakeup__text">✅ Server is online!</span>
        </>
      )}
    </div>
  );
}
