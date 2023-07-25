import React from "react";
import SearchInput from "./SearchInput";

import styles from "./SearchBar.module.css";

const SearchBar = React.forwardRef(({ onClickSearch }, ref) => {
  return (
    <div className={styles.layout}>
      <div className={styles.svg} onClick={onClickSearch}>
        <svg height="100%" width="100%">
          <use href="sprite.svg#search" />
        </svg>
      </div>
      <SearchInput innerRef={ref} />
    </div>
  );
});

export default SearchBar;
