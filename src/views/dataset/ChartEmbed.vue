<template>
  <div class="p-4 h-screen w-screen">
    <Chart :type="chartType" :data="chartData" class="h-full w-full" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ckanApi } from "../../api/ckan-api";
import { DatastoreSearchResponse } from "../../api/models";
import { onMounted, ref } from "vue";

const route = useRoute();
const id = route.params.id as string;
let data = ref<DatastoreSearchResponse>();

let chartData = ref();
let chartType = route.query.type as string;
let chartDataFields = Array.isArray(route.query.dataFields)
  ? (route.query.dataFields as string[])
  : [route.query.dataFields as string];
let chartLabel = route.query.label as string;

onMounted(async () => {
  try {
    data.value = (await ckanApi.searchDatastore(id)).data;
    let result = data.value.result;

    chartData.value = {
      labels: result.records.map((x) => x[chartLabel]),
      datasets: chartDataFields.map((field) => {
        return {
          label: field,
          data: result.records.map((x) => x[field]),
        };
      }),
    };
  } catch (err) {
    //   console.log(err);
  }
});
</script>

<style lang="scss" scoped></style>
