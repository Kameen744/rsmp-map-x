<template>
  <div v-show="view == 'ptins'" class="relative">
    <div class="min-h-[98vh] max-h-[98vh] p-8">
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr class="text-lg">
              <th>Partner</th>
              <th>Campaign Focus</th>
              <th>Type of Support</th>
              <th>Thematic Areas</th>
              <th>No. of States</th>
              <th>No. of LGAs</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(records, partnerName) in partnerSummaryData"
              :key="partnerName"
            >
              <template v-for="(record, index) in records" :key="index">
                <tr>
                  <td :rowspan="records.length" v-if="index === 0">{{
                    record.Name_of_Organization_Agency
                  }}</td>
                  <td>
                    <ul>
                      <li
                        class="bg-slate-200 p-2"
                        v-for="campaign in record.Campaign_Focus"
                        :key="campaign"
                        >{{ campaign }}</li
                      >
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li
                        class="bg-slate-200 p-2"
                        v-for="support in record.Type_of_Support"
                        :key="support.support_type"
                      >
                        {{ support.support_type }}

                        <small
                          class="bg-slate-100 text-xs rounded-md p-1"
                          v-if="support.personnel_deployed"
                        >
                          (deployed {{ support.number_of_personnel }} personnel)
                        </small>
                      </li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li
                        v-for="area in record.Thematic_areas_supported"
                        :key="area.area"
                      >
                        {{ area.area }}:
                        <small v-if="area.sub_areas.length">
                          {{ area.sub_areas.join(", ") }}
                        </small>
                      </li>
                    </ul>
                  </td>
                  <td>{{ record.States_supported.length }}</td>
                  <td>{{ record.LGA_supported.length }}</td>
                  <td>{{ statusNameChange(record.Status_of_support) }}</td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import moment from "moment";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";

const store = useMainStore();
const {
  createChartData,
  getChartJsOptions,
  chartDataKeys,
  chartMainContainerRef,
  mapData,
  view,
  cso,
  partnerSummaryData,
} = storeToRefs(store);

let expandedKey = ref("");

const expand = (key) => {
  if (expandedKey.value == key) {
    expandedKey.value = "";
  } else {
    expandedKey.value = key;
  }
};

const getStatusColor = (status) => {
  let cls = "";
  if (status == "In Progress") {
    cls = "bg-yellow-400";
  } else if (status == "Completed") {
    cls = "bg-green-400";
  } else if (status == "Pending") {
    cls = "bg-red-400";
  }
  return cls;
};

const getDate = (dt) => {
  return moment(dt, "YYYYMMDD").format("MMMM Do YYYY");
};

const statusNameChange = (status) => {
  if (status == "In Progress") {
    return "Ongoing";
  }
  return status;
};
</script>
<style scoped>
.data-table-container {
  overflow-x: auto;
  padding: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: sans-serif;
  color: #333;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.data-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tbody tr:hover {
  background-color: #f1f1f1;
}

.data-table ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.data-table li {
  margin-bottom: 4px;
}

/* .data-table td:first-child {
  font-weight: bold;
  background-color: #e6f7ff;
} */
</style>
