import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DateInput.module.css";
import { SEARCH_LIMIT } from "../../utils/config";
import useHttp from "../../hooks/use-http";
import { searchActions } from "../../store/slices/searchSlice";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const provider = new OpenStreetMapProvider();

function DateInput({ className = "" }) {
  const dateRef = useRef();
  const { error, sendRequest: sendDateRequest } = useHttp();
  const locationId = useSelector((state) => state.search.locationId);
  const value = useSelector((state) => state.search.selectedDate);
  const appliedRange = useSelector((state) => state.search.appliedRange);
  const queryKeyword = useSelector((state) => state.search.queryKeyword);

  const dispatch = useDispatch();

  async function fetchDatedQuery(requestConfig) {
    sendDateRequest(requestConfig, (data) =>
      dispatch(searchActions.setFilterSearchResults({ data }))
    );
  }

  async function handleChange(e) {
    const dateInput = dateRef.current.value;
    dispatch(searchActions.setSelectedDate({ selectedDate: dateInput }));

    if (!locationId) return;

    let url;
    if (appliedRange) {
      const coordinatesFromAddress = await provider.search({
        query: queryKeyword,
      });
      const queryCoordinates = {
        latitude: coordinatesFromAddress[0].y,
        longitude: coordinatesFromAddress[0].x,
      };

      url = `https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng?latitude=${queryCoordinates.latitude}&longitude=${queryCoordinates.longitude}&limit=${SEARCH_LIMIT}&distance=${appliedRange}&checkin=${dateInput}`;
    } else {
      url = `https://travel-advisor.p.rapidapi.com/hotels/list?location_id=${locationId}&adults=1&rooms=1&nights=2&checkin=${dateInput}&offset=0&currency=USD&order=asc&limit=${SEARCH_LIMIT}&sort=recommended&lang=en_US`;
    }

    const requestConfig = {
      url,
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    };

    fetchDatedQuery(requestConfig);
  }

  return (
    <div
      className={`${styles.date} ${className}`}
      onClick={() => dateRef.current.showPicker()}
    >
      <div className={styles.svg}>
        <svg height="100%" width="100%">
          <use href="sprite.svg#calendar" />
        </svg>
      </div>
      <span className={styles.text}>
        {value !== "" ? value : "Enter Dates"}
      </span>
      <input
        type="date"
        ref={dateRef}
        onChange={handleChange}
        value={value}
        min={new Date().toISOString().split("T")[0]}
      />
    </div>
  );
}

export default DateInput;
