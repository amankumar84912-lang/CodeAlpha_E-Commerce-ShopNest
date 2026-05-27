import Spinner from "./Spinner";

/**
 * Full-page loading fallback shown during lazy route chunk loading.
 * Matches the app's dark background so there's no flash.
 */
export default function PageLoader() {
  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        minHeight:      "calc(100dvh - var(--navbar-height, 64px))",
        background:     "var(--color-bg, #0f0f13)",
      }}
    >
      <Spinner size="lg" />
    </div>
  );
}
