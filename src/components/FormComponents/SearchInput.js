import { useState } from "react";
import styles from "./SearchInput.module.css";

function SearchInput({ innerRef }) {
  const [input, setInput] = useState("");

  return (
    <input
      type="text"
      className={styles.search}
      placeholder="Where to?"
      value={input}
      ref={innerRef}
      onChange={(e) => setInput(e.target.value)}
    />
  );
}

export default SearchInput;
