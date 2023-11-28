<template>
  <div class="container mx-auto xl:max-w-6xl pt-16 px-4 mt-8" ref="main">
    <div class="text-4xl font-bold">Dataset</div>

    <div class="flex flex-row justify-between">
      <div class="mt-8 text-secondary lg:w-3/5">
        Dapatkan akses ke kumpulan data terorganisir di Open Data Gunungkidul dan berkontribusi pada pengembangan masyarakat yang berbasis informasi.
      </div>

      <img
        src="/resources/images/illustrations/searching.svg"
        alt="Ilustrasi searching"
        class="ml-8 w-1/5 h-40"
      />
    </div>

    <div class="p-inputgroup flex-1 w-full mt-8">
      <InputText
        v-model="query"
        class="w-full"
        placeholder="Cari dataset"
        @keyup.enter="restart"
        ref="inputSearch"
      ></InputText>
      <Button class="bg-primary" @click="restart">
        <template #icon>
          <i-line-md:search />
        </template>
      </Button>
    </div>

    <div class="flex flex-row flex-wrap gap-4 mt-4 w-full overflow-clip">
      <Dropdown
        v-model="selectedOrganization"
        placeholder="Pilih organisasi"
        :options="organizations"
        optionLabel="display_name"
        optionValue="name"
        filter
        filterPlaceholder="Cari organisasi"
        scroll-height="400px"
        showClear
        class="basis-1/6"
        @change="restart()"
      >
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>
              {{ slotProps.option.display_name }}
              <Badge :value="slotProps.option.count" />
            </div>
          </div>
        </template>
      </Dropdown>

      <MultiSelect
        v-model="selectedGroups"
        placeholder="Pilih grup"
        :options="groups"
        optionLabel="display_name"
        optionValue="name"
        filter
        filterPlaceholder="Cari grup"
        scroll-height="400px"
        :show-toggle-all="false"
        class="basis-1/6"
        display="chip"
        @change="restart()"
      >
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>
              {{ slotProps.option.display_name }}
              <Badge :value="slotProps.option.count" />
            </div>
          </div>
        </template>
      </MultiSelect>

      <MultiSelect
        v-model="selectedTag"
        placeholder="Pilih tag"
        :options="tags"
        optionLabel="display_name"
        optionValue="name"
        filter
        filterPlaceholder="Cari tag"
        style="color: var(--text-color)"
        class="basis-1/6"
        display="chip"
        scroll-height="400px"
        :show-toggle-all="false"
        @change="restart()"
      >
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>
              {{ slotProps.option.display_name }}
              <Badge :value="slotProps.option.count" />
            </div>
          </div>
        </template>
      </MultiSelect>
    </div>

    <div class="mt-8" ref="scrollTarget">
      <div v-if="isLoading" class="flex flex-col mb-16">
        <DatasetListPlaceholder v-for="i in rows" :key="i" />
      </div>
      <div v-else>
        <template v-if="totalPackages > 0">
          <div
            class="pb-4 text-secondary border-b-2 border-border inline-flex flex-row justify-between items-center w-full"
          >
            <div>
              Ditemukan
              <div class="inline font-bold">{{ totalPackages }}</div>
              dataset
            </div>

            <Dropdown
              v-model="selectedSort"
              :options="sorts"
              optionLabel="title"
              optionValue="value"
              placeholder="Pilih urutan"
              @change="restart()"
            >
              <template #dropdownicon>
                <i-material-symbols:sort />
              </template>
            </Dropdown>
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <PackageItem v-for="pkg in packages" :key="pkg.id" :data="pkg" />
          </div>

          <Paginator
            class="my-4"
            v-model:rows="rows"
            v-model:first="first"
            :totalRecords="totalPackages"
            :rowsPerPageOptions="[10, 20, 30]"
            :template="{
              '640px': 'PrevPageLink CurrentPageReport NextPageLink',
              '960px':
                'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
              '1300px':
                'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
              default:
                'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown JumpToPageInput',
            }"
            @update:rows="
              changePage = true;
              search();
            "
          ></Paginator>
        </template>
        <div v-else class="text-error font-bold">Dataset tidak ditemukan</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputText from "primevue/inputtext";
import { ref, onMounted, watchEffect, watch } from "vue";
import { useRoute } from "vue-router";
import { ckanApi } from "../../api/ckan-api";
import {
  Package,
  Tag,
  PackageOrganization,
  PackageGroup,
} from "../../api/models";
import router from "../../router";

interface Sort {
  title: string;
  value: string;
}

let route = useRoute();

let packages = ref<Package[]>([]);
let totalPackages = ref(0);

let tags = ref<Tag[]>();
let organizations = ref<PackageOrganization[]>();
let groups = ref<PackageGroup[]>();

let query = ref();
let selectedOrganization = ref<string>();
let selectedGroups = ref<string[]>();
let selectedTag = ref<string[]>();

let isLoading = ref(true);
let scrollTarget = ref<HTMLDivElement>();

let rows = ref<number>(10);
let first = ref<number>(0);

let inputSearch = ref();

// TODO: Sort
let sorts = [
  {
    title: "Relevansi",
    value: "score+desc,+metadata_modified+desc",
  },
  {
    title: "Nama menaik",
    value: "title_string+asc",
  },
  {
    title: "Nama menurun",
    value: "title_string+desc",
  },
  {
    title: "Terakhir diubah",
    value: "metadata_modified+desc",
  },
];

let selectedSort = ref(sorts[0].value);
let changePage = false;

async function search() {
  isLoading.value = true;

  const data = (
    await ckanApi.searchPackages(
      query.value,
      first.value,
      rows.value,
      selectedSort.value,
      selectedOrganization?.value,
      selectedGroups?.value,
      selectedTag?.value
    )
  ).data;

  if (data.success) {
    packages.value = data.result.results;
    totalPackages.value = data.result.count;
    tags.value = data.result.search_facets.tags.items;
    organizations.value = data.result.search_facets.organization.items;
    groups.value = data.result.search_facets.groups.items;

    router.replace({
      name: "datasets",
      query: {
        q: query.value,
        first: first.value,
        sort: selectedSort.value,
        organization: selectedOrganization.value,
        groups: selectedGroups.value,
        tags: selectedTag.value,
      },
    });
  } else {
    // TODO: Handle Failed
  }

  if (changePage && scrollTarget.value) {
    // var offsetPosition = scrollTarget.value.getBoundingClientRect().top;
    // console.log("EL: " + scrollTarget.value.innerHTML)
    // console.log("OFFSET: " + offsetPosition)

    // window.scrollTo({
    //   top: offsetPosition,
    //   behavior: "smooth",
    // });

    scrollTarget.value.scrollIntoView({
      behavior: "smooth",
    });

    changePage = false;
  }

  isLoading.value = false;
}

async function restart() {
  first.value = 0;
  search();
}

onMounted(async () => {
  query.value = route.query.q as string;
  selectedOrganization.value = route.query.organization as string;
  selectedGroups.value = route.query.groups as string[];
  selectedTag.value = route.query.tags as string[];
  rows.value = parseInt(route.query.rows as string) || 10;
  first.value = parseInt(route.query.first as string) || 0;
  let inputFocus = (route.query.focus as string) == "true";
  search();

  // watch(route, (newValue, oldValue) => {
  //   // q: query.value,
  //   //     first: first.value,
  //   //     sort: selectedSort.value,
  //   //     organization: selectedOrganization.value,
  //   //     groups: selectedGroups.value,
  //   //     tags: selectedTag.value,

  //   if (newValue.name == oldValue.name) {
  //     return
  //   }

  //   query.value = newValue.params.q as string
  //   first.value = newValue.params.first as unknown as number
  //   selectedSort.value = newValue.params.sort as string
  //   selectedOrganization.value = newValue.params.organization as string
  //   selectedGroups.value = newValue.params.groups as string[]
  //   selectedTag.value = newValue.params.tags as string[]

  //   search()
  // })

  if (inputFocus) {
    inputSearch.value.$el.focus();
  }
});
</script>

<style lang="scss" scoped></style>
