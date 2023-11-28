<template>
    <div class="container mx-auto xl:max-w-6xl pt-16 px-4 mt-8" ref="main">
      <div class="text-4xl font-bold">Grup</div>
  
      <div class="flex flex-row justify-between">
        <div class="mt-8 text-secondary lg:w-3/5">
          Jelajahi berbagai grup data pada Open Data Gunungkidul dan temukan beragam dataset yang telah dikumpulkan dan dikelola dengan baik.
        </div>
  
        <img
          src="/resources/images/illustrations/folder.svg"
          class="ml-8 w-1/5 h-40"
          alt="Ilustrasi grup"
        />
      </div>
  
      <div class="p-inputgroup flex-1 w-full mt-8">
        <InputText
          v-model="query"
          class="w-full text-primary"
          placeholder="Cari grup"
          @keyup.enter="reload"
          ref="inputSearch"
        ></InputText>
        <Button class="bg-primary" @click="reload">
          <template #icon>
            <i-line-md:search />
          </template>
        </Button>
      </div>
  
      <div class="mt-4">
        <div v-if="isLoading" class="flex flex-row flex-wrap justify-between gap-2 sm:gap-4 items-start mb-16">
          <CardListPlaceholder v-for="i in 10" :key="i" />
        </div>
        <div v-else>
          <template v-if="data">
            <div
              class="mb-4 pb-4 text-secondary border-b-2 border-border inline-flex flex-row-reverse justify-between items-center w-full"
            >
              <Dropdown
                v-model="selectedSort"
                :options="sorts"
                optionLabel="title"
                optionValue="value"
                placeholder="Pilih urutan"
                @change="reload()"
              >
                <template #dropdownicon>
                  <i-material-symbols:sort />
                </template>
              </Dropdown>
  
              <div>
                Ditemukan
                <div class="inline font-bold">{{ data.length }}</div>
                grup
              </div>
            </div>
  
            <!-- <PackageItem v-for="pkg in packages" :key="pkg.id" :data="pkg" /> -->
  
            <div class="flex flex-row flex-wrap justify-between gap-2 sm:gap-4  items-start mb-16">
              <CardItem v-for="d in data" :key="d.id" :data="d" @click="onClick(d.name)" />
            </div>
          </template>
          <div v-else class="text-error font-bold">Grup tidak ditemukan</div>
        </div>
      </div>
    </div>
  </template>
    
    <script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { ckanApi } from "../../api/ckan-api";
  import { DetailsResult } from "../../api/models";
  import CardListPlaceholder from "../../components/CardListPlaceholder.vue";
import { useRouter } from "vue-router";

  const router = useRouter()
  
  let isLoading = ref(true);
  let inputSearch = ref();
  
  // TODO: Sort
  let sorts = [ 
    {
      title: "Nama menaik",
      value: "title+asc",
    },
    {
      title: "Nama menurun",
      value: "title+desc",
    }
  ];
  
  let selectedSort = ref(sorts[0].value);
  let query = ref();
  let data = ref<DetailsResult[]>([])
  
  const reload = async () => {
    isLoading.value = true
  
    let response = (await ckanApi.getGroups(query.value, selectedSort.value)).data.result
    data.value = response
  
    isLoading.value = false
  };

  const onClick = (id: string) => {
    router.push({
    name: "group-details",
    params: { id: id },
  });
  }
  
  onMounted(() => {
    reload();
  });
  </script>
    
    <style lang="scss" scoped>
  </style>