<template>
  <div class="p-8 w-full sm:w-64 rounded-xl border flex flex-col items-center gap-2 hover:bg-hover  hover:cursor-pointer select-none">
    <img v-if="props.data.image_display_url" :src="getImageUrl(props.data.image_display_url)" class="h-20 w-auto" :alt="props.data.display_name" />
    <i-bi:building-fill v-if="!props.data.image_display_url && props.data.is_organization" class="h-20 w-auto text-secondary" />
    <i-material-symbols:folder v-if="!props.data.image_display_url && !props.data.is_organization" class="h-20 w-auto text-secondary" />
    <Badge
      v-if="props.data.package_count != undefined"
      class="text-secondary"
      severity="success"
      rounded
      :value="`${props.data.package_count} dataset`"
    />
    <div class="font-semibold text-center">
      {{ props.data.title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DetailsResult } from "../api/models.js";

const props = defineProps<{
  data: DetailsResult;
}>();

const getImageUrl = (url: string | undefined) => {
  if (!url) return;
  return url.startsWith("http")
    ? url
    : import.meta.env.VITE_CKAN_BASE_URL + "/uploads/group/" + url;
};
</script>

<style lang="scss" scoped></style>
