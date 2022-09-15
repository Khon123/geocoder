import { filter, isNumber, isString } from "lodash";
import mapboxgl from "mapbox-gl";
import qs from "qs";

let pingMarker: any;
export const flyToMarker = (place: any, map: any) => {
  const location = stringToLocation(place);
  map.z1.fire("pushRouter", { at: location });

  let lat = 0,
    long = 0;
  if (place?.lat && place?.lon) {
    lat = place.lat;
    long = place.long;
  } else {
    [lat, long] = place.split(",");
  }

  pingMarker && pingMarker.remove();
  try {
    pingMarker = new mapboxgl.Marker({ color: "#fc384a" })
      .setLngLat([long, lat])
      .addTo(map);
    map.flyTo({ center: pingMarker.getLngLat(), zoom: 19 });
  } catch (err) {
    console.log("===::: ", err);
  }
  return pingMarker;
};

export const isLatLonText = (val = "") => {
  val = stringToLocation(val);
  let vals = val.replace(/\s+/g, "").split(",");
  vals = filter(vals, (str) => !!str);
  if (vals.length !== 2) return false;
  let [lat, log]: any = vals;
  lat = parseFloat(lat);
  log = parseFloat(log);
  if (isNaN(lat) || isNaN(log)) {
    return false;
  }
  let isValid = isNumber(lat) && isNumber(log);
  if (isValid && lat > log) {
    isValid = false;
  }
  return isValid;
};

export const stringToLocation = (location = "") => {
  if (!isString(location)) return "";
  if (location) {
    location = location?.trim().replace(/\s+/g, ",");
    location = location.replace(",,", ",");
    const locatinSplit = location?.split(",");

    const latSplit = locatinSplit[0]?.split(".");
    const firstLat = latSplit?.length > 1 ? latSplit[0] : "";
    const secondLat = latSplit?.length > 1 ? latSplit[1]?.substring(0, 7) : "";
    const lat = firstLat + "." + secondLat;

    const longSplit = locatinSplit[1]?.split(".");
    const firstLong = longSplit?.length > 1 ? longSplit[0] : "";
    const secondLong =
      longSplit?.length > 1 ? longSplit[1]?.substring(0, 7) : "";
    const long = firstLong + "." + secondLong;

    location = lat + "," + long;
  }
  return location || "";
};

export const removeMapLayer = (map: any) => {
  try {
    if (map.getSource("boundary") !== undefined) {
      map.removeLayer("boundary");
      if (map.getLayer("boundary-outline") !== undefined) {
        map.removeLayer("boundary-outline");
      }
      map.removeSource("boundary");
    }
  } catch (error) {
    //
  }
};

export const onAddGeoJsonBoundary = (boundary: any, map: any) => {
  removeMapLayer(map);

  // Add a data source containing GeoJSON data.
  map.addSource("boundary", {
    type: "geojson",
    data: boundary,
  });

  // Add a new layer to visualize the polygon.
  map.addLayer({
    id: "boundary",
    type: "fill",
    source: "boundary", // reference the data source
    layout: {},
    paint: {
      "fill-color": "#0080ff", // blue color fill
      "fill-opacity": 0.0,
    },
  });
  // Add a black outline around the polygon.
  map.addLayer({
    id: "boundary-outline",
    type: "line",
    source: "boundary",
    layout: {},
    paint: {
      "line-color": "#4090de",
      "line-width": 3,
    },
  });
};
