import { useSelector } from "react-redux";

import ResultCard from "./ResultCard";
import Loading from "../Loading";

import styles from "./SearchList.module.css";

function SearchList() {
  const searchResults = useSelector((state) => state.search.results);
  const resultIsLoading = useSelector((state) => state.search.resultIsLoading);

  return (
    <ul className={styles.list}>
      {resultIsLoading && <Loading />}
      {!resultIsLoading &&
        searchResults.map((result, index) => (
          <ResultCard location={result} index={index} key={result.id} />
        ))}
      {searchResults.length === 0 && !resultIsLoading && (
        <p className={styles.empty}>Nothing to see &#8635;</p>
      )}
    </ul>
  );
}

export default SearchList;
