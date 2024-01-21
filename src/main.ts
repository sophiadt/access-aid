import {
  getVenueMaker,
  showVenue,
  TGetVenueMakerOptions,
  MapView,
  MappedinMap,
  Mappedin,
  E_SDK
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import "./style.css";

// See Trial API key Terms and Conditions
// https://developer.mappedin.com/guides/api-keys
const options: TGetVenueMakerOptions = {
  mapId: "659efcf1040fcba69696e7b6",
  key: "65a0422df128bbf7c7072349",
  secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4",
};

let mapView: MapView;
let venue: Mappedin;

const selectorDiv = document.getElementById("selectorDiv")!;
const mapGroupSelectElement = document.createElement("select");
const mapLevelSelectElement = document.createElement("select");
selectorDiv.appendChild(mapGroupSelectElement);
selectorDiv.appendChild(mapLevelSelectElement);
selectorDiv.style.cssText = "position: fixed; top: 1rem; left: 1rem;";

//Switch to the map with the selected id.
function onLevelChange(event: Event) {
  const id = (event.target as HTMLSelectElement).value;
  mapView.setMap(id);
}

function populateMaps(maps: MappedinMap[]) {
  mapLevelSelectElement.innerHTML = "";
  mapLevelSelectElement.onchange = onLevelChange;

  // Add each map as an option to the level select.
  maps.forEach((map) => {
    const option = document.createElement("option");
    option.text = map.name;
    option.value = map.id;
    mapLevelSelectElement.add(option);
  });
  // Set the initial value of the level selector to the current map.
  mapLevelSelectElement.value = mapView.currentMap.id;
}

function populateMapGroups() {
  mapGroupSelectElement.innerHTML = "";
  const mapGroups = venue.mapGroups;
  //Add each MapGroup to the select element.
  mapGroups.forEach((mg) => {
    const option = document.createElement("option");
    option.value = mg.id;
    option.text = mg.name;
    mapGroupSelectElement.appendChild(option);
  });
  //Get and sort maps by elevation.
  const maps = mapGroups[0].maps.sort((a, b) => b.elevation - a.elevation);
  populateMaps(maps);
}

mapGroupSelectElement.onchange = async (ev: Event) => {
  const mg = venue.mapGroups.find(
    (mg) => mg.id === mapGroupSelectElement.value
  )!;
  //Get and sort maps by elevation.
  const maps = mg.maps.sort((a, b) => b.elevation - a.elevation);
  //Display the ground floor.
  const map = maps[maps.length - 1];

  await mapView.setMap(map);
  populateMaps(maps);
};

async function init() {
  //Wait while the venue is downloaded.
  venue = await getVenueMaker(options);
  //Display the default map in the app div.
  mapView = await showVenue(document.getElementById("app")!, venue, {
    multiBufferRendering: true,
    outdoorView: {
      enabled: true
    }
  });

  populateMapGroups();
}

init();
