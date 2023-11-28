<template>
  <div class="container mx-auto xl:max-w-6xl pt-16 px-4 mt-4">
    <div
      class="hidden h-auto md:inline-flex items-center gap-4 text-neutral-500 hover:text-neutral-600 cursor-pointer font-semibold rounded-full hover:bg-hover px-2 py-2"
      @click="$router.go(-1)"
    >
      <i-material-symbols:arrow-back-rounded class="h-6 w-auto" />
      Kembali
    </div>
    <div v-if="!isLoading">
      <div class="flex flex-row justify-between mt-2">
        <div>
          <div class="text-2xl md:text-3xl font-title font-semibold">
            {{ data?.title }}
          </div>
          <div
            class="mt-2 font-bold text-md text-primary py-2 px-4 rounded-full bg-gray-700/10 w-fit inline-flex items-center hover:cursor-pointer"
            @click="onOrganizationClick(data?.organization.name)"
          >
            <i-material-symbols:person class="mr-4 shrink-0" />
            {{ data?.organization.title }}
          </div>
          <div
            class="w-full inline-flex gap-2 items-center mt-4 text-gray-500 line-clamp-1 text-sm"
          >
            <i-material-symbols:calendar-clock />
            {{ getDateFormatted(data?.metadata_modified) }}
            <div class="font-semibold ms-1">
              ({{ getDateFromNow(data?.metadata_modified) }})
            </div>
          </div>
        </div>
        <img
          :src="getImageUrl(data?.organization.image_url)"
          :alt="data?.organization.name"
          class="h-32 hidden ml-4 md:block"
        />
      </div>
      <TabView class="mt-4" style="padding: 0">
        <TabPanel header="Dataset">
          <div class="text-lg font-bold">Deskripsi</div>
          <div class="mt-4">
            {{ data?.notes }}
            <span v-if="!data?.notes" class="italic text-neutral-400"
              >Tidak ada deskripsi</span
            >
          </div>

          <div v-if="data?.tags.length">
            <div class="text-lg font-bold mt-8">Tag</div>
            <div
              class="w-full inline-flex flex-wrap gap-2 mt-4 items-center text-gray-500 line-clamp-1"
            >
              <Chip
                v-for="d in data?.tags"
                :key="d.id"
                :label="d.name"
                @click="onTagClick(d.name)"
                class="hover:cursor-pointer"
              />
            </div>
          </div>
          <div class="text-lg font-bold mt-8">Dokumen</div>
          <Accordion class="mt-4">
            <AccordionTab v-for="r in data?.resources" :key="r.id">
              <template #header>
                <div class="line-clamp-3">
                  {{ r.name }}
                  <span v-if="!r?.name" class="italic text-neutral-400"
                    >Tidak ada judul</span
                  >
                </div>
              </template>
              <template #headericon>
                <div
                  class="text-white flex justify-center px-2 py-1 text-sm mr-2 lowercase w-14 bg-primary rounded-full"
                >
                  {{ r.format }}
                </div>
              </template>
              <div class="mb-4">
                {{ r.description }}
                <span v-if="!r.description" class="italic text-neutral-400"
                  >Tidak ada deskripsi</span
                >
              </div>

              <!-- <div v-if="r.format.toLowerCase().includes('xls')">
                EXCEL
              </div> -->

              <div class="flex flex-row flex-wrap gap-2">
                <Button
                  label="Unduh"
                  class="bg-primary py-2 shrink-0"
                  rounded
                  @click="openInNewTab(r.url)"
                >
                  <template #icon>
                    <i-material-symbols:cloud-download-rounded class="mr-2" />
                  </template>
                </Button>

                <Button
                  label="Metadata"
                  class="bg-primary py-2 shrink-0"
                  rounded
                  @click="openModal(r)"
                >
                  <template #icon>
                    <i-material-symbols:featured-play-list class="mr-2" />
                  </template>
                </Button>

                <Button
                  label="Preview"
                  class="bg-primary py-2 shrink-0"
                  rounded
                  @click="
                    openPreview(
                      // TODO: Disable CORS PROXY
                      r.url,
                      r.name
                    )
                  "
                >
                  <template #icon>
                    <i-material-symbols:preview class="mr-2" />
                  </template>
                </Button>
              </div>
            </AccordionTab>
          </Accordion>
          <Dialog
            v-model:visible="dialogVisible"
            modal
            header="Metadata"
            class="overflow-auto"
          >
            <DataTable :value="dialogData">
              <Column field="key" header="Field" />
              <Column field="value" header="Value" />
            </DataTable>
          </Dialog>

          <AsyncFilePreview
            v-model:visible="previewVisible"
            :url="previewUrl"
            :title="previewTitle"
          />
        </TabPanel>
        <TabPanel header="Grup">
          <div
            class="flex flex-row flex-wrap justify-between gap-4 items-start mb-16"
          >
            <CardItem
              v-for="d in data?.groups"
              :key="d.id"
              :data="d"
              @click="onGroupClick(d.name)"
            />
            <div v-if="!data?.groups.length">
              Dataset tidak masuk ke dalam grup apapun
            </div>
          </div>
        </TabPanel>
        <!-- <TabPanel header="Aktivitas"> </TabPanel> -->
      </TabView>
    </div>
    <div v-else class="h-screen flex justify-center items-center">
      <i-svg-spinners:bars-scale-fade />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from "luxon";
import { onMounted, ref, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ckanApi } from "../../api/ckan-api";
import { Package, Resource } from "../../api/models";

// import FilePreview from "../../components/FilePreview.vue";

const id = useRoute().params.id as string;
let data = ref<Package>();
let dialogVisible = ref(false);
let dialogData = ref<{ key: string; value: any }[]>();
let isLoading = ref(true);

let previewVisible = ref(false);
let previewUrl = ref<string>();
let previewTitle = ref<string>();

const AsyncFilePreview = defineAsyncComponent(
  () => import("../../components/FilePreview.vue")
);

const router = useRouter();
const onGroupClick = (id: string) => {
  router.push({
    name: "group-details",
    params: { id: id },
  });
};

const onOrganizationClick = (id: string | undefined) => {
  if (!id) return;

  router.push({
    name: "organization-details",
    params: { id: id },
  });
};

const onTagClick = (id: string) => {
  router.push({
    name: "datasets",
    query: { tags: [id] },
  });
};

const openInNewTab = (url) => {
  console.log(url);
  window.open(url, "_blank", "noreferrer");
};

const openModal = (res: Resource) => {
  dialogVisible.value = true;
  dialogData.value = Object.entries(res).map((x) => {
    return { key: x[0], value: x[1] || "null    " };
  });
};

const getImageUrl = (url: string | undefined) => {
  if (!url) return;
  return url.startsWith("http")
    ? url
    : import.meta.env.VITE_CKAN_BASE_URL + "/uploads/group/" + url;
};

const getDateFormatted = (date: string | undefined) => {
  if (!date) return;
  let d = DateTime.fromISO(date).setLocale("id");
  return d.toFormat("dd MMMM yyyy HH:mm");
};

const getDateFromNow = (date: string | undefined) => {
  if (!date) return;
  let d = DateTime.fromISO(date).setLocale("id");
  return d.toRelative();
};

const openPreview = async (url: string, title: string) => {
  let proxifiedUrl = import.meta.env.VITE_CORS_PROXY + url;

  previewVisible.value = true;
  previewUrl.value = proxifiedUrl;
  previewTitle.value = title;
};

onMounted(async () => {
  isLoading.value = true;
  data.value = (await ckanApi.getPackageDetails(id)).data.result;
  isLoading.value = false;
});
</script>

<style lang="css">
.p-tabview-panels {
  padding: 0;
}
</style>
