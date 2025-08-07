import { defineStore } from "pinia";
import Chart from "chart.js/auto";
import axios from "axios";
import { marker, tooltip } from "leaflet";
import { toRaw } from "vue";
import * as localForage from "localforage";
import PocketBase from "pocketbase";
const pbUrl = "https://pb-api.resourcetrackr.com";
const pb = new PocketBase(pbUrl);
Chart.defaults.datasets.bar.maxBarThickness = 25;

export const useMainStore = defineStore("useMainStore", {
  state: () => ({
    isLaoding: false,
    view: "map",
    state: "national",
    map: null,
    mapFit: 8,
    states: null,
    lgas: null,
    supportsSummary: [],
    facilities: null,
    partners: null,
    programAreas: null,
    supportTypes: null,
    currentSupports: {},
    viewingMap: null,
    cso: "all",
    mapData: {},
    mapNationalData: {},
    chartData: null,
    partnerSummaryData: {},
    chartMainContainerRef: null,
    chartMainContainerCSORef: null,
    statusContRef: null,
    chartDataKeys: null,
    chartCleanedData: [],
    mapGeoData: {},
    // baseUrl: 'https://resourcemapping.sydani.org/api/method/resourcemapping.data',
    baseUrl:
      "https://demo-resourcemapping-85.9.203.7.nip.io/api/method/resourcemapping.data",
    apiMethod: "",
    mapContainerRefMain: null,
    mapContainerRef: null,
    // mapKeyRef: null,
    // mapKeyContentRef: null,
    geoJson: null,
    markerGeoJson: null,
    today: new Date(),
    mapTLayer: "",
    mapPointerHTML: "",
    mapInfo: L.control(),
    natonalMapMarkers: null,
    mapMarkers: null,
    layerNamePopup: null,
    lgaMapMarker: null,
    mapInfoProps: null,
    mapLegend: L.control({ position: "bottomright" }),
    selectedMarker: null,
    selectedLgaMarker: null,
    selectedState: {},
    selectedLga: {},
    selectedPartners: {},
    selectedPrograms: {},
    selectedSupports: {},
    selectedStatus: {},
    selectedStartDate: "2020-01-01",
    selectedEndDate: "2030-12-31",
  }),

  actions: {},
});
