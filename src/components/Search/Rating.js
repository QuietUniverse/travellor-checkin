import styles from "./Rating.module.css";

function Rating({ rating, className }) {
  const splitRating = rating.split(".");
  const fullyFilled = +splitRating[0];
  const decimalRating = +splitRating[1];
  const emptyRating = Math.floor(5 - Number(rating));

  return (
    <div className={styles.layout}>
      {Array.from({ length: fullyFilled }, () => (
        <svg
          height="100%"
          width="100%"
          className={className}
          key={crypto.randomUUID()}
        >
          <use href="sprite.svg#full-rating" />
        </svg>
      ))}
      {decimalRating !== 0 && (
        <svg height="100%" width="100%" className={className}>
          <use href="sprite.svg#half-rating" />
        </svg>
      )}
      {emptyRating !== 0 &&
        Array.from({ length: emptyRating }, () => (
          <svg
            height="100%"
            width="100%"
            className={className}
            key={crypto.randomUUID()}
          >
            <use href="sprite.svg#empty-rating" />
          </svg>
        ))}
    </div>
  );
}

export default Rating;
