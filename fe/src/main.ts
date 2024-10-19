import "./style.css";
import "leaflet/dist/leaflet.css";
import "/bus-svgrepo-com.svg";
import typescriptLogo from "./typescript.svg";
import "leaflet/dist/images/marker-shadow.png";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";
import L from "leaflet";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div id='#map'>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

// Initialize the map
const map = L.map("map").setView([52.259788, 21.040546], 13);

// Load and display tile layer (OpenStreetMap tiles)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markerHtmlStyles = `
  width: 3rem;
  height: 3rem;
  display: block;
  position: relative;
  `;

const lineNumberToColorMap: Record<string, string> = {};

const getLineColors = (lines: string) => {
  if (lineNumberToColorMap[lines]) {
    return lineNumberToColorMap[lines];
  } else {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    lineNumberToColorMap[lines] = color;
    return color;
  }
};

const getRandomColorBasedOnHash = (hash: string) => {
  let hashInt = 0;
  for (let i = 0; i < hash.length; i++) {
    hashInt = hash.charCodeAt(i) + ((hashInt << 5) - hashInt);
  }

  // Use a more random approach to generate RGB values
  const randomFactor = (hashInt * 9301 + 49297) % 233280;
  const r = (randomFactor >> 16) & 0xff;
  const g = (randomFactor >> 8) & 0xff;
  const b = randomFactor & 0xff;

  // Increase color contrast by adjusting the RGB values
  const adjustColor = (color: number) => {
    const factor = 1; // Adjust this factor to increase/decrease contrast
    return Math.min(Math.floor(color * factor), 255);
  };

  const adjustedR = adjustColor(r);
  const adjustedG = adjustColor(g);
  const adjustedB = adjustColor(b);

  return `#${((1 << 24) + (adjustedR << 16) + (adjustedG << 8) + adjustedB)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

const getBusIcon = (lines: string) => {
  return L.divIcon({
    html: `
    <span>
  
  <svg style="${markerHtmlStyles}" height="50px" width="50px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     viewBox="0 0 297.5 297.5" xml:space="preserve">
  <g>
    <g id="XMLID_41_">
      <g>
        <path style="fill:#99ABD5;" d="M69.555,243.06v32.63c0,0.82-0.67,1.49-1.49,1.49h-11.53c-0.82,0-1.49-0.67-1.49-1.49v-32.63
          H69.555z"/>
        <path style="fill:#99ABD5;" d="M242.455,243.06v32.63c0,0.82-0.67,1.49-1.5,1.49h-11.52c-0.83,0-1.49-0.67-1.49-1.49v-32.63
          H242.455z"/>
        <path d="M288.715,126.02v107.01c0,5.54-4.49,10.03-10.03,10.03h-16.17v32.63c0,11.89-9.67,21.56-21.56,21.56h-11.52
          c-11.89,0-21.56-9.67-21.56-21.56v-32.63H89.625v32.63c0,11.89-9.67,21.56-21.56,21.56h-11.53c-11.89,0-21.56-9.67-21.56-21.56
          v-32.63h-16.16c-5.54,0-10.03-4.49-10.03-10.03V126.02c0-3.45,0.28-6.92,0.85-10.32l10.5-63.02
          c5.07-30.38,31.09-52.43,61.89-52.43h133.44c30.8,0,56.83,22.05,61.89,52.43l10.51,63.02
          C288.425,119.1,288.715,122.57,288.715,126.02z M268.645,222.99v-96.97c0-2.35-0.19-4.71-0.58-7.02l-10.5-63.02
          c-3.44-20.67-21.15-35.66-42.1-35.66H82.025c-20.95,0-38.65,14.99-42.09,35.66L29.425,119c-0.38,2.31-0.58,4.67-0.58,7.02v96.97
          H268.645z M242.455,275.69v-32.63h-14.51v32.63c0,0.82,0.66,1.49,1.49,1.49h11.52C241.785,277.18,242.455,276.51,242.455,275.69z
           M69.555,275.69v-32.63h-14.51v32.63c0,0.82,0.67,1.49,1.49,1.49h11.53C68.885,277.18,69.555,276.51,69.555,275.69z"/>
        <path fill="${getRandomColorBasedOnHash(
          lines
        )}" d="M268.645,126.02v96.97h-239.8v-96.97c0-2.35,0.2-4.71,0.58-7.02l10.51-63.02
          c3.44-20.67,21.14-35.66,42.09-35.66h133.44c20.95,0,38.66,14.99,42.1,35.66l10.5,63.02
          C268.455,121.31,268.645,123.67,268.645,126.02z M253.435,129.55c1.9-2.07,2.85-4.83,2.62-7.62l-4.57-55.67
          c-1.84-22.49-20.96-40.1-43.53-40.1H89.535c-22.56,0-41.68,17.61-43.53,40.1l-4.57,55.67c-0.23,2.79,0.72,5.55,2.62,7.62
          c1.9,2.06,4.58,3.23,7.38,3.23h194.62C248.865,132.78,251.535,131.61,253.435,129.55z M258.115,177.34
          c0-15.77-12.83-28.59-28.6-28.59c-15.76,0-28.59,12.82-28.59,28.59s12.83,28.6,28.59,28.6
          C245.285,205.94,258.115,193.11,258.115,177.34z M96.575,177.34c0-15.77-12.83-28.59-28.6-28.59
          c-15.76,0-28.59,12.82-28.59,28.59s12.83,28.6,28.59,28.6C83.745,205.94,96.575,193.11,96.575,177.34z"/>
        <path d="M256.055,121.93c0.23,2.79-0.72,5.55-2.62,7.62c-1.9,2.06-4.57,3.23-7.38,3.23H51.435c-2.8,0-5.48-1.17-7.38-3.23
          c-1.9-2.07-2.85-4.83-2.62-7.62l4.57-55.67c1.85-22.49,20.97-40.1,43.53-40.1h118.42c22.57,0,41.69,17.61,43.53,40.1
          L256.055,121.93z M235.165,112.71l-3.68-44.81c-1-12.16-11.33-21.68-23.53-21.68H89.535c-12.19,0-22.53,9.52-23.53,21.68
          l-3.68,44.81H235.165z"/>
        <path d="M229.515,148.75c15.77,0,28.6,12.82,28.6,28.59s-12.83,28.6-28.6,28.6c-15.76,0-28.59-12.83-28.59-28.6
          S213.755,148.75,229.515,148.75z M238.045,177.34c0-4.7-3.82-8.53-8.53-8.53c-4.7,0-8.53,3.83-8.53,8.53s3.83,8.53,8.53,8.53
          C234.225,185.87,238.045,182.04,238.045,177.34z"/>
        <path style="fill:#BDC3C7;" d="M231.485,67.9l3.68,44.81H62.325l3.68-44.81c1-12.16,11.34-21.68,23.53-21.68h118.42
          C220.155,46.22,230.485,55.74,231.485,67.9z"/>
        <path d="M67.975,148.75c15.77,0,28.6,12.82,28.6,28.59s-12.83,28.6-28.6,28.6c-15.76,0-28.59-12.83-28.59-28.6
          S52.215,148.75,67.975,148.75z M76.505,177.34c0-4.7-3.82-8.53-8.53-8.53c-4.7,0-8.53,3.83-8.53,8.53s3.83,8.53,8.53,8.53
          C72.685,185.87,76.505,182.04,76.505,177.34z"/>
      </g>
      <g>
      </g>
    </g>
  </g>
  </svg>  </span>`,
    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });
};

type SingleBusData = {
  Lat: number;
  Lon: number;
  Lines: string;
  VehicleNumber: string;
  Time: string;
  Brigade: string;
};

type ExtendedBusData = SingleBusData & {
  addMarker: () => L.Marker;
  marker?: L.Marker;
};

const storedData: ExtendedBusData[] = [];

// Function to fetch and render bus data
function fetchAndRenderBusData() {
  fetch("http://localhost:3000/api/buses")
    .then((response) => response.json())
    .then((data: SingleBusData[]) => {
      if (storedData.length > 0) {
        storedData.forEach((extendedBus) => {
          const findStoredBusInData = data.find(
            (bus) => bus.VehicleNumber === extendedBus.VehicleNumber
          );

          if (findStoredBusInData) {
            const startLatLng = extendedBus.marker?.getLatLng();
            const endLatLng = L.latLng([
              findStoredBusInData.Lat,
              findStoredBusInData.Lon,
            ]);

            if (startLatLng && endLatLng) {
              const duration = 1000; // 1 second
              const startTime = performance.now();

              const animateMarker = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                const currentLat =
                  startLatLng.lat +
                  (endLatLng.lat - startLatLng.lat) * progress;
                const currentLng =
                  startLatLng.lng +
                  (endLatLng.lng - startLatLng.lng) * progress;

                extendedBus.marker?.setLatLng([currentLat, currentLng]);

                if (progress < 1) {
                  requestAnimationFrame(animateMarker);
                }
              };

              requestAnimationFrame(animateMarker);
            }
          }
        });

        return;
      }

      data.forEach((bus) => {
        const extendedBus = {
          ...bus,
          addMarker: () => {
            const marker = L.marker([bus.Lat, bus.Lon], {
              icon: getBusIcon(getLineColors(bus.Lines)),
            }).addTo(map);
            marker.bindPopup(
              `<b>Line:</b> ${bus.Lines}<br>
                        <b>Vehicle Number:</b> ${bus.VehicleNumber}<br>
                        <b>Time:</b> ${bus.Time}<br>
                        <b>Brigade:</b> ${bus.Brigade}`
            );
            return marker;
          },
        };
        if (storedData.length === 0) {
          storedData.push(extendedBus);
        } else {
          const index = storedData.findIndex(
            (storedBus) => storedBus.VehicleNumber === bus.VehicleNumber
          );
          if (index !== -1) {
            storedData[index] = extendedBus;
          } else {
            storedData.push(extendedBus);
          }
        }
      });

      storedData.forEach((extendedBus) => {
        const marker = extendedBus.addMarker();
        extendedBus.marker = marker;
      });
    })
    .catch((error) => console.error("Error fetching bus data:", error));
}

// Initial fetch and render
fetchAndRenderBusData();

// Fetch and render every 10 seconds
setInterval(fetchAndRenderBusData, 10000);

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
