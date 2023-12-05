<template>
  <div class="h-full">
    <div v-if="data?.success" class="flex flex-col md:flex-row w-full h-full">
      <div class="w-full h-full items-center">
        <Chart :type="chartType" :data="setChartData()" class="h-full" />
      </div>
      <div
        class="w-full py-4 md:w-1/4 flex flex-col gap-4 md:pl-4 md:overflow-y-auto"
      >
        <div>
          <p>Tipe</p>
          <Dropdown
            v-model="chartType"
            :options="chartTypes"
            optionValue="type"
            optionLabel="name"
            placeholder="Pilih tipe chart"
            class="w-full"
          />
        </div>

        <div>
          <p>Label</p>
          <Dropdown
            v-model="chartLabel"
            :options="fields"
            placeholder="Pilih label"
            class="w-full"
          />
        </div>

        <div v-for="n in chartNumOfData">
          <p>Data {{ n }}</p>
          <Dropdown
            v-model="chartDataFields[n - 1]"
            :options="fields"
            placeholder="Pilih label"
            class="w-full"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 w-full">
          <Button
            label="Tambah"
            class="bg-primary shrink-0"
            @click="chartNumOfData++"
          >
            <template #icon>
              <i-material-symbols:add class="mr-2" />
            </template>
          </Button>
          <Button
            label="Embed"
            class="bg-primary shrink-0"
            @click="copyEmbedLink()"
          >
            <template #icon>
              <i-ph:code-bold class="mr-2" />
            </template>
          </Button>
        </div>

        <div v-if="embedText">
            <p>Embed code</p>
            <Textarea v-model="embedText" autoResize rows="5" class="w-full"/>
        </div>
      </div>
    </div>
    <div v-else class="flex w-full h-full items-center justify-center font-semibold text-error">Tidak dapat menampilkan grafik</div>
  </div>
</template>

<script lang="ts" setup>
import { ckanApi } from "../api/ckan-api";
import { DatastoreSearchResponse } from "../api/models";
import { onMounted, ref, watchEffect } from "vue";

import Chart from "primevue/chart";
import { useRouter } from "vue-router";

const router = useRouter();

let props = defineProps(["id"]);
let data: DatastoreSearchResponse | null = null;
let embedText = ref("")

const chartTypes = [
  {
    name: "Bar",
    type: "bar",
  },
  {
    name: "Line",
    type: "line",
  },
  {
    name: "Pie",
    type: "pie",
  },
  {
    name: "Radar",
    type: "radar",
  },
  {
    name: "Doughnut",
    type: "doughnut",
  },
  {
    name: "Polar Area",
    type: "polarArea",
  },
];
let chartType = ref("bar");

let fields = ref<string[]>([]);
let chartLabel = ref("");

let chartDataFields = ref<string[]>([]);

let chartNumOfData = ref(1);

try {
  data = (await ckanApi.searchDatastore(props.id)).data;
  let result = data.result;

  fields.value = result.fields.map((x) => x.id);
  chartLabel.value = fields.value[0];
} catch (err) {
  //   console.log(err);
}

const setChartData = () => {
  return {
    labels: data?.result.records.map((x) => x[chartLabel.value]),
    datasets: chartDataFields.value.map((field) => {
      return {
        label: field,
        data: data?.result.records.map((x) => x[field]),
      };
    }),
  };
};

const copyEmbedLink = () => {
  let route = router.resolve({
    name: "chart-embed",
    params: { id: props.id },
    query: {
      type: chartType.value,
      label: chartLabel.value,
      dataFields: chartDataFields.value,
    },
  });

  let embedUrl = location.protocol + "//" + location.host + route.fullPath;
  embedText.value = `<iframe src="${embedUrl}" height="300" width="500"></iframe>`
};
</script>

<style lang="scss" scoped></style>
