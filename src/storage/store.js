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
    lgaNameIcon: null,
    mapType: "states",
    map: null,
    lgaMap: null,
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
    viewingLgaMap: null,
    cso: "all",
    mapData: {},
    mapNationalData: {},
    mapLgaData: {},
    chartData: null,
    partnerSummaryData: {},
    chartMainContainerRef: null,
    chartMainContainerCSORef: null,
    statusContRef: null,
    chartDataKeys: null,
    chartCleanedData: [],
    mapGeoData: {},
    mapGeoDataLga: {},
    // baseUrl: 'https://resourcemapping.sydani.org/api/method/resourcemapping.data',
    baseUrl:
      "https://demo-resourcemapping-85.9.203.7.nip.io/api/method/resourcemapping.data",
    apiMethod: "",
    // mapContainerRefMain: null,
    mapContainerRef: null,
    mapContainerLGARef: null,
    // mapKeyRef: null,
    // mapKeyContentRef: null,
    geoJson: null,
    lgaGeoJson: null,
    markerGeoJson: null,
    today: new Date(),
    mapTLayer: "",
    mapPointerHTML: "",
    mapInfo: L.control(),
    natonalMapMarkers: null,
    lgasMapMarkers: null,
    mapMarkers: null,
    layerNamePopup: null,
    lgaDotMarkers: null,
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

  actions: {
    // login(email, password) {
    //   // this.loginProcess = true;
    //   return axios.post(`${this.baseUrl}.login`, {
    //     email: email,
    //     password: password,
    //   });
    // },

    generateChartLabels(e) {
      return this.barChartLabels.map((label, index) => ({
        text: label,
        fillStyle: this.getChartColors()[index],
      }));
    },

    formatDate(inputDate) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const [year, month] = inputDate.split("-");
      const formattedDate = `${months[parseInt(month) - 1]} ${year}`;

      return formattedDate;
    },

    async logout() {
      const authUser = JSON.parse(localStorage.getItem("authUser"));
      localStorage.removeItem("authUser");
      const config = {
        headers: {
          Authorization: `token ${authUser.api_key}:${authUser.api_secret}`,
        },
      };

      const data = { email: authUser.email };

      axios.post(`${this.baseUrl}.logout`, data, config).then((res) => {
        localStorage.clear();
        window.location.reload();
      });
    },

    selected(data, val) {
      if (data.includes(val)) {
        return true;
      }
      return false;
    },

    scrollDataContainer(e) {
      if (this.view == "chart") {
        let scrollPos = e.target.scrollTop;
        if (scrollPos >= 10.3) {
          this.statusContRef.classList.add("sticky", "top-[-20px]", "z-[99]");
        } else {
          this.statusContRef.classList.remove("sticky", "top-0", "z-[99]");
        }
      }
    },

    getChartColors() {
      return [
        "#004346",
        "#7FDBFF",
        "#8F3985",
        "#FF6F61",
        "#4D8169",
        "#C64F4A",
        "#A15751",
        "#C2740B",
        "#4A8186",
        "#A43E37",
        "#002B2E",
        "#8F3A37",
      ];
    },

    getDataObjAndColor(supportType, status) {
      let sptObj = this.getValFromData(this.supportTypes, "name", supportType);
      return {
        label: supportType,
        type: "bar",
        backgroundColor: sptObj.bg,
        borderColor: "#C2554F",
        data: [],
      };
    },

    findArrObj(array, key, value) {
      for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
          return i;
        }
      }
      return -1;
    },

    chartTooltip(context) {
      const tooltipModel = context.tooltip;

      let tooltipEl = document.getElementById("chartjs-tooltip");

      // Create element on first render
      if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.id = "chartjs-tooltip";
      }

      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }

      let title = tooltipModel.title[0];
      let longTitle = this.getValFromData(this.partners, "short_name", title);

      if (longTitle == null) {
        longTitle = this.getValFromData(this.partners, "partner", title);
        // console.log(longTitle, ' from if after');
        // console.log(this.partners, title);
      }
      longTitle = longTitle.partner;

      let val = tooltipModel.body[0].lines[0];
      val = val.split(":");
      let support = val[0];

      let summary = this.supportsSummary.find((spt) => {
        return support in spt && spt.partner == title;
      });

      tooltipEl.innerHTML = `
        <div><b>Partner:</b> ${longTitle}</div>
        <hr class="p-0 m-0">
        <div><b>Support:</b> ${support}</div>
        <hr class="p-0 m-0">
        <div class="max-w-[50vw]"><b>Support Summary:</b> ${summary[support]}</div>
        <hr class="p-0 m-0">
        <div><b>LGAs Supported:</b> ${val[1]}</div>
      `;

      document.body.appendChild(tooltipEl);

      const position = context.chart.canvas.getBoundingClientRect();

      tooltipEl.className =
        "z-[9999] shadow p-2 bg-rsmp-sec text-white absolute top-[20px], left-[10px] opacity-100";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.position = "absolute";
      // tooltipEl.style.top = '0px';
      // tooltipEl.style.left = '0px';
      tooltipEl.style.left =
        position.left + window.scrollX + tooltipModel.caretX + "px";
      tooltipEl.style.top =
        position.top + window.scrollY + tooltipModel.caretY + "px";
      // tooltipEl.style.font = bodyFont.string;
      // tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
      tooltipEl.style.pointerEvents = "none";

      // Hide if no tooltip
      // const tooltipModel = context.tooltip;
      // if (tooltipModel.opacity === 0) {
      //     tooltipEl.style.opacity = 0;
      //     return;
      // }

      // Set caret Position
      //  tooltipEl.classList.remove('above', 'below', 'no-transform');
      //  if (tooltipModel.yAlign) {
      //      tooltipEl.classList.add(tooltipModel.yAlign);
      //  } else {
      //      tooltipEl.classList.add('no-transform');
      //  }
    },

    initChart() {
      var t = this;
      var mainCont = document.createElement("div");
      t.chartMainContainerRef.innerHTML = "";
      this.currentSupports[this.view] = {};

      for (let i = 0; i <= t.chartDataKeys.length; i++) {
        let progArea = t.chartDataKeys[i];
        if (progArea) {
          let rawData = t.mapData[t.view]["data"][progArea];
          let chartData = t.createChartData(rawData);

          let partners = Object.keys(chartData);

          let chartDiv = document.createElement("div");
          let chartTitle = document.createElement("h3");

          let patnerChartDiv = document.createElement("div");
          let chartOption = t.getChartJsOptions(rawData.total_lgas);

          chartDiv.className = "bg-white p-4 mb-3 overflow-x-scroll c-scroll";
          patnerChartDiv.className = "relative flex h-full";
          chartTitle.className = "text-lg pb-3 font-bold";
          chartTitle.innerText = progArea;

          chartDiv.appendChild(chartTitle);

          partners.forEach((partner) => {
            let pat_full_name = this.getValFromData(
              this.partners,
              "short_name",
              partner
            );

            if (pat_full_name) {
              pat_full_name = pat_full_name.partner;
            } else {
              pat_full_name = partner;
            }

            let chartCanvas = document.createElement("canvas");
            let patSpt = chartData[partner];
            chartCanvas.className = `max-h-[250px] mr-1`;

            // if(patSpt.length >= 8) {
            //   chartCanvas.style.maxWidth = '500px';
            // } else if(patSpt.length >= 4) {
            //   chartCanvas.style.maxWidth = '300px';
            // } else if(patSpt.length >= 2) {
            //   chartCanvas.style.maxWidth = '250px';
            // } else {
            //   chartCanvas.style.maxWidth = '230px'
            // }

            let ctDatSet = {
              type: "bar",
              data: {
                labels: [partner],
                datasets: [],
              },
              options: chartOption,
            };

            for (let k = 0; k < patSpt.length; k++) {
              let spDt = patSpt[k];
              this.currentSupports[this.view][spDt.support] = {
                bg: spDt.bg,
                txt: spDt.txt,
              };
              if (spDt.lgas_sp > 0) {
                let spIndx = t.findArrObj(
                  ctDatSet.data.datasets,
                  "label",
                  spDt.support
                );

                const sptExists = this.supportsSummary.some((spt) => {
                  return spDt.support in spt && spt.partner == spDt.partner;
                });

                if (!sptExists) {
                  t.supportsSummary.push({
                    [spDt.support]: spDt.summary,
                    partner: spDt.partner,
                  });
                }

                if (spIndx >= 0) {
                  ctDatSet.data.datasets[spIndx]["data"].push(spDt.lgas_sp);
                } else {
                  ctDatSet.data.datasets.push({
                    label: spDt.support,
                    backgroundColor: spDt.bg,
                    data: [spDt.lgas_sp],
                    borderWidth: 1,
                  });
                }
              }
            }

            let noOfBars = ctDatSet.data.datasets.length;
            let pxls = noOfBars * 50 + 100;
            chartCanvas.style.maxWidth = `${pxls}px`;

            let ct = new Chart(chartCanvas, ctDatSet);
            // t.chartMainContainerRef.appendChild(chartCanvas);
            // c.appendChild(chartCanvas);
            // chart.canvas.parentNode.style.height = '128px';
            // chart.canvas.parentNode.style.width = '128px';
            patnerChartDiv.appendChild(chartCanvas);
            // console.log(ctObj);
            // console.log(patSpt);
          });

          // chartDiv.appendChild(chartCanvas);
          chartDiv.appendChild(patnerChartDiv);
          t.chartMainContainerRef.appendChild(chartDiv);
        }
      }
    },

    createChartData(data) {
      var t = this;
      const labels = Object.keys(data.partners);
      const dataSets = [];
      const dataSetData = [];
      const supportTypes = {};
      const charts = {};

      for (let a = 0; a < labels.length; a++) {
        let pdt = labels[a];
        let spTypes = Object.keys(data.partners[pdt]);

        for (let b = 0; b < spTypes.length; b++) {
          const spt = spTypes[b];

          const supportData = data.partners[pdt][spt];

          t.chartCleanedData.push({
            partner: pdt,
            support: spt,
            summary: supportData.mapping_data[0].summary_of_support,
            lgas_sp: supportData.lgas_supported,
            status: supportData.status,
            pat_full: supportData.partner_full_name,
            bg: supportData.type_of_support_bg,
            txt: supportData.type_of_support_txt,
          });
        }
      }

      labels.forEach((lb) => {
        var filteredArray = t.chartCleanedData.filter(function (obj) {
          return obj.partner === lb;
        });
        charts[lb] = filteredArray;
      });

      return charts;
      // console.log(charts);

      // let checkIfLabelExists  = (label) => {
      //   for(let j = 0; j < dataSets.length; j++) {
      //     if(dataSets[j]['label'] == label) {
      //       return j;
      //     } else {
      //       return false;
      //     }
      //   }
      // }

      // t.chartCleanedData.forEach((d) => {
      //   let patIndx = labels.indexOf(d.partner);
      //   // dataSetData[labelIndex] = d.lgas_sp;
      //   let dtObj = t.getDataObjAndColor(d.support, d.status);
      //   dtObj['data'][patIndx] = 0;
      //   if(dataSets.length <= 0) {
      //     dtObj['data'][patIndx] = d.lgas_sp;
      //     dataSets.push(dtObj);
      //   } else {
      //     // dtObj['data'] = [d.lgas_sp];
      //     let exPatInd = checkIfLabelExists(d.support);

      //     if(exPatInd) {
      //       dataSets[exPatInd]['data'][patIndx] = d.lgas_sp;
      //     } else {
      //       dtObj['data'][patIndx] = d.lgas_sp;
      //       dataSets.push(dtObj);
      //     }
      //   }
      // });
      // // console.log(dataSets);
      // return {
      //   labels: labels,
      //   datasets: dataSets
      // }
    },

    getChartJsOptions(max) {
      // console.log(max);
      return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            external: this.chartTooltip,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: max,
          },
          x: {
            categoryPercentage: 0.7, // Adjust as needed (default: 0.8)
          },
        },
        // barThickness: 20
      };
    },

    fetch(url) {
      this.isLaoding = true;
      return axios.get(`${this.baseUrl}.${url}`);
    },

    // setLoc(key, val) {
    //   val = JSON.stringify(val);
    //   localStorage.setItem(key, val);
    // },

    // getLoc(key) {
    //   let val = localStorage.getItem(key);
    //   if (val) {
    //     val = JSON.parse(val);
    //   }
    //   return val;
    // },

    // delLoc(key) {
    //   localStorage.removeItem(key);
    // },

    async setLoc(key, val) {
      // val = JSON.stringify(val);
      await localForage.setItem(key, val);
    },

    async getLoc(key) {
      let val = await localForage.getItem(key);
      // if (val) {
      //   val = JSON.parse(val);
      // }
      return val;
    },

    async delLoc(key) {
      await localForage.removeItem(key);
    },

    // openDB() {
    //   return new Promise((resolve, reject) => {
    //     const request = indexedDB.open("rsmp-db", 1);
    //     request.onupgradeneeded = function (event) {
    //       const db = event.target.result;
    //       if (!db.objectStoreNames.contains("kv")) {
    //         db.createObjectStore("kv");
    //       }
    //     };
    //     request.onsuccess = function (event) {
    //       resolve(event.target.result);
    //     };
    //     request.onerror = function (event) {
    //       reject(event.target.error);
    //     };
    //   });
    // },

    // async setLoc(key, val) {
    //   const db = await this.openDB();
    //   // Convert to plain JS object/array
    //   let plainVal = toRaw(val);
    //   return new Promise((resolve, reject) => {
    //     const tx = db.transaction("kv", "readwrite");
    //     const store = tx.objectStore("kv");
    //     store.put(plainVal, key);
    //     tx.oncomplete = () => resolve();
    //     tx.onerror = (e) => reject(e.target.error);
    //   });
    // },

    // async getLoc(key) {
    //   const db = await this.openDB();
    //   return new Promise((resolve, reject) => {
    //     const tx = db.transaction("kv", "readonly");
    //     const store = tx.objectStore("kv");
    //     const req = store.get(key);
    //     req.onsuccess = () => resolve(req.result);
    //     req.onerror = (e) => reject(e.target.error);
    //   });
    // },

    // delLoc(key) {
    //   return this.openDB().then((db) => {
    //     return new Promise((resolve, reject) => {
    //       const tx = db.transaction("kv", "readwrite");
    //       const store = tx.objectStore("kv");
    //       store.delete(key);
    //       tx.oncomplete = () => resolve();
    //       tx.onerror = (e) => reject(e.target.error);
    //     });
    //   });
    // },

    async fetchStates() {
      // this.states = records;
      // console.log(records);
      // getFullList
      //         const records = await pb.collection('your_collection_name').getList(1, 50, {
      //     fields: 'id,name,email' // Comma-separated list of field names
      // });
      // console.log(records);

      // this.delLoc("states");

      let states = await this.getLoc("states");
      // console.log(states);
      if (states) {
        this.states = states;
      } else {
        const records = await pb.collection("state").getFullList({
          fields: "state,geometry",
        });
        await this.setLoc("states", records);
        this.states = await this.getLoc("states");
        // this.isLaoding = false;
        // await this.fetch("states").then(async (res) => {
        //   this.states = res.data.states;
        //   await this.setLoc("states", this.states);
        //   this.isLaoding = false;
        // });
      }

      this.states.forEach((s) => {
        this.selectedState[this.view].push(s.state);
      });
    },

    async fetchLgas() {
      let state = this.selectedState[this.view][0];
      let recName = `${state}-lgas`;
      this.delLoc(recName);
      let lgs = await this.getLoc(recName);

      if (lgs) {
        this.lgas = lgs;
      } else {
        await axios
          .post(`${pbUrl}/api/state/lgas`, {
            states: this.selectedState[this.view],
          })
          .then(async (res) => {
            await this.setLoc(recName, res.data);
            this.lgas = res.data;
          });
      }
    },

    // async fetchFacilities() {
    //   // let st = this.selectedState[this.view];
    //   // let localFcsName = `facilities${st}`;
    //   // await this.delLoc(localFcsName);
    //   // let localFcs = await this.getLoc(localFcsName);

    //   // console.log(localFcs);

    //   let localFcs = await this.getLoc("allFacilities");

    //   if (localFcs) {
    //     this.facilities = localFcs;
    //   } else {
    //     // let url = `dh_facilities?state=${st}`;
    //     // await this.fetch(url).then(async (res) => {
    //     //   this.facilities = res.data.facilities;
    //     //   await this.setLoc(localFcsName, this.facilities);
    //     //   this.isLaoding = false;
    //     // });
    //     // const records = await pb.collection("facility").getFullList({
    //     //   fields: "facility,state,lga,geometry",
    //     // });
    //     await axios
    //       .get("https://pb-api.resourcetrackr.com/api/facilities")
    //       .then(async (res) => {
    //         await this.setLoc("allFacilities", res.data.facilities);
    //         this.facilities = res.data.facilities;
    //       });
    //   }
    // },

    // nownow

    async fetchPartners() {
      this.partners = [
        { partner: "Acasus", short_name: "Acasus", cso_partner: 0 },
        { partner: "AFENET", short_name: "AFENET", cso_partner: 0 },
        { partner: "C-WINS", short_name: "C-WINS", cso_partner: 0 },
        { partner: "CHAI", short_name: "CHAI", cso_partner: 0 },
        { partner: "e-Health Africa", short_name: "E-HA", cso_partner: 0 },
        { partner: "GRID3", short_name: "GRID3", cso_partner: 0 },
        { partner: "IVAC", short_name: "IVAC", cso_partner: 0 },
        { partner: "McKing", short_name: "McKing", cso_partner: 0 },
        { partner: "McKinsey", short_name: "McKinsey", cso_partner: 0 },
        { partner: "Red Cross", short_name: "Red-C", cso_partner: 0 },
        { partner: "SCIDAR", short_name: "SCIDAR", cso_partner: 0 },
        { partner: "Sydani Group", short_name: "Sydani", cso_partner: 0 },
        {
          partner: "TaskForce for Global Health",
          short_name: "TFGH",
          cso_partner: 0,
        },
        { partner: "UNICEF", short_name: "UNICEF", cso_partner: 0 },
        { partner: "USCDC", short_name: "USCDC", cso_partner: 0 },
        { partner: "WHO", short_name: "WHO", cso_partner: 0 },
      ];

      // this.partners.forEach((p) => {
      //   this.selectedPartners[this.view].push(p.partner);
      // });

      // this.isLaoding = true;
      // await this.delLoc("partners");
      // let partners = await this.getLoc("partners");
      // if (!partners) {
      //   const record = await pb.collection("partner").getFullList({
      //     fields: "partner, short_name, cso_partner",
      //   });
      //   await this.setLoc("partners", record);
      //   this.partners = record;
      // }

      // let url = "map_view_partners";
      // if (this.view == "cso") {
      //   url = "cso_partner";
      // } else if (this.view == "chart") {
      //   url = "partners";
      // }
      // if (!this.partners) {
      //   await this.fetch(url).then(async (res) => {
      //     this.partners = res.data.partners;

      // let pts = ;
      // for (let index = 0; index < pts.length; index++) {
      //   const pt = pts[index];
      //   const record = await pb.collection("partner").create(pt);
      // }

      //     this.isLaoding = false;
      //   });
      // }
    },

    async fetchPrograms() {
      this.programAreas = [
        { service: "Measles Rubella" },
        { service: "Polio" },
        { service: "HPV" },
        { service: "NTDs" },
        { service: "Malaria" },
        { service: "Nutrition" },
        { service: "Routine Immunization" },
      ];

      // this.programAreas.forEach((p) => {
      //   this.selectedPrograms[this.view].push(p.service);
      // });
      // if (!this.programAreas) {
      //   await this.fetch("programs").then(async (res) => {
      //     this.programAreas = res.data.programs;
      //     console.log(this.programAreas);
      //     this.isLaoding = false;
      //   });
      // }
    },

    async fetchSupportTypes() {
      this.supportTypes = [
        { name: "Technical Support", bg: "#8f800e", txt: "#e1dff5" },
        { name: "Funding", bg: "#29CD42", txt: "#bf7245" },
        { name: "Provision of Commodities", bg: "#107510", txt: "#f5dfe9" },
      ];
    },

    async fetchNationalMapData() {
      let filter = {
        state: toRaw(this.selectedState[this.view]),
        lga: toRaw(this.selectedLga[this.view]),
        partner: toRaw(this.selectedPartners[this.view]),
        supportFocus: toRaw(this.selectedPrograms[this.view]),
        suportType: toRaw(this.selectedSupports[this.view]),
        status: toRaw(this.selectedStatus[this.view]),
      };

      await axios.post(`${pbUrl}/api/support`, filter).then((res) => {
        this.mapNationalData[this.view] = null;
        this.mapNationalData[this.view] = res.data;
      });
    },

    async fetchLgaMapData() {
      let filter = {
        state: toRaw(this.selectedState[this.view]),
        lga: toRaw(this.selectedLga[this.view]),
        partner: toRaw(this.selectedPartners[this.view]),
        supportFocus: toRaw(this.selectedPrograms[this.view]),
        suportType: toRaw(this.selectedSupports[this.view]),
        status: toRaw(this.selectedStatus[this.view]),
      };

      await axios.post(`${pbUrl}/api/support/lgas`, filter).then((res) => {
        this.mapLgaData[this.view] = null;
        this.mapLgaData[this.view] = res.data;
      });
    },

    // async fetchMapData() {
    //   await axios
    //     .get("https://pb-api.resourcetrackr.com/api/support")
    //     .then((res) => {
    //       console.log(res);
    //     });

    //   // let url = `support_duration?`;
    //   // let partners_param = "&partners=";
    //   // let programs_param = "&program_area=";
    //   // let support_param = "&support_types=";
    //   // let status_param = "&support_status=";

    //   // let pts = this.selectedPartners[this.view];
    //   // let prgs = this.selectedPrograms[this.view];
    //   // let spts = this.selectedSupports[this.view];
    //   // let stts = this.selectedStatus[this.view];

    //   // pts.forEach((part) => {
    //   //   partners_param += `${part},`;
    //   // });

    //   // prgs.forEach((prg) => {
    //   //   programs_param += `${prg},`;
    //   // });

    //   // spts.forEach((sp) => {
    //   //   support_param += `${sp},`;
    //   // });

    //   // stts.forEach((st) => {
    //   //   status_param += `${st},`;
    //   // });

    //   // let st = this.selectedState[this.view];
    //   // let lg = this.selectedLga[this.view];

    //   // if (this.view == "chart") {
    //   //   url = `support_coverage?`;
    //   // }

    //   // url += `state=${st}`;

    //   // if (lg) {
    //   //   url += `&lga=${lg}`;
    //   // }

    //   // if (this.selectedPrograms[this.view]) {
    //   //   url += programs_param;
    //   // }
    //   // if (this.selectedPartners[this.view]) {
    //   //   url += partners_param;
    //   // }
    //   // if (this.selectedSupports[this.view]) {
    //   //   url += support_param;
    //   // }
    //   // if (this.selectedStatus[this.view]) {
    //   //   url += status_param;
    //   // }

    //   // url += `&cso=${this.cso}`;

    //   // await this.fetch(url)
    //   //   .then(async (res) => {
    //   //     this.mapData[this.view] = null;
    //   //     this.mapData[this.view] = res.data;
    //   //     this.isLaoding = false;
    //   //   })
    //   //   .catch((error) => {
    //   //     console.log(error);
    //   //   });
    // },

    async launchAapp() {
      this.isLaoding = true;
      await this.fetchStates();

      // await this.fetchLgas();
      await this.fetchPartners();
      await this.fetchPrograms();
      await this.fetchSupportTypes();
      await this.fetchNationalMapData();
      // await this.fetchFacilities();
      this.loadNationalMapGeometry();
      await this.createNationalMap();
      // await this.loadGeoData();
      // await this.createMap();

      // await this.createNationalDataPoints();

      // this.mapMarkers.addTo(this.map);
      this.isLaoding = false;
    },

    async launchAappLga() {
      this.isLaoding = true;
      this.mapType = "lgas";
      await this.fetchLgas();

      this.selectedLga[this.view].length = 0;
      this.lgas.forEach((l) => {
        this.selectedLga[this.view].push(l.lga);
      });

      await this.fetchLgaMapData();
      // this.loadNationalMapGeometry();
      this.mapGeoDataLga = {
        type: "FeatureCollection",
        features: [],
      };

      this.lgas.forEach((d) => {
        // let geoCords = JSON.parse(d.geometry);
        this.mapGeoDataLga.features.push({
          type: "Feature",
          id: `${d.state}-${d.lga}`,
          properties: {
            state: d.state,
            lga: d.lga,
          },
          geometry: d.geometry,
        });
      });

      await this.createLGAsMap();
      this.isLaoding = false;
    },

    async updateApp() {
      // await this.fetchMapData();
      if (this.view == "map") {
        // await this.mapMarkers.clearLayers();
        // await this.markerGeoJson.clearLayers();
        // await this.geoJson.clearLayers();
        // if (this.mapType == "states") {

        await this.fetchNationalMapData();
        await this.loadNationalMapGeometry();
        // await this.createMap();
        await this.createNationalMap();
        // } else {
        //   await this.fetchMapData();
        //   await this.loadGeoData();
        //   await this.createMap();
        // }
        // await this.geoJson.addData(this.mapGeoData);
        // await this.createDataPoints();
      }

      // else if (this.view == "chart") {
      //   // this.selectedPrograms = null;
      //   this.chartDataKeys = Object.keys(this.mapData[this.view]["data"]);
      //   this.chartDataKeys = this.chartDataKeys.sort();
      //   // console.log(this.chartDataKeys);
      //   this.chartCleanedData = [];
      //   this.initChart();
      // } else if (this.view == "ptins") {
      //   const that = this;
      //   let partnerSummaryData = {};
      //   const insData = this.mapData[this.view]["data"];

      //   Object.keys(insData).forEach((st) => {
      //     Object.keys(insData[st]).forEach((lg) => {
      //       insData[st][lg].forEach((progData) => {
      //         let prgArea = progData.program_area;
      //         let partner = progData.partner;

      //         if (!partnerSummaryData[prgArea]) {
      //           partnerSummaryData[prgArea] = {};
      //         }

      //         if (!partnerSummaryData[prgArea][partner]) {
      //           partnerSummaryData[prgArea][partner] = [];
      //         }

      //         let hasSupport = partnerSummaryData[prgArea][partner].some(
      //           (obj) => obj.type_of_support === progData.type_of_support
      //         );

      //         if (!hasSupport) {
      //           partnerSummaryData[prgArea][partner].push(progData);
      //         }
      //       });
      //     });
      //   });

      //   that.partnerSummaryData = partnerSummaryData;
      // }

      this.isLaoding = false;
    },

    dateFilter() {
      let filter = "";
      if (this.dateFrom) {
        filter = `&dateFrom=${this.dateFrom}`;
        if (this.dateTo) {
          filter += `&dateTo=${this.dateTo}`;
        }
      }
      return filter;
    },

    resetMapHighlight(e) {
      if (
        this.viewingMap &&
        this.viewingMap.feature.id == e.target.feature.id
      ) {
        return;
      } else {
        this.geoJson.resetStyle(e.target);
        this.mapInfo.update();
      }
    },

    // Define a function for fade-in animation
    fadeInColor(element) {
      // Get the current opacity of the element
      var that = this;
      let opacity = parseFloat(L.DomUtil.getStyle(element, "opacity"));
      // Increase the opacity by 0.1
      opacity += 0.02;
      // Set the new opacity to the element
      L.DomUtil.setOpacity(element, opacity);
      // Check if the opacity is less than 1
      if (opacity < 1) {
        // Request another animation frame and call the same function recursively
        L.Util.requestAnimFrame(function () {
          that.fadeInColor(element);
        });
      }
    },

    addLegend(type, cMap) {
      this.mapLegend.onAdd = (map) => {
        map._ldiv = L.DomUtil.create("div", "legend");
        let grades = this.getGrades(type);
        for (var i = 0; i < grades.length; i++) {
          map._ldiv.innerHTML += `<i style="background: ${this.getColor(
            grades[i],
            "reached"
          )};"></i> 
          - ${grades[i]} <br>
          `;
        }

        return map._ldiv;
      };
      this.mapLegend.addTo(cMap);
    },

    createGradesByTotal(num) {
      const totalElements = 5;
      const stepSize = Math.round(num / (totalElements - 1));
      const numberArray = Array.from(
        { length: totalElements },
        (_, i) => i * stepSize
      );
      return numberArray;
    },

    getGrades(type) {
      let grades = ["0-49", "50-79", "80-99", "100+"];

      return grades;
    },

    layerStyle(feature) {
      return {
        fillColor: "#98A94A",
        weight: 1,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.4,
      };
    },

    highlightNationalMapFeature(e) {
      if (this.viewingMap) {
        return;
      }
      var layer = e.target;
      // layer.openPopup();
      // layer.bindTooltip()
      var tlt = tooltip().setContent(`
        <div class="bg-blue-600 text-white text-lg font-bold m-0 p-0 px-2">
        ${e.target.feature.properties.state}
        </div>
      `);
      layer.bindTooltip(tlt);
      layer.openTooltip();

      layer.setStyle({
        weight: 1,
        color: "#98A94A",
        dashArray: "",
        fillOpacity: 0.8,
      });

      L.DomUtil.setOpacity(e.target._path, 0.5);
      this.fadeInColor(e.target._path);
      layer.bringToFront();

      this.mapInfo.update(layer.feature.properties);
    },

    // highlightMapFeature(e) {
    //   if (this.viewingMap) {
    //     return;
    //   }
    //   var layer = e.target;
    //   // layer.openPopup();
    //   // layer.bindTooltip()
    //   var tlt = tooltip().setContent(`
    //     <div class="bg-blue-600 text-white text-lg font-bold m-0 p-0 px-2">
    //     ${e.target.feature.properties.LGA}
    //     </div>
    //   `);
    //   layer.bindTooltip(tlt);
    //   layer.openTooltip();

    //   layer.setStyle({
    //     weight: 1,
    //     color: "#98A94A",
    //     dashArray: "",
    //     fillOpacity: 0.8,
    //   });

    //   L.DomUtil.setOpacity(e.target._path, 0.5);
    //   this.fadeInColor(e.target._path);
    //   layer.bringToFront();

    //   this.mapInfo.update(layer.feature.properties);
    // },

    fitBounds(geo) {
      // this.map.setView(geo.getBounds().getCenter(), this.mapFit);
      this.map.fitBounds(geo.getBounds());
    },

    async zoomToMapFeature(e) {
      let dataSet = e.target.feature.properties;
      let mpd = this.mapData[this.view];
      this.selectedMarker = null;

      if (this.selectedState) {
        dataSet["supports"] = mpd.data[dataSet.state][dataSet.LGA];
        this.selectedLgaMarker = dataSet;
      }

      let layer = e.target;

      this.viewingMap = layer;

      layer.setStyle({
        weight: 1,
        color: "red",
        dashArray: "",
        fillOpacity: 1,
      });

      this.map.flyToBounds(e.target, { duration: 0.2 }, 24);
    },

    async zoomToMapFeatureNational(e) {
      let dataSet = e.target.feature.properties;
      // let mpd = this.mapNationalData[this.view];

      // this.selectedMarker = null;

      // if (this.selectedState) {
      //   dataSet["supports"] = mpd.data[dataSet.state];
      //   this.selectedLgaMarker = dataSet;
      // }

      let layer = e.target;
      this.viewingMap = layer;
      // layer.setStyle({
      //   weight: 1,
      //   color: "red",
      //   dashArray: "",
      //   fillOpacity: 0.8,
      // });
      // console.log(dataSet);
      this.selectedState[this.view].length = 0;
      this.selectedState[this.view].push(dataSet.state);
      // console.log(this.selectedState[this.view]);
      this.launchAappLga();
      // this.map.flyToBounds(e.target, { duration: 0.2 }, 24);
    },

    mapInfoOnUpdate(props) {
      if (props) {
        this.mapInfoProps = props;
      } else {
        this.mapInfoProps = null;
      }
    },

    mapLegendOnAdd(map) {
      map._ldiv = L.DomUtil.create("div", "legend");

      // let grades = this.getGrades();

      // for (var i = 0; i < grades.length; i++) {
      //   map._ldiv.innerHTML +=
      //     '<i style="background:' + this.getColor(grades[i] + 1) + '"></i> ' +
      //     grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      // }

      return map._ldiv;
    },

    getValFromData(dataObj, field, match) {
      for (let i = 0; i < dataObj.length; i++) {
        if (dataObj[i][field] == match) {
          return dataObj[i];
        }
      }
      return null;
    },

    async loadNationalMapGeometry() {
      this.mapGeoData = {
        type: "FeatureCollection",
        features: [],
      };

      this.states.forEach((d) => {
        // let geoCords = JSON.parse(d.geometry);
        this.mapGeoData.features.push({
          type: "Feature",
          id: d.state,
          properties: {
            state: d.state,
          },
          geometry: d.geometry,
        });
      });
    },

    async loadMapGeometry(data) {
      this.mapGeoData = {
        type: "FeatureCollection",
        features: [],
      };

      data.forEach((d) => {
        let geoCords = JSON.parse(d.geometry);
        this.mapGeoData.features.push({
          type: "Feature",
          id: d.lga,
          properties: {
            state: d.state,
            LGA: d.lga,
          },
          geometry: geoCords,
        });
      });
    },

    // generatePoints(mapGeometry, numPoints) {
    //   // Parse the GeoJSON polygon data
    //   const polygon = JSON.parse(mapGeometry);

    //   // Function to generate a random point within a polygon
    //   function getRandomPointInPolygon(polygon, retries) {
    //     const coordinates = polygon.coordinates[0];
    //     const minX = Math.min(...coordinates.map(point => point[0]));
    //     const maxX = Math.max(...coordinates.map(point => point[0]));
    //     const minY = Math.min(...coordinates.map(point => point[1]));
    //     const maxY = Math.max(...coordinates.map(point => point[1]));

    //     // Generate random values within the polygon bounds
    //     const randomX = Math.random() * (maxX - minX) + minX;
    //     const randomY = Math.random() * (maxY - minY) + minY;

    //     // Check if the point is inside the polygon using the Ray Casting algorithm
    //     // let inside = false;
    //     // for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
    //     //   const xi = coordinates[i][0], yi = coordinates[i][1];
    //     //   const xj = coordinates[j][0], yj = coordinates[j][1];

    //     //   const intersect = ((yi > randomY) != (yj > randomY)) &&
    //     //     (randomX < (xj - xi) * (randomY - yi) / (yj - yi) + xi);

    //     //   if (intersect) inside = !inside;
    //     // }

    //     return [randomX, randomY];
    //   }

    //   const points = [];
    //   for (let i = 0; i < numPoints; i++) {
    //     points.push(getRandomPointInPolygon(polygon));
    //   }

    //   return points;
    // },

    closePopup() {
      this.selectedLgaMarker = null;
      this.selectedMarker = null;

      if (this.viewingMap) {
        this.geoJson.resetStyle(this.viewingMap);
      }

      this.viewingMap = null;
      this.map.flyToBounds(this.geoJson, { duration: 0.2 });
    },

    markerEvent(e) {
      this.selectedLgaMarker = null;
      this.selectedMarker = e.target.options.icon.options.icData;
    },

    markerEventNational(e) {
      // this.selectedLgaMarker = null;
      this.selectedMarker = e.target.options.icon.options.icData;
      // console.log(this.selectedMarker);
    },

    // async createNationalDataPoints() {
    //   var that = this;
    //   let mpd = this.mapNationalData[this.view].data;
    //   this.currentSupports[this.view] = {};
    //   let layerGeoJson = {
    //     type: "FeatureCollection",
    //     features: [],
    //   };

    //   for (const state in mpd) {
    //     let lgaFacilities = that.facilities.filter((facility) => {
    //       return facility.state === state;
    //     });

    //     for (const lga in mpd[state]) {
    //       let lgaObj = mpd[state][lga];

    //       lgaObj.forEach(async (row) => {
    //         let bg = row.type_of_support_bg;

    //         let len = lgaFacilities.length;

    //         let randomIndex = Math.floor(Math.random() * len);
    //         let randFacility = lgaFacilities[randomIndex];
    //         let randGeo = randFacility.geometry;
    //         let mhtml = "";

    //         this.currentSupports[this.view][row.type_of_support] = {
    //           bg: bg,
    //           txt: row.type_of_support_txt,
    //         };

    //         if (row.status == "Ongoing") {
    //           mhtml = `
    //         <div class="shadow-sm w-3 h-3 rounded-full" style="background: ${bg};"></div>
    //         `;
    //         } else if (row.status == "Completed") {
    //           mhtml = `
    //         <div class="shadow-sm w-3 h-3" style="background: ${bg};"></div>
    //         `;
    //         } else {
    //           mhtml = `
    //         <b class="w-0 h-0
    //           border-l-[10px] border-l-transparent
    //           border-b-[15px] border-b-[${bg}]
    //           border-r-[10px] border-r-transparent">
    //         </b>
    //         `;
    //         }

    //         layerGeoJson.features.push({
    //           type: "Feature",
    //           properties: {
    //             state: state,
    //             // lga: lga,
    //             program_area: row.program_area,
    //             partner: row.partner,
    //             type_of_support: row.type_of_support,
    //             cso_support: row.cso_support,
    //             start_date: row.start_date,
    //             end_date: row.end_date,
    //             status: row.status,
    //             duration_in_months: row.duration_in_months,
    //             remaining_months: row.remaining_months,
    //             html: mhtml,
    //           },
    //           geometry: randGeo,
    //         });

    //         if (that.markerGeoJson) {
    //           this.markerGeoJson.clearLayers();
    //         }

    //         // that.markerGeoJson = L.geoJSON(layerGeoJson, {
    //         //   pointToLayer: function(feature, latlng) {
    //         //     return L.marker(latlng, {
    //         //       icon: L.divIcon({
    //         //         className: 'facilities-marker',
    //         //         html: feature.properties.html,
    //         //         popupAnchor: [0, 200]
    //         //       })
    //         //     }).on('click', that.markerEvent);
    //         //   }
    //         // });

    //         // that.markerGeoJson.addTo(that.mapMarkers);

    //         // that.mapMarkers
    //         // that.mapMarkers.addTo(that.map);
    //         // .addTo(that.map);

    //         // layerGeoJson.features.forEach(function (feature) {
    //         //   var coordinates = feature.geometry.coordinates.reverse(); // Leaflet expects [lat, lng], GeoJSON provides [lng, lat]
    //         //   var mkr = L.marker(coordinates);
    //         //   // that.natonalMapMarkers.addLayer(mkr); // Add marker to the layer group
    //         // });
    //       });
    //     }
    //     // this.mapMarkers.addTo(this.map);
    //   }
    // },

    // async createDataPoints() {
    //   var that = this;
    //   let mpd = this.mapData[this.view].data;
    //   this.currentSupports[this.view] = {};
    //   let layerGeoJson = {
    //     type: "FeatureCollection",
    //     features: [],
    //   };

    //   for (const state in mpd) {
    //     let stateObj = mpd[state];
    //     // let stateInfo = await this.getValFromData(
    //     //   this.states, 'state', state
    //     // );
    //     if (this.selectedState) {
    //       for (const lga in stateObj) {
    //         let lgaObj = stateObj[lga];
    //         let lgaFacilities = that.facilities.filter(
    //           (facility) => facility.lga === lga
    //         );

    //         lgaObj.forEach(async (row) => {
    //           // console.log(row);
    //           let bg = row.type_of_support_bg;
    //           // let bg = await that.getValFromData(that.supportTypes, 'name', row.type_of_support).bg;

    //           let len = lgaFacilities.length;
    //           let randomIndex = Math.floor(Math.random() * len);
    //           let randFacility = lgaFacilities[randomIndex];
    //           let randGeo = randFacility.geometry;
    //           let mhtml = "";

    //           this.currentSupports[this.view][row.type_of_support] = {
    //             bg: bg,
    //             txt: row.type_of_support_txt,
    //           };

    //           if (row.status == "Ongoing") {
    //             mhtml = `
    //             <div class="shadow-sm w-3 h-3 rounded-full" style="background: ${bg};"></div>
    //             `;
    //           } else if (row.status == "Completed") {
    //             mhtml = `
    //             <div class="shadow-sm w-3 h-3" style="background: ${bg};"></div>
    //             `;
    //           } else {
    //             mhtml = `
    //             <b class="w-0 h-0
    //               border-l-[10px] border-l-transparent
    //               border-b-[15px] border-b-[${bg}]
    //               border-r-[10px] border-r-transparent">
    //             </b>
    //             `;
    //           }

    //           layerGeoJson.features.push({
    //             type: "Feature",
    //             properties: {
    //               state: state,
    //               lga: lga,
    //               program_area: row.program_area,
    //               partner: row.partner,
    //               type_of_support: row.type_of_support,
    //               cso_support: row.cso_support,
    //               start_date: row.start_date,
    //               end_date: row.end_date,
    //               status: row.status,
    //               duration_in_months: row.duration_in_months,
    //               remaining_months: row.remaining_months,
    //               html: mhtml,
    //             },
    //             geometry: randGeo,
    //           });

    //           if (that.markerGeoJson) {
    //             this.markerGeoJson.clearLayers();
    //           }

    //           // that.markerGeoJson = L.geoJSON(layerGeoJson, {
    //           //   pointToLayer: function(feature, latlng) {
    //           //     return L.marker(latlng, {
    //           //       icon: L.divIcon({
    //           //         className: 'facilities-marker',
    //           //         html: feature.properties.html,
    //           //         popupAnchor: [0, 200]
    //           //       })
    //           //     }).on('click', that.markerEvent);
    //           //   }
    //           // });

    //           // that.markerGeoJson.addTo(that.mapMarkers);

    //           // that.mapMarkers
    //           // that.mapMarkers.addTo(that.map);
    //           // .addTo(that.map);

    //           layerGeoJson.features.forEach(function (feature) {
    //             var coordinates = feature.geometry.coordinates.reverse(); // Leaflet expects [lat, lng], GeoJSON provides [lng, lat]
    //             var mkr = L.marker(coordinates);
    //             that.mapMarkers.addLayer(mkr); // Add marker to the layer group
    //           });
    //         });
    //       }
    //     }

    //     // this.mapMarkers.addTo(this.map);
    //   }

    //   // for (let i = 0; i < numPoints; i++) {
    //   // let randomLat = geometryData.coordinates[0][0][1] + (geometryData.coordinates[0][2][1] - geometryData.coordinates[0][0][1]) * Math.random();
    //   // let randomLng = geometryData.coordinates[0][0][0] + (geometryData.coordinates[0][2][0] - geometryData.coordinates[0][0][0]) * Math.random();
    //   // let point = L.latLng(randomLat, randomLng);

    //   // Check if the point falls within the polygon
    //   // if (polygon.getBounds().contains(point)) {
    //   //     dataPoints.push({
    //   //         latlng: point,
    //   //         popupText: 'Data Point ' + (i + 1)
    //   //     });
    //   // }
    //   // }

    //   // return dataPoints;
    // },

    // async loadGeoData() {
    //   if (this.selectedState[this.view]) {
    //     this.mapFit = 8;
    //     this.loadMapGeometry(this.lgas);
    //   }
    // },

    // resetlgaMapHighlight(e) {
    //   this.geoJson.resetStyle(e.target);
    //   this.mapInfo.update();
    // },

    // onEachMapFeature(feature, layer) {
    //   layer.on({
    //     mouseover: this.highlightMapFeature,
    //     mouseout: this.resetMapHighlight,
    //     click: this.zoomToMapFeature,
    //   });

    //   let bounds = layer.getBounds().getCenter();
    //   let icon = L.divIcon({
    //     iconSize: null,
    //     iconAnchor: [25, 10],
    //     // working... progress
    //     // html: `<small class="ml-1 mr-1 bg-[#292b4267] font-mono font-thin" id="layer-name-label">
    //     //   ${
    //     //     feature.properties.State
    //     //       ? feature.properties.State
    //     //       : feature.properties.LGA
    //     //   }
    //     // </small>`,
    //   });

    //   // L.marker(bounds, { icon: icon }).addTo(this.mapMarkers);
    //   // this.mapMarkers.addTo(this.map);
    //   this.mapMarker = L.marker(bounds, { icon: icon });
    //   this.mapMarker.addTo(this.map);

    //   if (this.selectedState[this.view]) {
    //     let st = this.selectedState[this.view];
    //     let lg = feature.properties.LGA;
    //     let mpDt = null;

    //     if (this.mapData[this.view].data[st]) {
    //       mpDt = this.mapData[this.view].data[st][lg];
    //     }

    //     if (mpDt) {
    //       let lgaFclts = this.facilities.filter((fc) => fc.lga === lg);

    //       let fcLen = lgaFclts.length;
    //       mpDt.forEach((d) => {
    //         let randomIndex = Math.floor(Math.random() * fcLen);
    //         let randFacility = lgaFclts[randomIndex];

    //         let randGeo = randFacility.geometry;
    //         let cords = randGeo.coordinates.reverse();
    //         let mhtml = "";
    //         let bg = d.type_of_support_bg;

    //         this.currentSupports[this.view][d.type_of_support] = {
    //           bg: bg,
    //           txt: d.type_of_support_txt,
    //         };

    //         if (d.status == "Ongoing") {
    //           mhtml = `
    //           <div class="shadow-sm w-3 h-3 rounded-full" style="background: ${bg};"></div>
    //           `;
    //         } else if (d.status == "Completed") {
    //           mhtml = `
    //           <div class="shadow-sm w-3 h-3" style="background: ${bg};"></div>
    //           `;
    //         } else {
    //           mhtml = `
    //           <b class="w-0 h-0
    //             border-l-[10px] border-l-transparent
    //             border-b-[15px] border-b-[${bg}]
    //             border-r-[10px] border-r-transparent">
    //           </b>
    //           `;
    //         }

    //         let iconData = {
    //           lga: lg,
    //           type_of_support: d.type_of_support,
    //           partner: d.partner,
    //           program_area: d.program_area,
    //           status: d.status,
    //           start_date: d.start_date,
    //           end_date: d.end_date,
    //           summary_of_support: d.summary_of_support,
    //         };

    //         let icon = L.divIcon({
    //           className: "facilities-marker",
    //           icData: iconData,
    //           html: mhtml,
    //           popupAnchor: [0, 200],
    //         });

    //         // L.geoJSON(layerGeoJson, {
    //         //   pointToLayer: function(feature, latlng) {
    //         //     return L.marker(latlng, {
    //         //       icon:
    //         //     }).on('click', that.markerEvent);
    //         //   }
    //         // });

    //         L.marker(cords, { icon: icon })
    //           .addTo(this.map)
    //           .on("click", this.markerEvent);

    //         // var distance = this.getDistanceFromLatLonInKm(
    //         //   cords[0], cords[1], bounds.lat, bounds.lng
    //         // );
    //       });
    //     }
    //   }
    // },

    // filterByState(data, stateParam) {
    //   // const filtered = data.filter(
    //   //   (item) =>
    //   //     item.States_supported &&
    //   //     item.States_supported.some(
    //   //       (stateObj) => stateObj.state === stateParam
    //   //     )
    //   // );

    //   // return {
    //   //   [stateParam]: filtered,
    //   // };
    //   return data.filter(
    //     (item) =>
    //       item.States_supported &&
    //       item.States_supported.some(
    //         (stateObj) => stateObj.state === stateParam
    //       )
    //   );
    // },

    async getRandStateFacilities(state, limit) {
      const recName = `${state}-${limit}`;
      let fcs = await this.getLoc(recName);
      if (fcs) {
        return fcs;
      } else {
        await axios
          .get(`${pbUrl}/api/rand/state/facilities/${state}/${limit}`)
          .then(async (r) => {
            await this.setLoc(recName, r.data);
          });
        fcs = await this.getLoc(recName);
        return fcs;
      }
    },

    // async checkNigerianGeo(point) {
    //   const geoJsonPolygon = {
    //     type: "Polygon",
    //     coordinates: [
    //       [
    //         [8.500288, 4.771983],
    //         [7.462108, 4.412108],
    //         [7.082596, 4.464689],
    //         [6.698072, 4.240594],
    //         [5.898173, 4.262453],
    //         [5.362805, 4.887971],
    //         [5.033574, 5.611802],
    //         [4.325607, 6.270651],
    //         [3.57418, 6.2583],
    //         [2.691702, 6.258817],
    //         [2.749063, 7.870734],
    //         [2.723793, 8.506845],
    //         [2.912308, 9.137608],
    //         [3.220352, 9.444153],
    //         [3.705438, 10.06321],
    //         [3.60007, 10.332186],
    //         [3.797112, 10.734746],
    //         [3.572216, 11.327939],
    //         [3.61118, 11.660167],
    //         [3.680634, 12.552903],
    //         [3.967283, 12.956109],
    //         [4.107946, 13.531216],
    //         [4.368344, 13.747482],
    //         [5.443058, 13.865924],
    //         [6.445426, 13.492768],
    //         [6.820442, 13.115091],
    //         [7.330747, 13.098038],
    //         [7.804671, 13.343527],
    //         [9.014933, 12.826659],
    //         [9.524928, 12.851102],
    //         [10.114814, 13.277252],
    //         [10.701032, 13.246918],
    //         [10.989593, 13.387323],
    //         [11.527803, 13.32898],
    //         [12.302071, 13.037189],
    //         [13.083987, 13.596147],
    //         [13.318702, 13.556356],
    //         [13.995353, 12.461565],
    //         [14.181336, 12.483657],
    //         [14.577178, 12.085361],
    //         [14.468192, 11.904752],
    //         [14.415379, 11.572369],
    //         [13.57295, 10.798566],
    //         [13.308676, 10.160362],
    //         [13.1676, 9.640626],
    //         [12.955468, 9.417772],
    //         [12.753672, 8.717763],
    //         [12.218872, 8.305824],
    //         [12.063946, 7.799808],
    //         [11.839309, 7.397042],
    //         [11.745774, 6.981383],
    //         [11.058788, 6.644427],
    //         [10.497375, 7.055358],
    //         [10.118277, 7.03877],
    //         [9.522706, 6.453482],
    //         [9.233163, 6.444491],
    //         [8.757533, 5.479666],
    //         [8.500288, 4.771983],
    //       ],
    //     ],
    //   };

    //   // Ensure the input is a valid polygon
    //   if (
    //     !geoJsonPolygon ||
    //     geoJsonPolygon.type !== "Polygon" ||
    //     !geoJsonPolygon.coordinates ||
    //     geoJsonPolygon.coordinates.length === 0
    //   ) {
    //     console.error("Invalid GeoJSON Polygon object provided.");
    //     return false;
    //   }

    //   const x = point[0]; // longitude
    //   const y = point[1]; // latitude

    //   // The exterior ring of the polygon
    //   const vs = geoJsonPolygon.coordinates[0];

    //   let isInside = false;
    //   for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    //     const xi = vs[i][0],
    //       yi = vs[i][1];
    //     const xj = vs[j][0],
    //       yj = vs[j][1];

    //     // Check if the horizontal ray from the point intersects with the edge (i, j)
    //     const intersect =
    //       yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    //     if (intersect) {
    //       isInside = !isInside;
    //     }
    //   }

    //   return isInside;
    // },

    statusIconHTML(Status_of_support) {
      let mhtml = "";
      if (Status_of_support == "In Progress") {
        mhtml = `
            <div class="shadow-sm w-3 h-3 rounded-full bg-yellow-300"></div>
            `;
      } else if (Status_of_support == "Completed") {
        mhtml = `
            <div class="shadow-sm w-3 h-3 bg-green-300"></div>
            `;
      } else {
        mhtml = `
            <b class="w-0 h-0
              border-l-[6px] border-l-transparent
              border-b-[12px] border-red-300
              border-r-[6px] border-r-transparent">
            </b>
            `;
      }
      return mhtml;
    },

    async onEachNationalMapFeature(feature, layer) {
      layer.on({
        mouseover: this.highlightNationalMapFeature,
        mouseout: this.resetMapHighlight,
        click: this.zoomToMapFeatureNational,
      });

      let bounds = layer.getBounds().getCenter();

      let icon = L.divIcon({
        iconSize: null,
        iconAnchor: [25, 10],
        html: `<small class="ml-1 mr-1 bg-[#9298d467] font-mono font-thin" id="layer-name-label">
          ${
            feature.properties.state
              ? feature.properties.state
              : feature.properties.LGA
          }
        </small>`,
      });
      L.marker(bounds, { icon: icon }).addTo(this.natonalMapMarkers);
      // this.natonalMapMarkers.addLayer();
      // this.natonalMapMarkers.addTo(this.map);

      let st = feature.properties.state;
      if (this.selectedState[this.view].includes(st)) {
        // let lgaFclts = this.facilities.filter((fc) => fc.state === st);
        let lgaFclts = await this.getRandStateFacilities(
          st,
          this.mapNationalData[this.view].length
        );

        for (
          let stIdx = 0;
          stIdx < this.mapNationalData[this.view].length;
          stIdx++
        ) {
          const mpData = this.mapNationalData[this.view][stIdx];

          if (
            mpData.States_supported.some((stateObj) => stateObj.state === st)
          ) {
            let randomIndex = Math.floor(Math.random() * lgaFclts.length);
            let randFacility = lgaFclts[randomIndex];

            let cords = [
              randFacility.geometry.coordinates[1],
              randFacility.geometry.coordinates[0],
            ];

            let mhtml = "";
            mpData.Type_of_Support.forEach((tp) => {
              let spt = this.supportTypes.find(
                (item) => item.name === tp.support_type
              );
              if (spt) {
                this.currentSupports[this.view][spt.name] = {
                  bg: spt.bg,
                  txt: spt.txt,
                };
              }
            });

            let icon = L.divIcon({
              className: "facilities-marker",
              icData: mpData,
              html: this.statusIconHTML(mpData.Status_of_support),
              popupAnchor: [0, 200],
            });

            L.marker(cords, { icon: icon, autoPan: true, autoPanOnFocus: true })
              .addTo(this.natonalMapMarkers)
              .on("click", this.markerEventNational);
          }
        }
      }
    },

    async getRandLgaFacilities(state, lga, limit) {
      const recName = `${state}-${lga}-${limit}`;
      let fcs = await this.getLoc(recName);
      if (fcs) {
        return fcs;
      } else {
        let filt = { state: state, lga: lga, limit: limit };
        await axios
          .post(`${pbUrl}/api/rand/lga/facilities`, filt)
          .then(async (r) => {
            await this.setLoc(recName, r.data);
          });
        fcs = await this.getLoc(recName);
        return fcs;
      }
    },

    async onEachLGAsMapFeature(feature, layer) {
      layer.on({
        mouseover: this.highlightNationalMapFeature,
        mouseout: this.resetMapHighlight,
        // click: this.zoomToMapFeatureNational,
      });

      let bounds = layer.getBounds().getCenter();

      let icon = L.divIcon({
        iconSize: null,
        iconAnchor: [25, 10],

        html: `<small class="ml-1 mr-1 bg-[#9298d467] font-mono font-thin" id="layer-name-label">
          ${feature.properties.lga}
        </small>`,
      });

      L.marker(bounds, { icon: icon }).addTo(this.lgasMapMarkers);

      // this.lgasMapMarkers.addLayer(L.marker(bounds, { icon: icon }));
      // this.lgasMapMarkers.addTo(this.map);

      let st = feature.properties.state;
      let lg = feature.properties.lga;

      if (this.selectedState[this.view].includes(st)) {
        // let lgaFclts = this.facilities.filter((fc) => fc.state === st);
        let lgaFclts = await this.getRandLgaFacilities(
          st,
          lg,
          this.mapLgaData[this.view].length
        );

        for (
          let stIdx = 0;
          stIdx < this.mapLgaData[this.view].length;
          stIdx++
        ) {
          const mpData = this.mapLgaData[this.view][stIdx];
          console.log("lgassp: ", mpData.LGA_supported);
          if (mpData.LGA_supported.some((lgaObj) => lgaObj.lga === lg)) {
            console.log("lgaMpData: ", mpData);
            let randomIndex = Math.floor(Math.random() * lgaFclts.length);
            let randFacility = lgaFclts[randomIndex];

            let cords = [
              randFacility.geometry.coordinates[1],
              randFacility.geometry.coordinates[0],
            ];

            let mhtml = "";

            let icon = L.divIcon({
              className: "facilities-marker",
              icData: mpData,
              html: this.statusIconHTML(mpData.Status_of_support),
              popupAnchor: [0, 200],
            });

            L.marker(cords, {
              icon: icon,
              autoPan: true,
              autoPanOnFocus: true,
            })
              .addTo(this.lgasMapMarkers)
              .on("click", this.markerEventNational);
          }
        }
      }
    },

    createNationalMap() {
      var mapContainerParent = this.mapContainerRef.parentNode;
      var mapContainer = this.mapContainerRef;

      mapContainerParent.removeChild(this.mapContainerRef);
      mapContainerParent.appendChild(mapContainer);

      this.currentSupports[this.view] = {};

      if (this.map) {
        this.map.remove();
        mapContainer.innerHTML = "";
      }

      this.map = L.map(mapContainer, {
        zoomSnap: 0.2,
      });

      this.map.scrollWheelZoom.disable();
      this.map.keyboard.disable();
      this.mapInfo.update = this.mapInfoOnUpdate;
      this.natonalMapMarkers = L.layerGroup().addTo(this.map);

      this.geoJson = L.geoJson(this.mapGeoData, {
        style: this.layerStyle,
        onEachFeature: this.onEachNationalMapFeature,
      }).addTo(this.map);

      this.fitBounds(this.geoJson);
      this.map.setMaxBounds(this.geoJson.getBounds());
    },

    createLGAsMap() {
      var mapContainerParent = this.mapContainerRef.parentNode;
      var mapContainer = this.mapContainerRef;

      mapContainerParent.removeChild(this.mapContainerRef);
      mapContainerParent.appendChild(mapContainer);

      // this.currentSupports[this.view] = {};

      // if (this.map) {
      //   this.map.remove();
      //   mapContainer.innerHTML = "";
      // }
      // this.map = L.map(mapContainer, {
      //   zoomSnap: 0.2,
      // });

      // this.map.scrollWheelZoom.disable();
      // this.map.keyboard.disable();
      // this.mapInfo.update = this.mapInfoOnUpdate;
      // this.natonalMapMarkers = L.layerGroup();

      if (this.lgasMapMarkers) {
        // this.lgasMapMarkers.clearLayers();
        this.map.removeLayer(this.lgasMapMarkers);
      }

      // if (this.lgaDotMarkers) {
      //   this.map.removeLayer(this.lgaDotMarkers);
      // }

      // if (this.natonalMapMarkers) {
      //   // this.natonalMapMarkers.clearLayers();
      //   this.map.removeLayer(this.natonalMapMarkers);
      // }

      this.lgasMapMarkers = L.layerGroup().addTo(this.map);
      // this.lgaDotMarkers = L.layerGroup();

      // this.lgasMapMarkers.addTo(this.map);
      // this.lgaDotMarkers.addTo(this.map);

      if (this.lgaGeoJson) {
        this.map.removeLayer(this.lgaGeoJson);
      }

      this.lgaGeoJson = L.geoJson(this.mapGeoDataLga, {
        style: this.layerStyle,
        onEachFeature: this.onEachLGAsMapFeature,
      }).addTo(this.map);

      // this.fitBounds(this.geoJson);
      let lgasBounds = this.lgaGeoJson.getBounds();
      this.map.fitBounds(lgasBounds);
      this.map.setMaxBounds(lgasBounds);
    },

    // createLGAsMap() {
    //   var mapLgaContainerParent = this.mapContainerLGARef.parentNode;
    //   var mapLgaContainer = this.mapContainerLGARef;

    //   mapLgaContainerParent.removeChild(this.mapContainerLGARef);
    //   mapLgaContainerParent.appendChild(mapLgaContainer);

    //   if (this.lgaMap) {
    //     this.lgaMap.remove();
    //     mapLgaContainer.innerHTML = "";
    //   }

    //   this.currentSupports[this.view] = {};

    //   this.lgaMap = L.map(mapLgaContainer, {
    //     zoomSnap: 0.2,
    //   });

    //   this.lgaMap.scrollWheelZoom.disable();
    //   this.lgaMap.keyboard.disable();
    //   this.mapInfo.update = this.mapInfoOnUpdate;
    //   this.lgasMapMarkers = L.layerGroup();

    //   this.lgaGeoJson = L.geoJson(this.mapGeoDataLga, {
    //     style: this.layerStyle,
    //     onEachFeature: this.onEachLGAsMapFeature,
    //   }).addTo(this.lgaMap);

    //   this.fitBounds(this.lgaGeoJson);
    //   this.lgaMap.setMaxBounds(this.lgaGeoJson.getBounds());
    // },
  },
});
