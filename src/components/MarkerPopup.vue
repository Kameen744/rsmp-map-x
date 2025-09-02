<template>
  <div
    class="z-[9999] fixed top-[11vh] max-h-[90vh] min-w-[500px] max-w-[500px] right-2 flex bg-transparent p-0 overflow-x-auto"
  >
  
    <div class="max-w-5xl mx-auto p-4">
      <div class="bg-white shadow-lg rounded-xl p-6 space-y-6">
        <b
        @click="store.closePopup"
        class="z-[99] cursor-pointer absolute top-[10px] right-[10px] shadow-lg hover:bg-slate-200 ml-4 w-8 h-8 rounded-full bg-blue-200 text-center text-xs text-blue-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mt-1 ml-1 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </b>
        <!-- Respondent Info -->
        <!-- <div>
          <h2 class="text-xl font-semibold mb-2">Respondent Info</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <p><span class="font-medium">Name:</span> Obiora Ezebilo</p>
            <p
              ><span class="font-medium">Designation:</span> Health
              Specialist</p
            >
            <p><span class="font-medium">Phone:</span> 08036766888</p>
            <p><span class="font-medium">Email:</span> oezebilo@unicef.org</p>
            
            <p
              ><span class="font-medium">Organization:</span>
              {{ selectedMarker.Name_of_Organization_Agency }}</p
            >
            <p
              ><span class="font-medium">Type:</span
              >{{ selectedMarker.Type_of_Organization_Agency[0] }}</p
            >
          </div>
        </div> -->

        <!-- Support Info -->
        <div>
          <h2 class="text-xl font-semibold mb-2">Support Info</h2>
          <hr />
          <div class="grid sm:grid-cols-2 gap-4">
            <p
              ><span class="font-medium">Organization: </span>
              {{ selectedMarker.Name_of_Organization_Agency }}</p
            >
            <p
              ><span class="font-medium">Type: </span
              >{{ selectedMarker.Type_of_Organization_Agency[0] }}</p
            >
            <p
              ><span class="font-medium">Start Date: </span>
              {{ store.formatDate(selectedMarker.Start_date_of_support) }}</p
            >
            <p
              ><span class="font-medium">End Date: </span>
              {{ store.formatDate(selectedMarker.End_date_of_support) }}</p
            >
            <p
              ><span class="font-medium">Status: </span
              >{{ statusNameChange(selectedMarker.Status_of_support) }}</p
            >
            <p
              ><span class="font-medium"
                >Collaborating with other partners:
              </span>
              {{
                selectedMarker.Are_you_collaborating_with_any_other_partners
              }}</p
            >
            <p
              ><span class="font-medium">Funder: </span
              >{{ selectedMarker.Who_is_the_Funder_of_your_project }}</p
            >
          </div>
        </div>

        <!-- Campaign Focus -->
        <div>
          <h2 class="text-xl font-semibold mb-2">Campaign Focus</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="focus in selectedMarker.Campaign_Focus"
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >{{ focus }}</span
            >
          </div>
        </div>

        <!-- Summary -->
        <div>
          <h2 class="text-xl font-semibold mb-2">Summary of Support</h2>
          <p class="text-gray-700">
            <!-- {{ limtString(selectedMarker.Summary_of_Support, 300) }} -->
              {{ selectedMarker.Summary_of_Support }}
          </p>
        </div>

        <!-- Partners -->
        <div>
          <h2 class="text-xl font-semibold mb-2">List of Partners</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <!-- Repeat below for each partner -->
            <span
              v-for="patner in selectedMarker.List_the_Partners"
              class="text-sm bg-gray-100 px-3 py-1 rounded-md"
            >
              {{ patner }}
            </span>
          </div>
        </div>

        <!-- States Supported -->
        <div>
          <h2 class="text-xl font-semibold mb-2">States Supported</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="state in selectedMarker.States_supported"
              class="text-sm bg-green-100 text-green-700 px-2 py-1 rounded"
              >{{ state.state }}</span
            >
          </div>
        </div>

        <div class="">
          <!-- {{ selectedMarker.LGA_supported }} -->
          <h2 class="text-xl font-semibold mb-2">LGA's Supported</h2>
          <div class="flex flex-wrap gap-2">
            <template v-for="(lga, index) in selectedMarker.LGA_supported">
              <template v-if="index === 0 || lga.state != selectedMarker.LGA_supported[index - 1].state">
              <div class=" w-full bg-slate-50" v-if="lga.lga">
                <strong>{{ lga.state }}</strong>
              </div>

              <div v-else class="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                {{ lga.lga }}
              </div>
              </template>

              <div v-else class="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                {{ lga.lga }}
              </div>
            </template>
            
          </div>

          <!-- <div class="" v-for="(lga, index) in selectedMarker.LGA_supported">
          
            <h3 
              v-if="index === 0 || lga.state !== selectedMarker.LGA_supported[index - 1].state" 
              class="font-semibold text-gray-700 mb-1 block bg-slate-50 text-center"
            >
              {{ lga.state }}
            </h3>

            <span 
              class="text-sm bg-green-100 text-green-700 px-2 rounded"
            >
              {{ lga.lga }}
            </span>
          </div> -->
        </div>

        <!-- Thematic Areas -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Thematic Areas Supported</h2>
          <div class="space-y-4">
            <!-- Repeat for each thematic area -->
            <div
              v-for="area in selectedMarker.Thematic_areas_supported"
              class="bg-gray-50 rounded-md p-4"
            >
              <h3 class="font-semibold mb-2">{{ area.area }}</h3>
              <p class="text-sm mb-1"
                ><strong>Sub-areas:</strong>
                <div class="flex">
                  <span class="p-1 m-1 rounded-md bg-slate-200" v-for="sub in area.sub_areas">{{
                  sub
                }}</span>
                </div>
              </p>
              
              <p class="text-sm"
                ><strong>Support Levels:</strong>
                <div class="flex">
                  <span class="p-1 m-1 rounded-md bg-slate-200" v-for="level in area.support_level">{{
                  level
                }}</span>
                </div>
                </p
              >
              <p v-if="area.kpi != ''" class="text-sm"
                ><strong>KPI:</strong>{{ area.kpi }}</p
              >
            </div>
            <!-- ... repeat for other areas -->
          </div>
        </div>

        <!-- Type of Support -->
        <div>
          <h2 class="text-xl font-semibold mb-2">Type of Support</h2>
          <div class="space-y-1 text-sm text-gray-800">
            <div v-for="tps in selectedMarker.Type_of_Support">
              <p><strong>{{ tps.support_type }}</strong></p>
              <p v-if="tps?.number_of_personnel">
                Number of personel deployed:  {{ tps.number_of_personnel }}</p>

                <p v-if="tps?.organizations_funded">
                Organizations:  <div class="flex">
                  <span class="p-1 m-1 rounded-md bg-slate-200" v-for="org in tps.organizations_funded">{{
                  org
                }}</span>
                 
                </div>
              </p>

              <p v-if="tps?.commodities_supplied">
                Commodities Supplied:  <div class="flex">
                  <span class="p-1 m-1 rounded-md bg-slate-200" v-for="com in tps.commodities_supplied">{{
                  com
                }}</span>
                  
                </div>
              </p>

              
              <hr>
              <hr>
              
            </div>
            <!-- <li><strong>Funding:</strong> Gavi</li>
            <li><strong>Provision of Commodities:</strong> NA</li> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
const store = useMainStore();
const listOfSuports = ref(new Set());
const collapseKey = ref(null);
const expand = (key) => {
  if (collapseKey.value) {
    collapseKey.value = null;
  } else {
    collapseKey.value = key;
  }
};
const limtString = (txt, limit) => {
  if (txt.length > limit) {
    return txt.slice(0, limit) + "...";
  }
  return txt;
};
const statusNameChange = (status) => {
  if (status == "In Progress") {
    return "Ongoing";
  }
  return status;
};
const verifySpList = (spName) => {
  if (selectedLgaMarker.value.supports) {
    selectedLgaMarker.value.supports.forEach((sp) => {
      listOfSuports.value.add(sp.type_of_support);
    });
  }
  return listOfSuports.value;
};
const getSpBg = (spName) => {
  let sp = store.getValFromData(supportTypes.value, "name", spName);
  return sp.bg;
};
const { selectedMarker, selectedLgaMarker, supportTypes } = storeToRefs(store);
// onMounted(() => {
//   console.log(selectedMarker.value);
// });
</script>

<style scoped>
.flex-full {
  flex: 0 0 100%;
}
.left-panel {
  position: absolute;
  width: 560px;
  height: 1078px;
  right: 0px;
  top: 0px;

  background: #f5f5f5;
  border-radius: 8px 0px 0px 8px;
}
.left-panel-header {
  /* Frame 2147225925 */

  /* Auto layout */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  gap: 24px;

  position: absolute;
  width: 560px;
  height: 76px;
  left: 0px;
  top: 0px;

  background: #ee7422;
}
</style>
