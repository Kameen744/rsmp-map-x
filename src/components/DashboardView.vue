<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Stats Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-lg p-4 shadow-sm border"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-600">{{ stat.label }}</h3>
          <div
            class="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div :class="[stat.color, 'text-3xl', 'font-bold']">{{
          stat.value
        }}</div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Support Types Pie Chart -->
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Support Types</h3>
        <div class="h-64 mb-4">
          <canvas ref="pieChartRef"></canvas>
        </div>
        <!-- Legend -->
        <div class="space-y-2">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-teal-400 rounded mr-3"></div>
            <span class="text-sm text-gray-600">Technical Support</span>
            <span class="ml-auto text-sm font-medium">40%</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-teal-600 rounded mr-3"></div>
            <span class="text-sm text-gray-600">Funding</span>
            <span class="ml-auto text-sm font-medium">30%</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-teal-900 rounded mr-3"></div>
            <span class="text-sm text-gray-600">Provision of Commodities</span>
            <span class="ml-auto text-sm font-medium">60%</span>
          </div>
        </div>
      </div>

      <!-- Campaign Focus Bar Chart -->
      <div class="bg-white rounded-lg p-6 shadow-sm border lg:col-span-2">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Campaign Focus</h3>
        <div class="h-64">
          <canvas ref="campaignBarChartRef"></canvas>
        </div>
      </div>

      <!-- Thematic Areas Line Chart -->
      <div class="bg-white rounded-lg p-6 shadow-sm border lg:col-span-2">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Thematic Areas</h3>
        <div class="h-64">
          <canvas ref="thematicLineChartRef"></canvas>
        </div>
      </div>

      <!-- Campaign Status Doughnut -->
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-800 mb-4"
          >Campaign Status</h3
        >
        <div class="h-48 mb-4">
          <canvas ref="statusDoughnutRef"></canvas>
        </div>
        <!-- Status Legend -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-red-600 rounded mr-3"></div>
              <span class="text-sm text-gray-600">Pending</span>
            </div>
            <span class="text-sm font-medium">63%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-gray-500 rounded mr-3"></div>
              <span class="text-sm text-gray-600">Ongoing</span>
            </div>
            <span class="text-sm font-medium">20%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-green-600 rounded mr-3"></div>
              <span class="text-sm text-gray-600">Completed</span>
            </div>
            <span class="text-sm font-medium">17%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Chart from "chart.js";

// Register Chart.js components
Chart.Chart.register(...Chart.registerables);

// Refs for chart canvases
const pieChartRef = ref(null);
const campaignBarChartRef = ref(null);
const thematicLineChartRef = ref(null);
const statusDoughnutRef = ref(null);

// Dashboard data
const stats = ref([
  { label: "States Supported", value: "27", color: "text-teal-500" },
  { label: "LGAs Supported", value: "512", color: "text-teal-500" },
  { label: "Partners", value: "17", color: "text-teal-500" },
  { label: "Campaign Focus", value: "7", color: "text-teal-500" },
  { label: "Thematic Areas", value: "56", color: "text-teal-500" },
]);

const initializeCharts = () => {
  // Support Types Pie Chart
  if (pieChartRef.value) {
    new Chart.Chart(pieChartRef.value, {
      type: "pie",
      data: {
        labels: ["Provision of Commodities", "Technical Support", "Funding"],
        datasets: [
          {
            data: [60, 40, 30],
            backgroundColor: ["#134e4a", "#5eead4", "#14b8a6"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // Campaign Focus Bar Chart
  if (campaignBarChartRef.value) {
    new Chart.Chart(campaignBarChartRef.value, {
      type: "bar",
      data: {
        labels: [
          "Measles Rubella",
          "Polio",
          "HPV",
          "NTDs",
          "Malaria",
          "Nutrition",
          "Routine Immunization",
        ],
        datasets: [
          {
            data: [4, 18, 37, 9, 23, 19, 22],
            backgroundColor: "#86198f",
            borderRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 40,
            grid: {
              display: true,
              color: "#e5e7eb",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // Thematic Areas Line Chart
  if (thematicLineChartRef.value) {
    new Chart.Chart(thematicLineChartRef.value, {
      type: "line",
      data: {
        labels: [
          "ACSM",
          "Cold Chain Logistics",
          "Finance",
          "MERLA",
          "Planning & Coordination",
          "Service Delivery",
          "Surveillance",
        ],
        datasets: [
          {
            data: [2, 38, 18, 11, 35, 15, 8, 17],
            borderColor: "#0891b2",
            backgroundColor: "transparent",
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#0891b2",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 40,
            grid: {
              display: true,
              color: "#e5e7eb",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // Campaign Status Doughnut Chart
  if (statusDoughnutRef.value) {
    new Chart.Chart(statusDoughnutRef.value, {
      type: "doughnut",
      data: {
        labels: ["Pending", "Ongoing", "Completed"],
        datasets: [
          {
            data: [63, 20, 17],
            backgroundColor: ["#dc2626", "#64748b", "#16a34a"],
            borderWidth: 0,
            cutout: "60%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
};

onMounted(() => {
  initializeCharts();
});
</script>
