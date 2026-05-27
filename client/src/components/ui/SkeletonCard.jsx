/**
 * SkeletonCard — animated shimmer placeholder matching ProductCard dimensions.
 * Used while products are loading to prevent layout shift.
 */
export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__img skeleton-shimmer" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__title skeleton-shimmer" />
        <div className="skeleton-card__title skeleton-shimmer" style={{ width: "60%" }} />
        <div className="skeleton-card__price skeleton-shimmer" />
        <div className="skeleton-card__btn skeleton-shimmer" />
      </div>
    </div>
  );
}
