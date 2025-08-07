<template>
  <div class="map-container">
    <button v-if="selectedState" @click="resetMap" class="reset-button">
      Back to All States
    </button>
    <div id="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, shallowRef } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Use shallowRef for the map instance to avoid deep reactivity performance issues.
const map = shallowRef(null);
const NIGERIA_CENTER = [9.082, 8.6753];
const INITIAL_ZOOM = 6;

// Reactive references to manage layers and state
const statesLayer = shallowRef(null);
const lgaLayer = shallowRef(null);
const stateDotsLayer = shallowRef(null);
const lgaDotsLayer = shallowRef(null);
const selectedState = ref(null);
let selectedStateLayer = null;

// --- MOCK DATA FETCHING FUNCTIONS ---
// In a real app, these would be actual API calls.

/**
 * Fetches the GeoJSON for all Nigerian states.
 * @returns {Promise<Object>} A GeoJSON FeatureCollection.
 */
async function fetchStatesGeoJSON() {
  const response = await fetch("/data/states.geojson");
  if (!response.ok) throw new Error("Failed to fetch states GeoJSON");
  return await response.json();
}

/**
 * Fetches the GeoJSON for a specific state's LGAs.
 * @param {string} stateName - The name of the state.
 * @returns {Promise<Object>} A GeoJSON FeatureCollection.
 */
async function fetchLgaGeoJSON(stateName) {
  // Note: Ensure your GeoJSON filenames match the state names exactly.
  const response = await fetch(`/data/lgas/${stateName}.geojson`);
  if (!response.ok) {
    console.error(`LGA data for ${stateName} not found.`);
    return null; // Return null to handle missing files gracefully
  }
  return await response.json();
}

/**
 * Mocks fetching state-level data points.
 * @returns {Promise<Array>} An array of data points with lat/lng.
 */
async function fetchStateDataPoints() {
  // Replace with your actual API endpoint
  return [
    { name: "Lagos Point", lat: 6.5244, lng: 3.3792 },
    { name: "Kano Point", lat: 12.0022, lng: 8.592 },
    { name: "Rivers Point", lat: 4.8156, lng: 7.0498 },
  ];
}

/**
 * Mocks fetching LGA-level data points for a specific state.
 * @param {string} stateName - The name of the state.
 * @returns {Promise<Array>} An array of data points with lat/lng.
 */
async function fetchLgaDataPoints(stateName) {
  // Replace with your actual API endpoint.
  // This is mock data; you'd filter by stateName in a real query.
  const allLgaPoints = {
    Lagos: [
      { name: "Ikeja", lat: 6.6018, lng: 3.3515 },
      { name: "Badagry", lat: 6.4155, lng: 2.8832 },
    ],
    Kano: [
      { name: "Dala", lat: 12.0163, lng: 8.5134 },
      { name: "Nasarawa", lat: 11.979, lng: 8.563 },
    ],
    Rivers: [
      { name: "Port Harcourt", lat: 4.7774, lng: 7.0134 },
      { name: "Bonny", lat: 4.4533, lng: 7.1691 },
    ],
  };
  return allLgaPoints[stateName] || [];
}

// --- MAP LOGIC ---

/**
 * Initializes the Leaflet map.
 */
const initMap = () => {
  map.value = L.map("map").setView(NIGERIA_CENTER, INITIAL_ZOOM);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);
};

/**
 * Loads and displays the states GeoJSON layer.
 */
const loadStatesLayer = async () => {
  try {
    const geojsonData = await fetchStatesGeoJSON();
    statesLayer.value = L.geoJSON(geojsonData, {
      style: {
        color: "#3388ff",
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.2,
      },
      onEachFeature: (feature, layer) => {
        // Add a click listener to each state
        layer.on("click", onStateClick);
      },
    }).addTo(map.value);
  } catch (error) {
    console.error("Error loading states layer:", error);
  }
};

/**
 * Loads and displays state-level data points.
 */
const loadStateDots = async () => {
  if (stateDotsLayer.value) map.value.removeLayer(stateDotsLayer.value);

  const points = await fetchStateDataPoints();
  const markers = points.map((point) => {
    return L.circleMarker([point.lat, point.lng], {
      radius: 6,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    }).bindPopup(`<b>${point.name}</b>`);
  });

  stateDotsLayer.value = L.layerGroup(markers).addTo(map.value);
};

/**
 * Clears existing LGA layers and state highlights.
 */
const clearLgaLayers = () => {
  // Remove LGA boundaries
  if (lgaLayer.value) {
    map.value.removeLayer(lgaLayer.value);
    lgaLayer.value = null;
  }
  // Remove LGA dots
  if (lgaDotsLayer.value) {
    map.value.removeLayer(lgaDotsLayer.value);
    lgaDotsLayer.value = null;
  }
  // Reset previous state's style
  if (selectedStateLayer) {
    statesLayer.value.resetStyle(selectedStateLayer);
    selectedStateLayer = null;
  }
};

/**
 * Handles the click event on a state feature.
 * @param {L.LeafletMouseEvent} e - The Leaflet event object.
 */
const onStateClick = async (e) => {
  const layer = e.target;
  const stateName = layer.feature.properties.state_name; // 👈 Adjust this property name to match your GeoJSON!

  // If the same state is clicked again, do nothing.
  if (selectedState.value === stateName) return;

  // Clear previous LGA layers and highlights
  clearLgaLayers();

  // Update selection state
  selectedState.value = stateName;
  selectedStateLayer = layer;

  // Zoom to the selected state's bounds
  map.value.fitBounds(layer.getBounds());

  // Highlight the selected state
  layer.setStyle({
    color: "#ff0000",
    weight: 3,
    fillOpacity: 0.5,
  });

  // Hide the state-level dots
  if (stateDotsLayer.value) {
    map.value.removeLayer(stateDotsLayer.value);
  }

  // Load LGAs and their corresponding dots
  await loadLgaLayer(stateName);
  await loadLgaDots(stateName);
};

/**
 * Loads the GeoJSON layer for a specific state's LGAs.
 * @param {string} stateName - The name of the state.
 */
const loadLgaLayer = async (stateName) => {
  try {
    const lgaGeojsonData = await fetchLgaGeoJSON(stateName);
    if (!lgaGeojsonData) return; // Don't proceed if data is null

    lgaLayer.value = L.geoJSON(lgaGeojsonData, {
      style: {
        color: "#4a4a4a",
        weight: 1,
        opacity: 0.7,
        fillOpacity: 0.1,
      },
    }).addTo(map.value);
  } catch (error) {
    console.error(`Error loading LGAs for ${stateName}:`, error);
  }
};

/**
 * Loads data points for a specific state's LGAs.
 * @param {string} stateName - The name of the state.
 */
const loadLgaDots = async (stateName) => {
  const points = await fetchLgaDataPoints(stateName);
  const markers = points.map((point) => {
    return L.circleMarker([point.lat, point.lng], {
      radius: 5,
      fillColor: "#2ca25f",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.9,
    }).bindPopup(`<b>${point.name}</b>`);
  });

  lgaDotsLayer.value = L.layerGroup(markers).addTo(map.value);
};

/**
 * Resets the map to the initial nationwide view.
 */
const resetMap = () => {
  clearLgaLayers();
  selectedState.value = null;
  map.value.setView(NIGERIA_CENTER, INITIAL_ZOOM);
  // Re-add the state dots
  if (stateDotsLayer.value) {
    stateDotsLayer.value.addTo(map.value);
  }
};

// --- LIFECYCLE HOOKS ---

onMounted(() => {
  initMap();
  loadStatesLayer();
  loadStateDots();
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 80vh; /* Adjust height as needed */
}

#map {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}

.reset-button {
  position: absolute;
  top: 10px;
  left: 50px; /* Standard position for Leaflet controls */
  z-index: 1000; /* Ensure it's above the map */
  padding: 8px 12px;
  background-color: white;
  color: #333;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;
  font-family: Arial, sans-serif;
  font-weight: bold;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
}

.reset-button:hover {
  background-color: #f4f4f4;
}
</style>
