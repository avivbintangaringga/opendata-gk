<template>
  <div class="">
    <!-- <div class="absolute top-0 left-0 right-0"> -->
    <div class="bg-gradient-to-br from-primary to-secondary h-fit py-8">
      <div class="container mx-auto xl:max-w-6xl pt-16 px-4">
        <div class="flex flex-row justify-between text-white py-4">
          <div class="flex flex-col gap-8">
            <div class="text-3xl md:text-5xl font-semibold">
              Cari data tentang Gunungkidul kini bisa di mana saja, kapan saja
            </div>
            <div>
              Di sini Anda bisa akses koleksi data terlengkap di Gunungkidul
              dengan cepat, mudah, dan akurat dibantu berbagai fitur bermanfaat.
            </div>
            <div
              class="bg-primary w-fit py-4 px-8 rounded-full cursor-pointer inline-flex gap-2 items-center font-semibold"
              @click="onSearchClick()"
            >
              Mulai cari data
              <span><i-material-symbols:search-rounded /></span>
            </div>
          </div>
          <img
            src="/resources/images/illustrations/data.svg"
            alt=""
            class="w-2/6 md:w-2/5"
          />
        </div>
      </div>
    </div>
    <div class="container mx-auto xl:max-w-6xl px-4 mb-8">
      <div
        class="flex flex-row gap-4 mt-8 h-fit items-center justify-between flex-wrap"
      >
        <div
          class="rounded-xl border flex flex-col justify-center items-center p-4 md:p-8 gap-2 md:gap-4 w-full md:w-52 lg:w-72 text-primary text-3xl md:text-4xl hover:bg-hover hover:cursor-pointer"
          @click="onViewAllDatasetsClick()"
        >
          <div class="font-bold">
            {{ allDatasets.length }}
          </div>
          <i-foundation:graph-bar />
        </div>

        <div
          class="rounded-xl border flex flex-col justify-center items-center p-4 md:p-8 gap-2 md:gap-4 w-full md:w-52 lg:w-72 text-secondary text-3xl md:text-4xl hover:bg-hover hover:cursor-pointer"
          @click="onViewAllOrganizationsClick()"
        >
          <div class="font-bold">
            {{ organizations.length }}
          </div>
          <i-bi:building-fill />
        </div>

        <div
          class="rounded-xl border flex flex-col justify-center items-center p-4 md:p-8 gap-2 md:gap-4 w-full md:w-52 lg:w-72 text-tertiary text-3xl md:text-4xl hover:bg-hover hover:cursor-pointer"
          @click="onViewAllGroupsClick()"
        >
          <div class="font-bold">
            {{ groups.length }}
          </div>
          <i-material-symbols:folder />
        </div>
      </div>
      <div class="mt-8 h-fit">
        <div class="flex flex-row justify-between">
          <div class="font-bold text-xl">Dataset terbaru</div>
          <div
            class="flex flex-row items-center gap-2 text-primary cursor-pointer hover:text-secondary rounded-full px-4"
            @click="onViewAllDatasetsClick()"
          >
            Lihat semua
            <i-material-symbols:arrow-right-alt-rounded />
          </div>
        </div>
        <div class="flex flex-row mt-4 overflow-x-auto gap-4">
          <PackageItemCard
            :data="d"
            class="mb-2"
            v-for="d in latestDatasets"
            :key="d.id"
          />
          <DatasetHomePlaceholder
            v-for="i in 5"
            v-if="!latestDatasets.length"
          />
        </div>
      </div>
      <div class="mt-8 h-fit">
        <div class="flex flex-row justify-between">
          <div class="font-bold text-xl">Organisasi</div>
          <div
            class="flex flex-row items-center gap-2 text-primary cursor-pointer hover:text-secondary rounded-full px-4"
            @click="onViewAllOrganizationsClick()"
          >
            Lihat semua
            <i-material-symbols:arrow-right-alt-rounded />
          </div>
        </div>
        <div class="flex flex-row mt-4 overflow-x-auto gap-4">
          <CardItem
            :data="d"
            class="w-64 shrink-0 mb-2"
            v-for="d in organizations.slice(0, 5)"
            :key="d.id"
            @click="onOrganizationClick(d.name)"
          />
          <CardListPlaceholder v-for="i in 5" v-if="!organizations.length" />
        </div>
      </div>
      <div class="mt-8 h-fit">
        <div class="flex flex-row justify-between">
          <div class="font-bold text-xl">Grup</div>
          <div
            class="flex flex-row items-center gap-2 text-primary cursor-pointer hover:text-secondary rounded-full px-4"
            @click="onViewAllGroupsClick()"
          >
            Lihat semua
            <i-material-symbols:arrow-right-alt-rounded />
          </div>
        </div>
        <div class="flex flex-row mt-4 overflow-x-auto gap-4">
          <CardItem
            :data="d"
            class="w-64 shrink-0 mb-2"
            v-for="d in groups.slice(0, 5)"
            :key="d.id"
            @click="onGroupClick(d.name)"
          />

          <CardListPlaceholder v-for="i in 5" v-if="!groups.length" />
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { DetailsResult, Package } from "../../api/models";
import { onMounted, ref } from "vue";
import { ckanApi } from "../../api/ckan-api";
import PackageItem from "../../components/PackageItem.vue";
import CardItem from "../../components/CardItem.vue";
import DatasetHomePlaceholder from "../../components/DatasetHomePlaceholder.vue";
import CardListPlaceholder from "../../components/CardListPlaceholder.vue";

const router = useRouter();

const onSearchClick = () => {
  router.push({
    name: "datasets",
    query: {
      focus: "true",
    },
  });
};

const onViewAllDatasetsClick = () => {
  router.push({
    name: "datasets",
  });
};

const onViewAllOrganizationsClick = () => {
  router.push({
    name: "organizations",
  });
};

const onOrganizationClick = (id: string) => {
  router.push({
    name: "organization-details",
    params: { id: id },
  });
};

const onGroupClick = (id: string) => {
  router.push({
    name: "group-details",
    params: { id: id },
  });
};

const onViewAllGroupsClick = () => {
  router.push({
    name: "groups",
  });
};

let allDatasets = ref<string[]>([]);
let latestDatasets = ref<Package[]>([]);
let organizations = ref<DetailsResult[]>([]);
let groups = ref<DetailsResult[]>([]);

onMounted(async () => {
  let allDatasetsPromise = ckanApi.getPackages();
  let latestDatasetsPromise = ckanApi.searchPackages(
    undefined,
    undefined,
    5,
    "metadata_modified+desc"
  );
  let organizationPromise = ckanApi.getOrganizations();
  let groupsPromise = ckanApi.getGroups();

  allDatasets.value = (await allDatasetsPromise).data.result;
  latestDatasets.value = (await latestDatasetsPromise).data.result.results;
  organizations.value = (await organizationPromise).data.result;
  groups.value = (await groupsPromise).data.result;
});
</script>

<style lang="css" scoped></style>
