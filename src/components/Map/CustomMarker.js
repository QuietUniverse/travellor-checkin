import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import hotelIcon from "./SVG/hotel.svg";
import hotelIconShadow from "./SVG/hotelShadow.svg";
import restaurantIcon from "./SVG/restaurant.svg";
import restaurantIconShadow from "./SVG/restaurantShadow.svg";
import attractionIcon from "./SVG/attraction.svg";
import attractionIconShadow from "./SVG/attractionShadow.svg";
import iconMarker from "./SVG/general.svg";
import iconMarkerShadow from "./SVG/generalShadow.svg";

function CustomMarker({ name, latitude, longitude, filter }) {
  const icon =
    filter === "hotel"
      ? {
          iconUrl: hotelIcon,
          shadowUrl: hotelIconShadow,
          iconSize: [40, 57],
          shadowAnchor: [-5, 10],
          shadowSize: [60, 30],
        }
      : filter === "restaurant"
      ? {
          iconUrl: restaurantIcon,
          shadowUrl: restaurantIconShadow,
          iconSize: [40, 57],
          shadowAnchor: [0, 10],
          shadowSize: [60, 30],
        }
      : filter === "attraction"
      ? {
          iconUrl: attractionIcon,
          shadowUrl: attractionIconShadow,
          iconSize: [40, 57],
          shadowAnchor: [0, 10],
          shadowSize: [60, 30],
        }
      : {
          iconUrl: iconMarker,
          shadowUrl: iconMarkerShadow,
          iconSize: [32, 50],
        };

  return (
    <Marker position={[latitude, longitude]} icon={new Icon(icon)}>
      <Popup>{name}</Popup>
    </Marker>
  );
}

export default CustomMarker;
