<template>
  <template class="min-[3rem]: flex justify-start">
    <div class="relative dropdown dropdown-bottom">
      <SelectBadge
        title="Partners"
        v-if="selectedPartners[view].length > 0"
      ></SelectBadge>
      <div
        tabindex="0"
        role="button"
        class="inline-flex justify-between shadow-sm p-3 m-1 pl-3 text-lg py-1 rounded-md border-2 border-rsmp-sec min-w-36"
      >
        <div class="inline-flex max-w-28 overflow-hidden">
          <div v-if="selectedPartners[view].length <= 0" class="text-nowrap">
            Partners
          </div>
          <div v-else class="text-nowrap">
            {{ selectedPartners[view].length }} Selected
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
        class="dropdown-content z-[99999] menu p-2 shadow-lg bg-base-100 max-h-[70vh] grid overflow-x-auto border-2 border-rsmp-sec rounded-md"
      >
        <li class="rounded-md border-b-2 border-blue-50">
          <a
            href=""
            @click.prevent="selectAllPartners()"
            class="hover:rounded-md text-lg inline-flex justify-between"
          >
            <span>Select All</span>
          </a>
        </li>
        <template v-for="partner in partners">
          <li
            class="rounded-md border-b-2 border-blue-50"
            v-if="filterPartners(partner)"
            :class="
              store.selected(selectedPartners[view], partner.partner)
                ? 'bg-blue-300'
                : ''
            "
          >
            <a
              href=""
              @click.prevent="SelectPartner(partner)"
              class="hover:rounded-md text-lg inline-flex justify-between"
            >
              <span>{{ partner.short_name }}</span>
              <b
                class="w-8 h-8 rounded-full pr-1 text-center text-xs text-blue-900"
              >
                <CheckIcon
                  v-if="
                    selectedPartners[view] &&
                    store.selected(selectedPartners[view], partner.partner)
                  "
                ></CheckIcon>
                <CloseIcon v-else></CloseIcon>
              </b>
            </a>
          </li>
        </template>
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
const { selectedPartners, view, partners, selected } = storeToRefs(store);

const filterPartners = (pt) => {
  if (view.value == "chart" && pt.cso_partner == "1") {
    return false;
  }
  return true;
};

const SelectPartner = (partner) => {
  let spt = selectedPartners.value[view.value];
  if (spt.length == partners.value.length) {
    selectedPartners.value[view.value] = [];
    selectedPartners.value[view.value].push(partner.partner);
  } else {
    if (!spt.includes(partner.partner)) {
      selectedPartners.value[view.value].push(partner.partner);
    } else {
      selectedPartners.value[view.value] = spt.filter(
        (item) => item !== partner.partner
      );
    }
  }

  // console.log(selectedPartners.value[view.value]);
  store.updateApp();
};

const selectAllPartners = async () => {
  selectedPartners.value[view.value] = [];
  // for (let i = 0; i < partners.value.length; i++) {
  //   selectedPartners.value[view.value].push(partners.value[i].partner);
  // }
  store.updateApp();
};
</script>
