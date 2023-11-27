<template>
  <div
    class="fixed top-0 left-0 h-screen w-screen z-40 bg-surface flex flex-col overflow-hidden"
    v-if="visible"
  >
    <div class="flex-grow-0 shrink-0">
      <div
        class="flex flex-row-reverse gap-2 p-2 mr-2 items-center overflow-x-auto border-b"
      >
        <Button
          severity="danger"
          rounded
          class="shrink-0"
          @click="visible = false"
        >
          <template #icon>
            <i-material-symbols:close />
          </template>
        </Button>

        <Button
          label="Unduh"
          class="bg-primary shrink-0"
          rounded
          @click="openInNewTab(props.url)"
        >
          <template #icon>
            <i-material-symbols:cloud-download-rounded class="mr-2" />
          </template>
        </Button>

        <SelectButton
          v-if="type == Type.EXCEL"
          v-model="excelSelectedMode"
          :options="['Excel', 'Tabel']"
          class="mr-8 min-w-fit"
          aria-labelledby="basic"
          :allowEmpty="false"
        />

        <InputText
          v-if="type == Type.EXCEL && excelSelectedMode == 'Tabel'"
          class="w-72 mr-8"
          placeholder="Cari"
          ref="inputSearch"
          v-model="tableFilters['global'].value"
        ></InputText>

        <div
          class="flex-grow font-bold text-ellipsis line-clamp-1 ml-4 min-w-fit"
        >
          {{ props.title }}
        </div>
      </div>
    </div>

    <div v-if="!isLoading" class="flex-grow overflow-y-auto">
      <!-- EXCEL -->
      <div v-if="type == Type.EXCEL" class="h-full">
        <div v-if="excelSelectedMode == 'Excel'" class="h-full flex flex-col">
          <VueOfficeExcel
            :src="arrayBuffer"
            class="flex-1"
            style="height: 100vh; widows: 100vw"
            :key="isLoading"
          />
        </div>
        <div v-else class="h-full mx-4">
          <DataTable
            :value="excelData"
            tableStyle="min-width: 50rem"
            scrollable
            scrollHeight="flex"
            removableSort
            resizableColumns
            sortMode="multiple"
            columnResizeMode="expand"
            paginator
            showGridlines
            :rows="20"
            :rowsPerPageOptions="[10, 20, 30, 40, 50]"
            :filters="tableFilters"
          >
            <Column
              v-for="col in excelHeaders"
              :key="col"
              :field="col"
              :header="col"
              sortable
            ></Column>
          </DataTable>
        </div>
      </div>

      <!-- WORD -->
      <VueOfficeDocx
        v-if="type == Type.WORD"
        :src="arrayBuffer"
        class="h-full"
        style="height: inherit"
        :key="isLoading"
      />

      <!-- PDF -->
      <VuePdfApp
        v-if="type == Type.PDF"
        :pdf="arrayBuffer"
        theme="light"
        class="h-full"
      />

      <!-- IMAGE -->
      <div
        v-if="type == Type.IMAGE"
        class="flex justify-center items-center p-8"
      >
        <img
          :src="'data:image/png;base64,' + arrayBufferToBase64(arrayBuffer)"
          class="shadow-lg z-10 max-w-full"
        />
      </div>

      <div
        v-if="isError || type == Type.UNKNOWN"
        class="h-full flex flex-col justify-center items-center text-red-400 text-lg font-semibold"
      >
        Tidak dapat menampilan preview
      </div>
    </div>
    <div v-else class="flex-grow flex flex-col justify-center items-center">
      Loading data...
      <ProgressBar
        class="w-5/12 mt-4"
        style="height: 6px"
        :value="downloadProgress"
        :mode="downloadProgress == 0 ? 'indeterminate' : 'determinate'"
        >{{ "" }}</ProgressBar
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect, computed } from "vue";
import { FilterMatchMode } from "primevue/api";

import * as XLSX from "xlsx";

import * as mime from "mime";

import axios from "axios";

// Vue Office
import VueOfficeExcel from "@vue-office/excel";
import "@vue-office/excel/lib/index.css";
import VueOfficeDocx from "@vue-office/docx";
import "@vue-office/docx/lib/index.css";
// import VueOfficePdf from "@vue-office/pdf";

import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";

const props = defineProps(["visible", "url", "title"]);
const emit = defineEmits(["update:visible"]);

const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});

const openInNewTab = (url) => {
  console.log(url);
  window.open(url, "_blank", "noreferrer");
};

enum Type {
  EXCEL,
  WORD,
  PDF,
  IMAGE,
  UNKNOWN,
}

let isLoading = ref(true);
let isError = ref(false);
let type = ref(Type.UNKNOWN);

let arrayBuffer = ref();
let downloadProgress = ref(0);

let excelData = ref();
let excelHeaders = ref();
let excelSelectedMode = ref("Excel");
const tableFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const excelExts = ["xls", "xlsx", "csv", "ods", "fods"];
const docExts = ["docx", "doc"];
const pdfExts = ["pdf"];

const load = async (url: string) => {
  isLoading.value = true;
  downloadProgress.value = 0;

  console.log("Fetching data...");

  await axios
    .get(url, {
      responseType: "arraybuffer",
      onDownloadProgress: (progressEvent) => {
        downloadProgress.value = progressEvent.progress
          ? Math.round(progressEvent.progress * 100)
          : 0;
      },
    })
    .then((response) => {
      arrayBuffer.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  // arrayBuffer.value = await response.arrayBuffer();
  console.log("Fetching data completed.");

  console.log("Detecting file type..");
  let ext = url.substring(url.lastIndexOf(".") + 1);
  let mimeType = mime.getType(url) as string;
  console.log("Detection completed.");

  // console.log(`EXT: ${ext} | MIME: ${mimeType}`)

  console.log("Opening preview...");
  if (excelExts.includes(ext)) {
    type.value = Type.EXCEL;
    const workbook = XLSX.read(arrayBuffer.value);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    excelData.value = XLSX.utils.sheet_to_json(worksheet);
    excelHeaders.value = Object.keys(excelData.value[0]);
  } else if (docExts.includes(ext)) {
    type.value = Type.WORD;
    console.log("WORD");
  } else if (pdfExts.includes(ext)) {
    type.value = Type.PDF;
    console.log("PDF");
  } else if (mimeType.startsWith("image")) {
    type.value = Type.IMAGE;
    console.log("IMAGE");
  } else {
    type.value = Type.UNKNOWN;
    console.log("UNKNOWN");
  }
  console.log("Done!");

  isLoading.value = false;
};

onMounted(() => {
  watchEffect(async () => {
    console.log("WATCHEFFECT");
    if (props.url) {
      visible.value = true;
      try {
        await load(props.url);
      } catch (e) {
        console.log(e);
        isLoading.value = false;
        isError.value = true;
      }
    }
  });

  watchEffect(() => {
    if (visible.value) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  });
});

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
</script>

<style lang="css" scoped></style>
