import { useRef, useEffect } from "react";
import useHttp from "../../hooks/use-http";
import { useDispatch } from "react-redux";
import { searchActions } from "../../store/slices/searchSlice";
// import { getBoundsOfDistance } from "geolib";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { SEARCH_LIMIT } from "../../utils/config";

import styles from "./RangeInput.module.css";
import { useSelector } from "react-redux";

const provider = new OpenStreetMapProvider();

function RangeInput() {
  const rangeRef = useRef();
  const { error, sendRequest: sendRangeRequest } = useHttp();

  const query = useSelector((state) => state.search.queryKeyword);
  const filter = useSelector((state) => state.search.appliedFilter);
  const value = useSelector((state) => state.search.appliedRange);
  const date = useSelector((state) => state.search.selectedDate);

  const dispatch = useDispatch();

  function fetchResultsInRange(latitude, longitude) {
    let url;

    if (filter === "hotels") {
      if (date !== "") {
        url = `https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng?latitude=${latitude}&longitude=${longitude}&limit=${SEARCH_LIMIT}&distance=${rangeRef.current.value}&checkin=${date}`;
      } else {
        url = `https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng?latitude=${latitude}&longitude=${longitude}&limit=${SEARCH_LIMIT}&distance=${rangeRef.current.value}`;
      }
    } else if (filter === "restaurants") {
      url = `https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=${latitude}&longitude=${longitude}&limit=${SEARCH_LIMIT}&distance=${rangeRef.current.value}&open_now=false`;
    } else if (filter === "attractions") {
      url = `https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng?latitude=${latitude}&longitude=${longitude}&limit=${SEARCH_LIMIT}&distance=${rangeRef.current.value}`;
    }

    const requestConfig = {
      url,
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    };
    sendRangeRequest(requestConfig, (data) => {
      dispatch(searchActions.setFilterSearchResults({ data }));
    });
  }

  useEffect(() => {
    handleRangeCaptureVisually();
  }, [value]);

  function handleRangeCaptureVisually() {
    const sliderValue = +rangeRef.current.value;
    const colorPercentage = sliderValue * 20;

    rangeRef.current.style.background = `linear-gradient(to right, #01a96e ${colorPercentage}%, #c7e6a4 ${colorPercentage}%)`;
  }

  async function handleChange(e) {
    dispatch(
      searchActions.setAppliedRange({ appliedRange: Number(e.target.value) })
    );
    if (!query) return;
    if (filter === "0") {
      alert(
        `Please select a filter to view the category of locations in bounds`
      );
      return;
    }
    const coordinatesFromAddress = await provider.search({ query });
    const queryCoordinates = {
      latitude: coordinatesFromAddress[0].y,
      longitude: coordinatesFromAddress[0].x,
    };
    // const [southWestern, northEastern] = getBoundsOfDistance(
    //   queryCoordinates,
    //   Number(e.target.value) * 1000
    // );
    fetchResultsInRange(queryCoordinates.latitude, queryCoordinates.longitude);
  }

  return (
    <div className={styles.layout}>
      <div className={styles.label}>
        <label>Distance</label>
        <span>{value ? `${value}KM` : `No Bounds`}</span>
      </div>
      <input
        type="range"
        value={value}
        min={0}
        max={5}
        ref={rangeRef}
        onInput={handleRangeCaptureVisually}
        onChange={handleChange}
      />
    </div>
  );
}

export default RangeInput;
