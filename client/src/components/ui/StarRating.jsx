/**
 * StarRating — renders a 0–5 star display using filled / half / empty SVG stars.
 * Fully accessible, reusable across ProductCard and ProductDetailPage.
 * Explicit width/height on every SVG prevents layout inflation.
 */

const SIZE_MAP = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 22,
};

export default function StarRating({ rating = 0, count, size = "sm", showCount = true }) {
  const px = SIZE_MAP[size] ?? 14;

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = rating >= i + 1;
    const half   = !filled && rating >= i + 0.5;
    return { filled, half };
  });

  return (
    <div
      className={`star-rating star-rating--${size}`}
      aria-label={`Rating: ${rating} out of 5`}
    >
      <div className="star-rating__stars">
        {stars.map(({ filled, half }, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            width={px}
            height={px}
            style={{ width: px, height: px, flexShrink: 0 }}
            className={`star${filled ? " star--filled" : half ? " star--half" : " star--empty"}`}
            aria-hidden="true"
          >
            {half ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  fill={`url(#half-${i})`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={filled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={filled ? 1 : 0.3}
                fillOpacity={filled ? 1 : 0}
              />
            )}
          </svg>
        ))}
      </div>

      {showCount && count != null && (
        <span className="star-rating__count">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
