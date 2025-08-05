<template>
  <template class="min-[3rem]: flex justify-start">
    <div class="dropdown dropdown-bottom">
      <SelectBadge
        title="Status"
        v-if="selectedStatus[view].length > 0"
      ></SelectBadge>
      <div
        tabindex="0"
        role="button"
        class="inline-flex justify-between shadow-sm p-3 m-1 pl-3 text-lg py-1 rounded-md border-2 border-rsmp-sec min-w-36"
      >
        <div class="inline-flex max-w-28 overflow-hidden">
          <div v-if="selectedStatus[view].length <= 0" class="text-nowrap">
            Status
          </div>
          <div
            v-else
            class="text-nowrap"
            v-for="status in selectedStatus[view].slice(-2)"
          >
            {{ statusNameChange(status) }}
          </div>
        </div>
        <b
          class="ml-4 w-8 h-8 rounded-full bg-blue-200 text-center text-xs text-blue-900"
        >
          <CheckPlusIcon></CheckPlusIcon>
        </b>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content z-[99999] menu p-2 shadow-lg bg-base-100 rounded-none max-h-[70vh] grid overflow-x-auto border-2 border-rsmp-sec"
      >
        <li
          class="rounded-none border-b-2 border-blue-50"
          v-for="status in statusOptions"
          :class="
            store.selected(selectedStatus[view], status) ? 'bg-blue-300' : ''
          "
        >
          <a
            href=""
            @click.prevent="Selectstatus(status)"
            class="hover:rounded-none text-lg inline-flex justify-between"
          >
            <span>{{ statusNameChange(status) }}</span>
            <b
              class="w-8 h-8 rounded-full pr-1 bg-blue-200 text-center text-xs text-blue-900"
            >
              <CheckIcon
                v-if="
                  selectedStatus[view] && selectedStatus[view].includes(status)
                "
              ></CheckIcon>
              <CloseIcon v-else></CloseIcon>
            </b>
          </a>
        </li>
      </ul>
    </div>
  </template>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
import SelectBadge from "./SelectBadge.vue";
import CheckPlusIcon from "./CheckPlusIcon.vue";
import CheckIcon from "./CheckIcon.vue";
import CloseIcon from "./CloseIcon.vue";
const store = useMainStore();
const statusOptions = ["Pending", "In Progress", "Completed"];
const { selectedStatus, view, selected } = storeToRefs(store);
const statusNameChange = (status) => {
  if (status == "In Progress") {
    return "Ongoing";
  }
  return status;
};

const Selectstatus = (status) => {
  let spt = selectedStatus.value[view.value];
  if (!spt.includes(status)) {
    selectedStatus.value[view.value].push(status);
  } else {
    selectedStatus.value[view.value] = spt.filter((item) => item !== status);
  }
  // console.log(selectedStatus.value[view.value]);
  store.updateApp();
};
</script>
