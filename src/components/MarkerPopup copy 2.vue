<template>
  <div
    class="z-[9999] fixed top-[11vh] max-h-[90vh] min-w-[400px] max-w-[400px] right-2 flex bg-transparent p-0"
  >
    <b
      @click="store.closePopup"
      class="z-[99] cursor-pointer absolute top-[10px] right-[10px] shadow-lg hover:bg-slate-200 ml-4 w-8 h-8 rounded-full bg-red-700 text-center text-xs text-blue-900"
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
    <div class="bg-gray-50 rounded-lg shadow-md w-full font-sans">
      <div class="bg-orange-500 p-6 py-3 rounded-t-lg flex">
        <h2 class="text-white text-2xl font-bold">{{ selectedMarker.lga }}</h2>
      </div>

      <div class="p-6 space-y-2">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center text-gray-700">
            <span class="mr-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_7_476)">
                  <path
                    d="M9.00008 11.045C10.1295 11.045 11.0451 10.1294 11.0451 8.99999C11.0451 7.87056 10.1295 6.95499 9.00008 6.95499C7.87066 6.95499 6.95508 7.87056 6.95508 8.99999C6.95508 10.1294 7.87066 11.045 9.00008 11.045Z"
                    fill="#1F3559"
                  />
                  <path
                    d="M9.00004 3.91501C7.99432 3.91501 7.01119 4.21324 6.17497 4.77199C5.33874 5.33073 4.68699 6.1249 4.30211 7.05406C3.91724 7.98323 3.81654 9.00565 4.01275 9.99204C4.20895 10.9784 4.69325 11.8845 5.4044 12.5956C6.11555 13.3068 7.02161 13.7911 8.00801 13.9873C8.9944 14.1835 10.0168 14.0828 10.946 13.6979C11.8751 13.3131 12.6693 12.6613 13.2281 11.8251C13.7868 10.9889 14.085 10.0057 14.085 9.00001C14.0837 7.65179 13.5476 6.35917 12.5942 5.40583C11.6409 4.4525 10.3483 3.91633 9.00004 3.91501ZM9.00004 11.915C8.4175 11.915 7.8481 11.7419 7.3641 11.4177C6.88009 11.0936 6.50329 10.6329 6.28153 10.0942C6.05976 9.55557 6.00301 8.96316 6.1185 8.39219C6.23398 7.82121 6.51648 7.29741 6.93015 6.88726C7.34382 6.4771 7.87001 6.19909 8.44195 6.08848C9.0139 5.97788 9.6058 6.03968 10.1426 6.26604C10.6793 6.4924 11.1367 6.87312 11.4568 7.35988C11.7768 7.84663 11.945 8.41749 11.94 9.00001C11.94 9.77975 11.6303 10.5275 11.0789 11.0789C10.5276 11.6303 9.77978 11.94 9.00004 11.94V11.915Z"
                    fill="#1F3559"
                  />
                  <path
                    d="M9 1C7.41775 1 5.87103 1.46919 4.55544 2.34824C3.23985 3.22729 2.21447 4.47672 1.60897 5.93853C1.00347 7.40034 0.84504 9.00887 1.15372 10.5607C1.4624 12.1126 2.22433 13.538 3.34315 14.6569C4.46197 15.7757 5.88743 16.5376 7.43928 16.8463C8.99113 17.155 10.5997 16.9965 12.0615 16.391C13.5233 15.7855 14.7727 14.7602 15.6518 13.4446C16.5308 12.129 17 10.5823 17 9C17 6.87827 16.1571 4.84344 14.6569 3.34315C13.1566 1.84285 11.1217 1 9 1ZM9 14.915C7.83013 14.915 6.68652 14.5681 5.71381 13.9181C4.74109 13.2682 3.98295 12.3444 3.53526 11.2636C3.08756 10.1827 2.97043 8.99344 3.19866 7.84604C3.42689 6.69864 3.99024 5.64469 4.81747 4.81746C5.64469 3.99024 6.69865 3.42689 7.84604 3.19866C8.99344 2.97042 10.1828 3.08756 11.2636 3.53525C12.3444 3.98294 13.2682 4.74109 13.9181 5.7138C14.5681 6.68652 14.915 7.83012 14.915 9C14.9124 10.5679 14.2883 12.0709 13.1796 13.1796C12.0709 14.2883 10.5679 14.9124 9 14.915Z"
                    fill="#1F3559"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_7_476">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <p>Campaign Focus:</p>
          </div>
          <!-- <p class="font-semibold text-gray-900">
            {{ selectedMarker.program_area }}
          </p> -->
          <div class="flex justify-between">
            <span v-for="focus in selectedMarker.Campaign_Focus">
              {{ focus }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center text-gray-700">
            <span class="mr-2">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.2259 2H9.81C9.585 2 9.36844 2.09375 9.2025 2.2625L6.43781 5.075C6.435 5.07812 6.43219 5.08438 6.42938 5.0875C5.9625 5.575 5.97094 6.35313 6.37031 6.8375C6.7275 7.27187 7.47844 7.3875 7.94812 6.92188C7.95094 6.91875 7.95656 6.91875 7.95937 6.91563L10.2066 4.62813C10.3894 4.44375 10.6762 4.45625 10.8422 4.65938C11.0109 4.8625 10.9969 5.17812 10.8141 5.36562L10.08 6.1125L14.175 9.80625C14.2566 9.88125 14.3297 9.9625 14.3972 10.0469V4L12.8616 2.29375C12.6956 2.10625 12.465 2 12.2259 2ZM15.3 4.00625V11.0031C15.3 11.5563 15.7022 12.0031 16.2 12.0031H18V4.00625H15.3ZM16.65 11.0031C16.4025 11.0031 16.2 10.7781 16.2 10.5031C16.2 10.2281 16.4025 10.0031 16.65 10.0031C16.8975 10.0031 17.1 10.2281 17.1 10.5031C17.1 10.7781 16.8975 11.0031 16.65 11.0031ZM0 12H1.8C2.29781 12 2.7 11.5531 2.7 11V4.00625H0V12ZM1.35 10.0031C1.5975 10.0031 1.8 10.2281 1.8 10.5031C1.8 10.7781 1.5975 11.0031 1.35 11.0031C1.1025 11.0031 0.9 10.7781 0.9 10.5031C0.9 10.225 1.1025 10.0031 1.35 10.0031ZM13.6097 10.5844L9.41062 6.79688L8.56687 7.65625C7.73156 8.50313 6.45187 8.42188 5.70656 7.51875C4.95 6.6 5.00906 5.17812 5.83031 4.34062L8.13094 2H5.77406C5.535 2 5.30719 2.10625 5.13844 2.29375L3.6 4V10.9969H4.11469L6.66 13.5562C7.43062 14.2531 8.56406 14.1219 9.19125 13.2656L9.19687 13.2594L9.70031 13.7437C10.1475 14.15 10.8084 14.0719 11.1713 13.575L12.0544 12.3687L12.2062 12.5063C12.5916 12.8531 13.1597 12.7906 13.4719 12.3594L13.7391 11.9937C14.0541 11.5625 13.995 10.9344 13.6097 10.5844Z"
                  fill="#1F3559"
                />
              </svg>
            </span>
            <p>Partner:</p>
          </div>
          <p class="font-semibold text-gray-900">Sydani Initiative</p>
        </div>
        <!-- {{ selectedMarker }} -->
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center text-gray-700">
            <span class="mr-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.5025 1.66278L15.8775 5.22528C16.0646 5.31871 16.222 5.46246 16.332 5.64038C16.442 5.81831 16.5001 6.02337 16.5 6.23253V7.31253C16.5 7.83003 16.08 8.25003 15.5625 8.25003H15V14.25H15.75C15.9489 14.25 16.1397 14.329 16.2803 14.4697C16.421 14.6104 16.5 14.8011 16.5 15C16.5 15.1989 16.421 15.3897 16.2803 15.5304C16.1397 15.671 15.9489 15.75 15.75 15.75H2.25C2.05109 15.75 1.86032 15.671 1.71967 15.5304C1.57902 15.3897 1.5 15.1989 1.5 15C1.5 14.8011 1.57902 14.6104 1.71967 14.4697C1.86032 14.329 2.05109 14.25 2.25 14.25H3V8.25003H2.4375C1.92 8.25003 1.5 7.83003 1.5 7.31253V6.23253C1.5 5.84103 1.7025 5.48103 2.0295 5.27703L8.49675 1.66278C8.653 1.58463 8.8253 1.54395 9 1.54395C9.1747 1.54395 9.34625 1.58463 9.5025 1.66278ZM12.75 8.25003H5.25V14.25H6.75V9.75003H8.25V14.25H9.75V9.75003H11.25V14.25H12.75V8.25003ZM9 4.50003C8.80109 4.50003 8.61032 4.57905 8.46967 4.7197C8.32902 4.86035 8.25 5.05112 8.25 5.25003C8.25 5.44894 8.32902 5.63971 8.46967 5.78036C8.61032 5.92101 8.80109 6.00003 9 6.00003C9.19891 6.00003 9.38968 5.92101 9.53033 5.78036C9.67098 5.63971 9.75 5.44894 9.75 5.25003C9.75 5.05112 9.67098 4.86035 9.53033 4.7197C9.38968 4.57905 9.19891 4.50003 9 4.50003Z"
                  fill="#1F3559"
                />
              </svg>
            </span>
            <p>Funder:</p>
          </div>
          <p class="font-semibold text-gray-900">
            {{ selectedMarker.funder }}
          </p>
        </div>

        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center text-gray-700">
            <span class="mr-2">
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.1875 3.0625C5.1875 2.31658 5.48382 1.60121 6.01126 1.07376C6.53871 0.546316 7.25408 0.25 8 0.25C8.74592 0.25 9.46129 0.546316 9.98874 1.07376C10.5162 1.60121 10.8125 2.31658 10.8125 3.0625C10.8125 3.80842 10.5162 4.52379 9.98874 5.05124C9.46129 5.57868 8.74592 5.875 8 5.875C7.25408 5.875 6.53871 5.57868 6.01126 5.05124C5.48382 4.52379 5.1875 3.80842 5.1875 3.0625ZM10.8125 5.3125C10.8125 4.71576 11.0496 4.14347 11.4715 3.72151C11.8935 3.29955 12.4658 3.0625 13.0625 3.0625C13.6592 3.0625 14.2315 3.29955 14.6535 3.72151C15.0754 4.14347 15.3125 4.71576 15.3125 5.3125C15.3125 5.90924 15.0754 6.48153 14.6535 6.90349C14.2315 7.32545 13.6592 7.5625 13.0625 7.5625C12.4658 7.5625 11.8935 7.32545 11.4715 6.90349C11.0496 6.48153 10.8125 5.90924 10.8125 5.3125ZM0.6875 5.3125C0.6875 4.71576 0.924553 4.14347 1.34651 3.72151C1.76847 3.29955 2.34076 3.0625 2.9375 3.0625C3.53424 3.0625 4.10653 3.29955 4.52849 3.72151C4.95045 4.14347 5.1875 4.71576 5.1875 5.3125C5.1875 5.90924 4.95045 6.48153 4.52849 6.90349C4.10653 7.32545 3.53424 7.5625 2.9375 7.5625C2.34076 7.5625 1.76847 7.32545 1.34651 6.90349C0.924553 6.48153 0.6875 5.90924 0.6875 5.3125ZM3.7325 9.3385C4.19013 8.62162 4.82099 8.03159 5.56685 7.62287C6.3127 7.21416 7.1495 6.99994 8 7C8.71237 6.99935 9.41684 7.14916 10.0673 7.43962C10.7178 7.73008 11.2995 8.15465 11.7745 8.68553C12.2496 9.2164 12.6071 9.84161 12.8237 10.5202C13.0404 11.1989 13.1113 11.9156 13.0317 12.6235C13.022 12.7114 12.9917 12.7959 12.9432 12.8699C12.8947 12.9439 12.8295 13.0054 12.7528 13.0495C11.3064 13.8793 9.66749 14.3148 8 14.3125C6.33251 14.3148 4.69363 13.8793 3.24725 13.0495C3.17052 13.0054 3.10526 12.9439 3.05678 12.8699C3.0083 12.7959 2.97797 12.7114 2.96825 12.6235C2.84308 11.4735 3.11257 10.3151 3.7325 9.3385Z"
                  fill="#1F3559"
                />
                <path
                  d="M2.8115 8.69052L2.7845 8.73177C2.06395 9.86564 1.72955 11.2022 1.83125 12.5418C1.38064 12.4735 0.937439 12.363 0.5075 12.2118L0.42125 12.1818C0.344142 12.1547 0.276605 12.1057 0.226915 12.0409C0.177225 11.976 0.147541 11.898 0.1415 11.8165L0.134 11.7258C0.128 11.6503 0.125 11.575 0.125 11.5C0.125045 10.7759 0.404348 10.0798 0.904763 9.55645C1.40518 9.03313 2.08815 8.72296 2.8115 8.69052ZM14.1695 12.5418C14.2721 11.1853 13.9275 9.8326 13.1885 8.69052C13.5659 8.70744 13.936 8.8002 14.2767 8.96326C14.6174 9.12633 14.9218 9.35637 15.1717 9.63965C15.4216 9.92293 15.6119 10.2536 15.7311 10.6121C15.8504 10.9705 15.8963 11.3492 15.866 11.7258L15.8585 11.8165C15.8523 11.8979 15.8226 11.9757 15.7729 12.0404C15.7232 12.1051 15.6557 12.154 15.5787 12.181L15.4925 12.211C15.067 12.362 14.626 12.4723 14.1695 12.5418Z"
                  fill="#1F3559"
                />
              </svg>
            </span>
            <p>Personnel Deployed:</p>
          </div>
          <p class="font-semibold text-gray-900">
            {{ selectedMarker.number_of_personnel_deployed }}
          </p>
        </div>
      </div>

      <div class="max-h-[60vh] overflow-auto">
        <div class="px-6 pb-3">
          <div
            class="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
          >
            <template v-if="selectedMarker.status == 'Ongoing'">
              <div class="flex items-center">
                <span class="h-3 w-3 bg-yellow-100 rounded-full mr-3"></span>
                <p class="font-semibold text-gray-700">Current Status</p>
              </div>

              <span
                class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 pb-2 rounded-full"
                >{{ selectedMarker.status }}</span
              >
            </template>

            <template v-if="selectedMarker.status == 'Completed'">
              <div class="flex items-center">
                <span
                  class="h-3 w-3 bg-rsmp-active-btn rounded-full mr-3"
                ></span>
                <p class="font-semibold text-gray-700">Current Status</p>
              </div>

              <span
                class="bg-rsmp-active-btn text-yellow-950 text-xs font-semibold px-3 py-1 pb-2 rounded-full"
                >{{ selectedMarker.status }}</span
              >
            </template>

            <template v-if="selectedMarker.status == 'Pending'">
              <div class="flex items-center">
                <span class="h-3 w-3 bg-red-100 rounded-full mr-3"></span>
                <p class="font-semibold text-gray-700">Current Status</p>
              </div>

              <span
                class="bg-red-100 text-yellow-800 text-xs font-semibold px-3 py-1 pb-2 rounded-full"
                >{{ selectedMarker.status }}</span
              >
            </template>
          </div>
        </div>

        <div class="px-6 pb-3">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex items-center text-gray-700 mb-3">
              <span class="mr-2 btn btn-sm py-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.7101 20.29L20.2901 21.71C20.1027 21.8962 19.8492 22.0008 19.5851 22.0008C19.3209 22.0008 19.0674 21.8962 18.8801 21.71L7.00006 9.85C6.6749 9.94433 6.33859 9.99477 6.00006 10C5.36336 9.99955 4.73597 9.84711 4.17005 9.55536C3.60413 9.26362 3.11602 8.84099 2.74632 8.32263C2.37662 7.80426 2.136 7.20513 2.04447 6.57505C1.95293 5.94496 2.01313 5.30213 2.22006 4.7L4.76006 7.24L5.29006 6.71L6.71006 5.29L7.24006 4.76L4.70006 2.22C5.30219 2.01307 5.94503 1.95287 6.57511 2.04441C7.20519 2.13594 7.80432 2.37656 8.32269 2.74626C8.84105 3.11596 9.26368 3.60407 9.55542 4.16999C9.84717 4.73591 9.99961 5.3633 10.0001 6C9.99483 6.33853 9.94439 6.67484 9.85006 7L21.7101 18.88C21.8963 19.0674 22.0009 19.3208 22.0009 19.585C22.0009 19.8492 21.8963 20.1026 21.7101 20.29ZM2.29006 18.88C2.10381 19.0674 1.99927 19.3208 1.99927 19.585C1.99927 19.8492 2.10381 20.1026 2.29006 20.29L3.71006 21.71C3.89742 21.8962 4.15087 22.0008 4.41506 22.0008C4.67925 22.0008 4.9327 21.8962 5.12006 21.71L10.5901 16.25L7.76006 13.42M20.0001 2L16.0001 4V6L13.8301 8.17L15.8301 10.17L18.0001 8H20.0001L22.0001 4L20.0001 2Z"
                    fill="#1F3559"
                  />
                </svg>
              </span>
              <h3 class="font-semibold">Tools/Material Provided</h3>
            </div>
            <button
              class="bg-rsmp-popup-bg text-gray-800 text-sm font-medium py-1 px-4 border border-gray-200 rounded-sm"
            >
              {{ selectedMarker.toolsmaterials_provided }}
            </button>
          </div>
        </div>

        <div class="px-6 pb-3">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex items-center text-gray-700 mb-3">
              <span class="mr-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V12H21ZM16 3C16.2652 3 16.5196 3.10536 16.7071 3.29289C16.8946 3.48043 17 3.73478 17 4V5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V10H3V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H7V4C7 3.73478 7.10536 3.48043 7.29289 3.29289C7.48043 3.10536 7.73478 3 8 3C8.26522 3 8.51957 3.10536 8.70711 3.29289C8.89464 3.48043 9 3.73478 9 4V5H15V4C15 3.73478 15.1054 3.48043 15.2929 3.29289C15.4804 3.10536 15.7348 3 16 3Z"
                    fill="#1F3559"
                  />
                </svg>
              </span>
              <h3 class="font-semibold">Project Timeline</h3>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <div>
                <p
                  >From:
                  <span class="font-medium text-gray-900">
                    {{ selectedMarker.start_date }}
                  </span></p
                >
              </div>
              <div>
                <p
                  >To:
                  <span class="font-medium text-gray-900">
                    {{ selectedMarker.end_date }}
                  </span></p
                >
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 pb-3">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex items-center text-gray-700 mb-3">
              <span class="mr-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.25 2.5C14.25 2.4337 14.2237 2.37011 14.1768 2.32322C14.1299 2.27634 14.0663 2.25 14 2.25H7C6.27065 2.25 5.57118 2.53973 5.05546 3.05546C4.53973 3.57118 4.25 4.27065 4.25 5V19C4.25 19.7293 4.53973 20.4288 5.05546 20.9445C5.57118 21.4603 6.27065 21.75 7 21.75H17C17.7293 21.75 18.4288 21.4603 18.9445 20.9445C19.4603 20.4288 19.75 19.7293 19.75 19V9.147C19.75 9.0807 19.7237 9.01711 19.6768 8.97022C19.6299 8.92334 19.5663 8.897 19.5 8.897H15C14.8011 8.897 14.6103 8.81798 14.4697 8.67733C14.329 8.53668 14.25 8.34591 14.25 8.147V2.5ZM15 12.25C15.1989 12.25 15.3897 12.329 15.5303 12.4697C15.671 12.6103 15.75 12.8011 15.75 13C15.75 13.1989 15.671 13.3897 15.5303 13.5303C15.3897 13.671 15.1989 13.75 15 13.75H9C8.80109 13.75 8.61032 13.671 8.46967 13.5303C8.32902 13.3897 8.25 13.1989 8.25 13C8.25 12.8011 8.32902 12.6103 8.46967 12.4697C8.61032 12.329 8.80109 12.25 9 12.25H15ZM15 16.25C15.1989 16.25 15.3897 16.329 15.5303 16.4697C15.671 16.6103 15.75 16.8011 15.75 17C15.75 17.1989 15.671 17.3897 15.5303 17.5303C15.3897 17.671 15.1989 17.75 15 17.75H9C8.80109 17.75 8.61032 17.671 8.46967 17.5303C8.32902 17.3897 8.25 17.1989 8.25 17C8.25 16.8011 8.32902 16.6103 8.46967 16.4697C8.61032 16.329 8.80109 16.25 9 16.25H15Z"
                    fill="#1F3559"
                  />
                  <path
                    d="M15.75 2.82402C15.75 2.64002 15.943 2.52302 16.086 2.63802C16.2073 2.73602 16.315 2.85002 16.409 2.98002L19.422 7.17702C19.49 7.27302 19.416 7.39702 19.298 7.39702H16C15.9337 7.39702 15.8701 7.37068 15.8232 7.32379C15.7763 7.27691 15.75 7.21332 15.75 7.14702V2.82402Z"
                    fill="#1F3559"
                  />
                </svg>
              </span>
              <h3 class="font-semibold">Support Summary</h3>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ selectedMarker.summary_of_support }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      class="grid bg-white shadow-md p-2 max-h-[400px] w-[74vw] overflow-y-auto c-scroll"
    >
      <b
        @click="store.closePopup"
        class="z-[99] cursor-pointer absolute top-[-10px] right-[-10px] shadow-lg hover:bg-slate-200 ml-4 w-8 h-8 rounded-full bg-blue-200 text-center text-xs text-blue-900"
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

      <div class="border-blue-600 border-solid border-2 static">
        <h1 class="text-2xl text-center font-bold" v-if="selectedMarker"
          >{{ selectedMarker.lga }} LGA</h1
        >
        <h1 class="text-2xl text-center font-bold" v-if="selectedLgaMarker"
          >{{ selectedLgaMarker.LGA }} LGA</h1
        >
      </div>

      <div class="flex text-left bg-blue-500 text-white font-semibold">
        <div class="py-2 px-2 min-w-[250px] text-left font-bold text-lg pl-3"
          >Support Type</div
        >
        <div class="py-2 px-2 min-w-[200px] text-left font-bold text-lg pl-3"
          >Program Area</div
        >
        <div class="py-2 px-2 min-w-[300px] text-left font-bold text-lg pl-3"
          >Partner</div
        >
        <div class="py-2 px-2 min-w-[110px] text-left font-bold text-lg pl-3"
          >Start Date</div
        >
        <div class="py-2 px-2 min-w-[110px] text-left font-bold text-lg pl-3"
          >End Date</div
        >
        <div class="py-2 px-2 min-w-[100px] text-left font-bold text-lg pl-3"
          >Status</div
        >
      </div>

      <template v-if="selectedMarker">
        <div
          class="flex flex-wrap rounded-none bg-blue-100 text-left hover:bg-blue-50 cursor-pointer"
          :key="Math.round(Math.random() * 10001)"
          @click="expand(key)"
          :class="collapseKey == key ? 'bg-blue-50' : 'bg-blue-100'"
        >
          <div
            class="overflow-hidden border-y py-1 w-[250px] border-white px-3 flex justify-start"
          >
            <span
              class="inline-block w-3 h-3 m-0 rounded-full mr-1 mt-2"
              :style="`background: ${getSpBg(selectedMarker.type_of_support)} `"
            ></span>
            {{ selectedMarker.type_of_support }}
          </div>
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[200px]"
            >{{ selectedMarker.program_area }}</div
          >
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[300px]"
            >{{ selectedMarker.partner }}</div
          >
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[110px]"
            >{{ selectedMarker.start_date }}</div
          >
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[110px]"
            >{{ selectedMarker.end_date }}</div
          >
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[110px] flex gap-2"
          >
            <div>{{ selectedMarker.status }}</div>
            <div v-if="collapseKey == key">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            </div>
            <div v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>

          <br />
          <Transition>
            <div class="flex-full py-2 px-4" v-if="collapseKey == key">
              <h1 class="block font-bold text-lg">Support Summary</h1>
              <p>{{ selectedMarker.summary_of_support }}</p>
            </div>
          </Transition>
        </div>
      </template>

      <template v-if="selectedLgaMarker">
        <div
          class="flex flex-wrap rounded-none relative bg-blue-100 text-left hover:bg-blue-50 cursor-pointer"
          v-for="(val, key) in selectedLgaMarker.supports"
          :key="key + 1"
          @click="expand(key + 1)"
          :class="collapseKey == key ? 'bg-blue-50' : 'bg-blue-100'"
        >
          <div
            class="overflow-hidden border-y py-1 w-[250px] border-white px-3 flex justify-start"
          >
            <span
              class="inline-block w-3 h-3 m-0 rounded-full mr-1 mt-2"
              :style="`background: ${getSpBg(val.type_of_support)} `"
            ></span>
            {{ val.type_of_support }}
          </div>
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[200px]"
            >{{ val.program_area }}</div
          >
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[300px]"
            >{{ val.partner }}</div
          >
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[110px]"
            >{{ val.start_date }}</div
          >
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[110px]"
            >{{ val.end_date }}</div
          >
          <div
            class="overflow-hidden border-y py-1 border-white px-3 w-[110px] flex gap-2"
          >
            <div>{{ val.status }}</div>
            <div v-if="collapseKey == key + 1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            </div>
            <div v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>

          <br />
          <Transition>
            <div
              class="flex-full py-5 shadow-xl px-8"
              v-if="collapseKey == key + 1"
            >
              <h1 class="block font-bold text-lg mb-2">Support Summary</h1>
              <p class="">{{ val.summary_of_support }}</p>
            </div>
          </Transition>
        </div>
      </template>
    </div> -->

    <!-- <div class=" bg-white px-2 max-h-[400px] overflow-hidden">
      <b @click="store.closePopup" class="cursor-pointer absolute top-1 right-1 ml-4 w-8 h-8 rounded-full bg-blue-200 text-center text-xs text-blue-900">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mt-1 ml-1 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </b>
      <h2 class="text-lg font-semibold">Keys</h2>
      <ul class="">
        <template v-if="selectedLgaMarker" v-for="(val, key) in verifySpList()">
          <li class="flex items-center mb-2">
              <span class="w-4 h-4 mr-2" :style="`background: ${getSpBg(val)};`"></span>
              {{ val }}
          </li>
        </template> 
        <template v-if="selectedMarker">
          <li class="flex items-center mb-2">
              <span class="w-4 h-4 mr-2" :style="`background: ${getSpBg(selectedMarker.type_of_support)};`"></span>
              {{ selectedMarker.type_of_support }}
          </li>
        </template> 
      </ul>
    </div> -->
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
onMounted(() => {
  console.log(selectedMarker.value);
});
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
