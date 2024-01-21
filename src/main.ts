import {
  E_SDK_EVENT,
  getVenueMaker,
  showVenue,
  TGetVenueMakerOptions,
  MapView,
  MappedinMap,
  Mappedin
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import "./style.css";

const venueMakerOptions: TGetVenueMakerOptions = {
  mapId: "659efcf1040fcba69696e7b6",
  key: "65a0422df128bbf7c7072349",
  secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4",
};

let mapView: MapView;
let venue: Mappedin;

const selectorDiv = document.getElementById("selectorDiv")!;
const mapLevelSelectElement = document.createElement("select");
selectorDiv.appendChild(mapLevelSelectElement);
selectorDiv.style.cssText = "position: fixed; top: 1rem; left: 1rem;";

function onLevelChange(event: Event) {
  const id = (event.target as HTMLSelectElement).value;
  mapView.setMap(id);
}

function populateMaps(maps: MappedinMap[]) {
  const sortedMaps = maps.sort((a, b) => b.elevation - a.elevation);

  mapLevelSelectElement.innerHTML = "";
  mapLevelSelectElement.onchange = onLevelChange;

  sortedMaps.forEach((map) => {
    const option = document.createElement("option");
    option.text = map.name;
    option.value = map.id;
    mapLevelSelectElement.add(option);
  });

  mapLevelSelectElement.value = mapView.currentMap.id;
}

async function init() {
  venue = await getVenueMaker(venueMakerOptions);
  mapView = await showVenue(document.getElementById("app")!, venue, { multiBufferRendering: true,
    outdoorView: {
      enabled: true
    }, firstMap: venue.maps[1] });

  populateMaps(venue.maps);

  // Making polygons interactive allows them to respond to click and hover events.
  mapView.addInteractivePolygonsForAllLocations();

  // Display Floating Labels on all locations.
  mapView.FloatingLabels.labelAllLocations();

  // Capture when the user clicks on a polygon.
  mapView.on(E_SDK_EVENT.CLICK, ({ polygons }) => {
    if (polygons.length === 0) {
      mapView.FloatingLabels.removeAll();
      mapView.FloatingLabels.labelAllLocations();
      return;
    }

    mapView.FloatingLabels.removeAll();
    const location = mapView.getPrimaryLocationForPolygon(polygons[0]);
    mapView.FloatingLabels.add(polygons[0], location.name, {
      appearance: {
        marker: {
          size: 20
        },
        text: {
          size: 32,
          foregroundColor: "#ffb702",
          backgroundColor: "#0a0a0a"
        }
      }
    });
  });
}

init();