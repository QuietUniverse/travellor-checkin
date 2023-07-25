import { useDispatch, useSelector } from "react-redux";
import { startCase } from "../../utils/helper";
import Rating from "./Rating";
import { searchActions } from "../../store/slices/searchSlice";

import styles from "./ResultCard.module.css";

function ResultCard({ location, index }) {
  const selectedResult = useSelector((state) => state.search.selectedResult);
  const dispatch = useDispatch();

  function setCurrentAsSelection() {
    dispatch(searchActions.setSelectedResult({ selectedResult: location }));
  }

  return (
    <li
      className={`${styles.item} ${
        selectedResult.id === location.id ? styles.active : ""
      }`}
      onClick={setCurrentAsSelection}
    >
      <img
        src={location.imageUrl}
        alt={location.title}
        className={styles.thumbnail}
      />
      <div className={styles.text}>
        <p className={styles.title}>
          {`${index + 1}.`}
          <span>{location.title}</span>
        </p>
        <div className={styles.ratings}>
          {location.rating && (
            <Rating rating={location.rating + ""} className={styles.rating} />
          )}
          <span className={styles[`review-count`]}>
            {Number(location.numOfReviews).toLocaleString()}
          </span>
        </div>
        <p className={styles.address}>
          {startCase(location.filter)}&nbsp; &#x25CF; &nbsp;{location.address}
        </p>
      </div>
    </li>
  );
}

export default ResultCard;
