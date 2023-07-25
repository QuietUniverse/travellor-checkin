import SearchList from "./Search/SearchList";
import Map from "./Map/Map";
import RangeInput from "./FormComponents/RangeInput";

import styles from "./Main.module.css";

function Main() {
  return (
    <main className={styles.main}>
      <div className={styles[`search-container`]}>
        <RangeInput />
        <SearchList />
      </div>
      <div className={styles[`map-container`]}>
        <Map />
      </div>
    </main>
  );
}

export default Main;
