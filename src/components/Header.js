import React, { useRef } from "react";
import useHttp from "../hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { searchActions } from "../store/slices/searchSlice";
import Filter from "./FormComponents/Filter";
import { SEARCH_LIMIT } from "../utils/config.js";

import SearchBar from "./FormComponents/SearchBar";

import styles from "./Header.module.css";
import DateInput from "./FormComponents/DateInput";

function Header() {
  const searchRef = useRef();

  const appliedFilter = useSelector((state) => state.search.appliedFilter);

  const dispatch = useDispatch();

  const { error, sendRequest: sendSearchRequest } = useHttp();

  function handleSubmit(e) {
    e.preventDefault();

    dispatch(searchActions.resetFilterAndRange());

    const requestConfig = {
      url: `https://travel-advisor.p.rapidapi.com/locations/search?query=${searchRef.current.value}&limit=${SEARCH_LIMIT}&offset=0&units=km&currency=USD&sort=relevance&lang=en_US`,
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    };

    sendSearchRequest(requestConfig, (data) => {
      dispatch(searchActions.setSearchResults({ data }));
    });

    dispatch(
      searchActions.setQueryKeyword({ queryKeyword: searchRef.current.value })
    );
  }

  return (
    <header className={styles.header}>
      <DateInput
        className={appliedFilter === "hotels" ? styles.visible : styles.hidden}
      />
      <form onSubmit={handleSubmit} className={styles.form}>
        <SearchBar ref={searchRef} onClickSearch={handleSubmit} />
      </form>
      <Filter />
    </header>
  );
}

export default Header;
