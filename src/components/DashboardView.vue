<template> <div></div></template>

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
