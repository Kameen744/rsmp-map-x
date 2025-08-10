<template>
  <div class="dashboard">
    <!-- Top metric cards -->
    <div class="metrics">
      <div class="metric-card" v-for="m in metrics" :key="m.label">
        <div class="metric-label">{{ m.label }}</div>
        <div class="metric-value">{{ m.value }}</div>
      </div>
    </div>

    <!-- Main charts area -->
    <div class="main-grid">
      <section class="card small">
        <h3>Support Types</h3>
        <div ref="pieRef" class="chart"></div>
        <ul class="legend">
          <li
            ><span class="dot" :style="{ background: '#7ee8c5' }"></span>
            Funding</li
          >
          <li
            ><span class="dot" :style="{ background: '#0ea36d' }"></span>
            Technical Support</li
          >
          <li
            ><span class="dot" :style="{ background: '#073d2e' }"></span>
            Provision of Commodities</li
          >
        </ul>
      </section>

      <section class="card large">
        <h3>Campaign Focus</h3>
        <div ref="barRef" class="chart"></div>
      </section>

      <section class="card wide">
        <h3>Thematic Areas</h3>
        <div ref="lineRef" class="chart"></div>
      </section>

      <section class="card small-right">
        <h3>Campaign Status</h3>
        <div ref="donutRef" class="chart donut"></div>
        <ul class="legend stacked">
          <li
            ><span class="dot" :style="{ background: '#2e7d32' }"></span>
            Completed</li
          >
          <li
            ><span class="dot" :style="{ background: '#9e9e9e' }"></span>
            Ongoing</li
          >
          <li
            ><span class="dot" :style="{ background: '#b71c1c' }"></span>
            Pending</li
          >
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

// metric numbers (top cards)
const metrics = [
  { label: "States Supported", value: 27 },
  { label: "LGAs Supported", value: 512 },
  { label: "Partners", value: 17 },
  { label: "Campaign Focus", value: 7 },
  { label: "Thematic Areas", value: 56 },
];

// refs for chart containers
const pieRef = ref(null);
const barRef = ref(null);
const lineRef = ref(null);
const donutRef = ref(null);

// chart instances
let pieChart, barChart, lineChart, donutChart;

// sample data (easy to replace / bind to props or API)
const supportTypes = [
  { name: "Funding", value: 40 },
  { name: "Technical Support", value: 30 },
  { name: "Provision of Commodities", value: 30 },
];

const campaignFocus = {
  categories: [
    "Measles Rubella",
    "Polio",
    "HPV",
    "NTDs",
    "Malaria",
    "Nutrition",
    "Routine Immunization",
  ],
  values: [4, 18, 36, 10, 24, 20, 22],
};

const thematicAreas = {
  categories: [
    "ACSM",
    "Cold chain Logistics",
    "Finance",
    "MERLA",
    "Planning & Coordination",
    "Service Delivery",
    "Surveillance",
  ],
  values: [2, 38, 18, 10, 33, 15, 18],
};

const statusData = [
  { name: "Completed", value: 17 },
  { name: "Ongoing", value: 20 },
  { name: "Pending", value: 63 },
];

// initialize charts
function initPie() {
  if (!pieRef.value) return;
  pieChart = echarts.init(pieRef.value);
  const option = {
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: { show: true, position: "inside", formatter: "{d}%" },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: "bold" } },
        itemStyle: { borderColor: "#fff", borderWidth: 2 },
        data: [
          {
            value: supportTypes[0].value,
            name: supportTypes[0].name,
            itemStyle: { color: "#7ee8c5" },
          },
          {
            value: supportTypes[1].value,
            name: supportTypes[1].name,
            itemStyle: { color: "#0ea36d" },
          },
          {
            value: supportTypes[2].value,
            name: supportTypes[2].name,
            itemStyle: { color: "#073d2e" },
          },
        ],
      },
    ],
  };
  pieChart.setOption(option);
}

function initBar() {
  if (!barRef.value) return;
  barChart = echarts.init(barRef.value);
  const option = {
    tooltip: {},
    xAxis: {
      type: "category",
      data: campaignFocus.categories,
      axisLabel: { rotate: 30, interval: 0 },
    },
    yAxis: { type: "value" },
    grid: { left: "6%", right: "6%", bottom: "12%" },
    series: [
      {
        type: "bar",
        data: campaignFocus.values,
        barWidth: "38%",
        itemStyle: { color: "#7b1fa2" },
      },
    ],
  };
  barChart.setOption(option);
}

function initLine() {
  if (!lineRef.value) return;
  lineChart = echarts.init(lineRef.value);
  const option = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: thematicAreas.categories,
      axisLabel: { rotate: 20, interval: 0 },
    },
    yAxis: { type: "value" },
    grid: { left: "6%", right: "6%", bottom: "12%" },
    series: [
      {
        type: "line",
        data: thematicAreas.values,
        showSymbol: true,
        smooth: false,
        itemStyle: { color: "#0b6b5d" },
        lineStyle: { width: 2 },
      },
    ],
  };
  lineChart.setOption(option);
}

function initDonut() {
  if (!donutRef.value) return;
  donutChart = echarts.init(donutRef.value);
  const option = {
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["50%", "75%"],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          {
            value: statusData[0].value,
            name: statusData[0].name,
            itemStyle: { color: "#2e7d32" },
          },
          {
            value: statusData[1].value,
            name: statusData[1].name,
            itemStyle: { color: "#9e9e9e" },
          },
          {
            value: statusData[2].value,
            name: statusData[2].name,
            itemStyle: { color: "#b71c1c" },
          },
        ],
      },
    ],
  };
  donutChart.setOption(option);
}

// responsive: resize charts on window resize
function resizeAll() {
  try {
    pieChart?.resize();
    barChart?.resize();
    lineChart?.resize();
    donutChart?.resize();
  } catch (e) {
    /* ignore if not init'd */
  }
}

onMounted(() => {
  initPie();
  initBar();
  initLine();
  initDonut();
  window.addEventListener("resize", resizeAll);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeAll);
  pieChart?.dispose();
  barChart?.dispose();
  lineChart?.dispose();
  donutChart?.dispose();
});
</script>

<style scoped>
/* Basic reset + layout */
.dashboard {
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
  padding: 18px;
  background: #f3f5f6;
  color: #222;
}

/* Top metrics */
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.metric-card {
  background: #fff;
  padding: 14px;
  border-radius: 10px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}
.metric-label {
  color: #39424a;
  font-size: 13px;
}
.metric-value {
  color: #13b6a7;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

/* Main grid */
.main-grid {
  display: grid;
  grid-template-columns: 360px 1fr 320px;
  grid-template-rows: 320px 320px;
  gap: 18px;
}

/* For smaller screens make it single column */
@media (max-width: 980px) {
  .main-grid {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
}

/* Card styles */
.card {
  background: #fff;
  border-radius: 10px;
  padding: 14px 18px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}
.card h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #251a1a;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 8px;
}

/* sizing helpers */
.small {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}
.large {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
} /* big central bar spans two rows */
.wide {
  grid-column: 1 / 3;
  grid-row: 2 / 2;
} /* will collapse on small screens */
.small-right {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
  justify-content: center;
  align-items: center;
}

@media (max-width: 980px) {
  .small,
  .large,
  .wide,
  .small-right {
    grid-column: auto;
    grid-row: auto;
  }
}

/* chart containers */
.chart {
  height: 220px;
  width: 100%;
  margin-top: 8px;
}
.card.large .chart {
  height: 320px;
}
.card.wide .chart {
  height: 220px;
}
.card.small-right .chart.donut {
  height: 200px;
  width: 100%;
}

/* legend */
.legend {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.legend.stacked {
  flex-direction: column;
  align-items: flex-start;
  margin-top: 14px;
}
.legend li {
  list-style: none;
  font-size: 13px;
  color: #444;
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

/* tweak for spacing */
.card.small h3,
.card.small-right h3 {
  margin-bottom: 6px;
}
</style>
