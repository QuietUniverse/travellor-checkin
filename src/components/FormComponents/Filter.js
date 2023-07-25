import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchActions } from "../../store/slices/searchSlice";
import { SEARCH_LIMIT } from "../../utils/config.js";
import { OpenStreetMapProvider } from "leaflet-geosearch";

import styles from "./Filter.module.css";
import useHttp from "../../hooks/use-http";

const provider = new OpenStreetMapProvider();

function Filter() {
  const appliedFilter = useRef();
  const value = useSelector((state) => state.search.appliedFilter);
  const appliedRange = useSelector((state) => state.search.appliedRange);
  const locationId = useSelector((state) => state.search.locationId);
  const queryKeyword = useSelector((state) => state.search.queryKeyword);
  const date = useSelector((state) => state.search.selectedDate);

  const { error, sendRequest: sendFilterRequest } = useHttp();

  const dispatch = useDispatch();

  async function fetchFilteredRequest(requestConfig) {
    sendFilterRequest(requestConfig, (data) => {
      if (appliedFilter.current.value !== "0") {
        dispatch(searchActions.setFilterSearchResults({ data }));
      } else {
        dispatch(searchActions.setSearchResults({ data: data }));
      }
    });
  }

  async function handleChange(e) {
    if (!locationId) return;
    if (!queryKeyword) return;
    const selectedFilter = appliedFilter.current.value;
    dispatch(searchActions.setAppliedFilter({ appliedFilter: selectedFilter }));
    if (selectedFilter !== "hotels") {
      dispatch(searchActions.resetSelectedDate());
    }
    if (selectedFilter === "0") {
      alert("Filter removed");
    }

    let queryCoordinates;

    if (appliedRange) {
      const coordinatesFromAddress = await provider.search({
        query: queryKeyword,
      });
      queryCoordinates = {
        latitude: coordinatesFromAddress[0].y,
        longitude: coordinatesFromAddress[0].x,
      };
    }

    let url;
    if (selectedFilter === "hotels") {
      url =
        appliedRange && date === ""
          ? `https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng?latitude=${queryCoordinates.latitude}&longitude=${queryCoordinates.longitude}&limit=${SEARCH_LIMIT}&distance=${appliedRange}`
          : appliedRange && date !== ""
          ? `https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng?latitude=${queryCoordinates.latitude}&longitude=${queryCoordinates.longitude}&limit=${SEARCH_LIMIT}&distance=${appliedRange}&checkin=${date}`
          : `https://travel-advisor.p.rapidapi.com/hotels/list?location_id=${locationId}&adults=1&rooms=1&nights=2&currency=USD&order=asc&limit=${SEARCH_LIMIT}&sort=recommended&lang=en_US`;
    } else if (selectedFilter === "restaurants") {
      url = appliedRange
        ? `https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=${queryCoordinates.latitude}&longitude=${queryCoordinates.longitude}&limit=${SEARCH_LIMIT}&distance=${appliedRange}&open_now=false`
        : `https://travel-advisor.p.rapidapi.com/restaurants/list?location_id=${locationId}&limit=${SEARCH_LIMIT}`;
    } else if (selectedFilter === "attractions") {
      url = appliedRange
        ? `https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng?latitude=${queryCoordinates.latitude}&longitude=${queryCoordinates.longitude}&limit=${SEARCH_LIMIT}&distance=${appliedRange}`
        : `https://travel-advisor.p.rapidapi.com/attractions/list?location_id=${locationId}&limit=${SEARCH_LIMIT}&sort=recommended`;
    } else if (selectedFilter === "0") {
      url = `https://travel-advisor.p.rapidapi.com/locations/search?query=${queryKeyword}&limit=${SEARCH_LIMIT}&offset=0&units=km&location_id=1&currency=USD&sort=relevance&lang=en_US`;
    }

    const requestConfig = {
      url,
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    };

    fetchFilteredRequest(requestConfig);

    dispatch(searchActions.setAppliedFilter({ appliedFilter: selectedFilter }));
  }

  return (
    <div className={styles.layout}>
      <div className={styles.label}>
        <label>Filters</label>
      </div>
      <select
        className={styles.select}
        ref={appliedFilter}
        onChange={handleChange}
        value={value}
      >
        <option defaultValue value={0}>
          No filter
        </option>
        <option value="hotels">Hotels</option>
        <option value="restaurants">Restaurants</option>
        <option value="attractions">Attractions</option>
      </select>
    </div>
  );
}

export default Filter;
