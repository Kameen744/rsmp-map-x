<template>
  <template class="min-[3rem]: flex justify-start">
    <div class="dropdown dropdown-bottom">
      <SelectBadge
        title="Thematic Areas"
        v-if="selectedThematicAreas[view].length > 0"
      ></SelectBadge>

      <div
        tabindex="0"
        role="button"
        class="inline-flex justify-between shadow-sm p-3 py-1 m-1 pl-3 text-lg rounded-md border-2 border-rsmp-sec min-w-36"
      >
        <div class="inline-flex max-w-28 overflow-hidden">
          <div>
            <div
              class="text-nowrap"
              v-if="selectedThematicAreas[view].length <= 0"
            >
              Thematic Areas
            </div>

            <div v-else class="text-nowrap">
              {{ selectedThematicAreas[view].length }} Selected
            </div>
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
        class="dropdown-content z-[99999] menu p-2 shadow-lg bg-base-100 rounded-md max-h-[70vh] grid overflow-x-auto border-2 border-rsmp-sec"
      >
        <li class="rounded-md border-b-2 border-blue-50">
          <a
            href=""
            @click.prevent="selectAllThemAreas()"
            class="hover:rounded-md text-lg inline-flex justify-between"
          >
            <span>Select All</span>
          </a>
        </li>
        <li
          class="rounded-md border-b-2 border-blue-50"
          v-for="area in sortedThematicAreas"
          :class="
            store.selected(selectedThematicAreas[view], area)
              ? 'bg-blue-300'
              : ''
          "
        >
          <a
            href=""
            @click.prevent="selectThemArea(area)"
            class="hover:rounded-md text-lg inline-flex justify-between"
          >
            <span>{{ area }}</span>
            <b
              class="w-8 h-8 rounded-full pr-1 text-center text-xs text-blue-900"
            >
              <CheckIcon
                v-if="selectedThematicAreas[view].includes(area)"
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
import { onMounted, ref, computed } from "vue";
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
import SelectBadge from "./SelectBadge.vue";
import CheckPlusIcon from "./CheckPlusIcon.vue";
import CheckIcon from "./CheckIcon.vue";
import CloseIcon from "./CloseIcon.vue";

const store = useMainStore();

const { selectedThematicAreas, view, thematicAreas } = storeToRefs(store);

const dropped = ref(false);

const toggleDroped = () => {
  dropped.value = !dropped.value;
};

const sortedThematicAreas = computed(() => {
  if (!Array.isArray(thematicAreas.value)) {
    return [];
  }
  return [...thematicAreas.value].sort((a, b) => a.localeCompare(b));
});

const selectThemArea = async (area) => {
  let sspt = selectedThematicAreas.value[view.value];
  if (!sspt.includes(area)) {
    selectedThematicAreas.value[view.value].push(area);
  } else {
    selectedThematicAreas.value[view.value] = sspt.filter(
      (item) => item !== area
    );
  }

  store.updateApp();
};

const selectAllThemAreas = async () => {
  if (
    selectedThematicAreas.value[view.value].length < thematicAreas.value.length
  ) {
    selectedThematicAreas.value[view.value] = [];
    for (let i = 0; i < thematicAreas.value.length; i++) {
      selectedThematicAreas.value[view.value].push(thematicAreas.value[i]);
    }
    // store.launchAapp();

    store.updateApp();
  } else {
    selectedThematicAreas.value[view.value] = [];
  }
};
</script>
