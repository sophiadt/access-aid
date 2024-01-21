import {
    getVenueMaker,
    TGetVenueMakerOptions,
    OfflineSearch,
    MappedinLocation,
    Mappedin
  } from "@mappedin/mappedin-js";
  import "@mappedin/mappedin-js/lib/mappedin.css";
  import "./style.css";
  
  // See Trial API key Terms and Conditions
  // https://developer.mappedin.com/guides/api-keys
  const options: TGetVenueMakerOptions = {
    mapId: "65ac7ecf04c23e7916b1d0f4",
    key: "65ac8dda04c23e7916b1d101",
    secret: "00a3575903e7048ab8107c91c99f690e2b0bf68530edcde8731207e71189108e",
  };
  
  let venue: Mappedin;
  let search: OfflineSearch;
  let alphabeticalLocations: MappedinLocation[];
  
  const directoryListElement = document.getElementById("directory")!;
  const searchInput = document.getElementById(
    "locationsearch"
  ) as HTMLInputElement;
  
  //Accepts an array of MappedinLocations and displays them as list
  //elements within the directory div.
  function render(locations: MappedinLocation[]) {
    directoryListElement.replaceChildren();
    locations.forEach((location) => {
      const item = document.createElement("li");
      item.textContent = `${location.name}`;
      directoryListElement.appendChild(item);
    });
  }
  
  //Called when the user inputs text in the search text input box.
  searchInput.oninput = async (event: any) => {
    const value = event.target.value;
    //If the text input box is empty, list all locations.
    if (value.length < 1) {
      render(alphabeticalLocations);
    } else {
      //If the text input box is not empty, search for the entered value.
      const results = await search.search(value);
  
      //Render the locations returned by the search. The results
      //are filtered to only include locations that have a type of tenant.
      //A MappedinCategory could also be returned in the search, but
      //these are filtered out of the results in this example.
      render(
        results
          .filter((r) => r.type === "MappedinLocation")
          .map((r) => r.object as MappedinLocation)
          .filter((l) => l.type === "tenant")
      );
    }
  };
  
  async function init() {
    //Wait while the venue is downloaded.
    venue = await getVenueMaker(options);
  
    //Create an instance of OffLineSearch.
    search = new OfflineSearch(venue);
  
    //Get all locations from the venue that have a  type of tenant and
    //sort them alphabetically.
    alphabeticalLocations = [
      ...venue.locations.filter((location) => location.type === "tenant")
    ].sort((a, b) => (a.name < b.name ? -1 : 1));
  
    render(alphabeticalLocations);
  }
  
  init();  