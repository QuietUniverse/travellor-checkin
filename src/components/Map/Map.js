import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import CustomMarker from "./CustomMarker";

import "leaflet/dist/leaflet.css";

function Map() {
  const coordinates = useSelector(
    (state) => state.search.selectedResult?.coordinates
  );
  const searchResults = useSelector((state) => state.search.results);

  const position = coordinates?.latitude
    ? [+coordinates.latitude, +coordinates.longitude]
    : [51.505, -0.09];

  function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{
        height: "100%",
        width: "100%",
        position: "fixed",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {searchResults.length !== 0 &&
        searchResults.map(
          (result) =>
            result?.coordinates?.latitude && (
              <CustomMarker
                name={result.title}
                latitude={result.coordinates.latitude}
                longitude={result.coordinates.longitude}
                filter={result.filter}
                key={result.title}
              />
            )
        )}

      <ChangeMapView coords={position} />
    </MapContainer>
  );
}

export default Map;
