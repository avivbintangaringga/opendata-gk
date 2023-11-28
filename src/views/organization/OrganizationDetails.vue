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
        <div class="flex flex-row justify-between mt-2 border-b-2 pb-4">
          <div>
            <div class="text-2xl md:text-3xl font-title font-semibold">
              {{ data?.title }}
            </div>
            <div class="rounded-full bg-primary text-white w-fit py-1 px-4 inline-flex items-center mt-2 gap-2">
              <span><i-mdi:file /></span>
              {{ data?.package_count }} dataset
            </div>
            <div class="text-secondary whitespace-pre-line mt-4">
              {{ data?.description }}
            </div>
          </div>
          <img
            :src="getImageUrl(data?.image_display_url)"
            :alt="data?.name"
            class="h-32 hidden ml-4 md:block"
          />
        </div>
  
        <div class="mt-2 flex flex-col gap-2">
          <PackageItem v-for="pkg in packages" :key="pkg.id" :data="pkg" />
        </div>
        
        <div class="w-full py-4 flex flex-row items-center justify-center">
  
          <Button label="Lihat selengkapnya >>" rounded @click="showMore()" />
        </div>
  
      </div>
      <div v-else class="h-screen flex justify-center items-center">
        <i-svg-spinners:bars-scale-fade />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { ckanApi } from "../../api/ckan-api";
  import { DetailsResult, Package } from "../../api/models";
  
  const id = useRoute().params.id as string;
  const router = useRouter()
  
  let data = ref<DetailsResult>();
  let packages = ref<Package[]>([]);
  
  let isLoading = ref(true);
  
  const getImageUrl = (url: string | undefined) => {
    if (!url) return;
    return url.startsWith("http")
      ? url
      : import.meta.env.VITE_CKAN_BASE_URL + "/uploads/group/" + url;
  };
  
  const showMore = () => {
      router.push({
        name: "datasets",
        query: {
          organization: id,
        },
      });
  }
  
  onMounted(async () => {
    isLoading.value = true;
    let groupDetailsPromise = ckanApi.getOrganizationDetails(id);
    let groupPackagesPromise = ckanApi.searchPackages(
      undefined,
      undefined,
      5,
      undefined,
      id
    );
    data.value = (await groupDetailsPromise).data.result;
    packages.value = (await groupPackagesPromise).data.result.results;
    isLoading.value = false;
  });
  </script>
  