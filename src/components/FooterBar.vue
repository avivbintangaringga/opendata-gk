<template>
  <div class="bg-secondary h-fit text-sm text-white pt-12 pb-4">
    <div
      class="container mx-auto xl:max-w-6xl h-fit px-4 flex flex-col items-center"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="flex flex-col gap-4">
          <img src="/resources/images/logo-gray.png" class="h-12 w-fit" alt="Logo Open Data" />

          <a class="flex flex-row gap-2 items-center" href="mailto:kominfo@gunungkidulkab.go.id">
            <i-material-symbols:mail-rounded class="shrink-0" />
            Email: kominfo@gunungkidulkab.go.id
          </a>

          <a class="flex flex-row gap-2 items-center" href="tel:(0274)91259">
            <i-material-symbols:call class="shrink-0" />
            Telepon: (0274)91259
          </a>
        </div>
        <div class="flex flex-col gap-4">
          <p class="font-bold">Dinas Komunikasi dan Informatika</p>
          <a class="flex flex-row gap-2 items-center" href="https://maps.app.goo.gl/Pvckaf9GZsgJJ2FY9">
            <i-material-symbols:location-on-rounded class="shrink-0" />
            Jl. Brigjen Katamso No.1, Kec. Wonosari, Kabupaten Gunung Kidul,
            Daerah Istimewa Yogyakarta
          </a>

          <a class="flex flex-row gap-2 items-center" href="https://kominfo.gunungkidulkab.go.id/">
            <i-material-symbols:globe class="shrink-0" />
            Website: kominfo.gunungkidulkab.go.id
          </a>
        </div>
        <div class="flex flex-col gap-4">
          <p class="font-bold">Ikuti Kami</p>
          <a class="flex flex-row gap-2 items-center" href="https://www.instagram.com/kominfogunungkidul/">
            <i-mdi:instagram class="shrink-0" />
            Instagram
          </a>

          <a class="flex flex-row gap-2 items-center" href="https://www.youtube.com/channel/UCkEiJMkX7n3rZpZ2PDVc3Ow">
            <i-mdi:youtube class="shrink-0" />
            Youtube
          </a>

          <div class="flex flex-row gap-4">
            <img
              src="/resources/images/gunungkidul-gray.png"
              alt="Logo Gunungkidul"
              class="h-12 w-fit"
            />
            <img src="/resources/images/kominfo-gray.png" class="h-12 w-fit" alt="Logo Kominfo" />
          </div>
        </div>
      </div>
      <div class="flex flex-row gap-2 mt-12">
        Made with ❤️ by
        <a
          class="flex flex-row gap-1 items-center"
          href="https://www.github.com/avivbintangaringga"
        >
          <i-mdi:github class="shrink-0" />
          Aviv B.A
        </a>
      </div>
      <div class="mt-2 mb-2 text-center">
        Copyright © Open Data Gunungkidul {{ new Date().getFullYear() }}. All
        rights reserved
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
