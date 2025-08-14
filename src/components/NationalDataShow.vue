<template>
  <div>
    <div class="bg-orange-400 min-w-full p-4 flex justify-between">
      <h2 class="pt-1">National Supports</h2>
      <div class="ml-2">
        <input
          class="input-sm rounded-md border-none"
          placeholder="Search by organization"
          type="text"
          v-model="searchTerm"
        />
      </div>
      <button class="btn btn-square btn-xs mt-1" @click="closeNationalData"
        ><svg
          class="w-6 h-6 text-gray-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18 17.94 6M18 18 6.06 6"
          />
        </svg>
      </button>
    </div>

    <div class="min-w-[50vw] p-4 max-h-[67vh] overflow-y-auto">
      <div v-for="data in filteredNationalData">
        <div
          class="bg-slate-100 rounded-md p-3 mt-3 cursor-pointer"
          @click="selectedMarker = data"
        >
          <h4
            ><strong>{{ data.Name_of_Organization_Agency }}</strong></h4
          >
          <div class="flex justify-end">
            <small>
              {{ store.formatDate(data.Start_date_of_support) }} -
              {{ store.formatDate(data.End_date_of_support) }}
            </small>
          </div>

          <ul class="list-inside">
            <li class="mt-1 flex">
              <strong>Type: </strong>
              <div class="ml-1 flex">
                <small
                  class="p-1 ml-1 bg-orange-100 rounded-lg"
                  v-for="type in data.Type_of_Support"
                  >{{ type.support_type }}</small
                >
              </div>
            </li>
            <li class="mt-1">
              <strong>Thematic Area: </strong>
              <ul class="ml-1 list-outside pl-3 list-disc">
                <li
                  class="p-1 ml-1 mt-1 bg-blue-100 rounded-lg"
                  v-for="area in data.Thematic_areas_supported"
                  >{{ area.area }}</li
                >
              </ul>
            </li>
            <li class="mt-1"
              ><strong>Funder: </strong>
              {{ data.Who_is_the_Funder_of_your_project }}</li
            >
          </ul>
        </div>
        <div class="divider"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
const store = useMainStore();
const {
  nationalMapDataToShow,
  showNationalData,
  selectedData,
  selectedMarker,
  mapType,
} = storeToRefs(store);

const searchTerm = ref("");
const closeNationalData = () => {
  showNationalData.value = !showNationalData.value;
  if (mapType.value == "states") {
    selectedData.value = "State";
  } else if (mapType.value == "lgas") {
    selectedData.value = "LGA";
  }
};

const filteredNationalData = computed(() => {
  if (!searchTerm.value) {
    return nationalMapDataToShow.value;
  }

  return nationalMapDataToShow.value.filter((d) =>
    d.Name_of_Organization_Agency.toLowerCase().includes(
      searchTerm.value.toLowerCase()
    )
  );
});
</script>
