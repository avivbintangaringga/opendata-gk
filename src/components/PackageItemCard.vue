<template>
  <div
    class="p-4 flex flex-col border items-start hover:bg-hover rounded-xl hover:cursor-pointer select-none h-auto w-72 shrink-0"
    @click="onClick"
  >
    <img
      v-if="data.organization.image_url"
      :src="getImageUrl(data.organization.image_url)"
      :alt="data.organization.name"
      class="mb-4 mx-4 h-20 w-auto self-center"
    />
    <i-mdi:file
      v-if="!data.organization.image_url"
      class="mb-4 mx-4 h-20 w-auto self-center text-secondary"
    />

    <div class="flex flex-col grow">
      <div class="w-full line-clamp-2 text-text font-semibold">
        {{ data.title }}
      </div>
      <div
        class="w-full inline-flex gap-2 items-center text-gray-500 line-clamp-1 mt-2 text-sm"
      >
        <i-material-symbols:person class="shrink-0" />
        <div class="line-clamp-1">
          {{ data.organization.title }}
        </div>
      </div>
      <div
        class="w-full inline-flex gap-2 items-center text-gray-500 line-clamp-1 text-sm"
      >
        <i-material-symbols:calendar-clock class="shrink-0" />
        {{ dateString }}
        <div class="font-semibold ms-1">({{ fromNow }})</div>
      </div>
      <div
        class="w-full inline-flex gap-2 items-center text-gray-500 line-clamp-1 text-sm"
      >
        <i-material-symbols:file-copy-rounded class="shrink-0" />
        Jumlah File:
        <div class="font-bold">
          {{ data.num_resources }}
        </div>
        <div class="ml-4 inline-flex gap-2 flex-wrap">
          <Badge
            v-for="t in types"
            :key="t"
            :value="t"
            class="text-secondary"
            severity="info"
            rounded
          />
        </div>
      </div>
      <div
        class="w-full inline-flex flex-wrap gap-2 py-2 items-center text-gray-500 line-clamp-1"
      >
        <Chip v-for="d in tags" :key="d" :label="d" class="text-sm" />
      </div>
      <!-- <div class="w-full text-gray-500 line-clamp-1">
        {{ data.notes }}
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Package } from "../api/models.js";
import router from "../router/index.js";
import { DateTime } from "luxon";

let props = defineProps<{
  data: Package;
}>();

let data = props.data;

let tags = data.tags.map((x) => x.display_name);
let allFileTypes = data.resources.map((x) =>
  x.format.replace(".", "").toLocaleLowerCase()
);

let types = new Set(allFileTypes);

let date = DateTime.fromISO(data.metadata_modified).setLocale("id");
let dateString = date.toFormat("dd MMMM yyyy HH:mm");
let fromNow = date.toRelative();

const getImageUrl = (url: string | undefined) => {
  if (!url) return;
  return url.startsWith("http")
    ? url
    : import.meta.env.VITE_CKAN_BASE_URL + "/uploads/group/" + url;
};

const onClick = () => {
  router.push({
    name: "dataset-details",
    params: { id: data.name },
  });
};
</script>

<style lang="scss" scoped></style>
