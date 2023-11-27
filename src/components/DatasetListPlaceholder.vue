<template>
  <!-- Large -->
  <div class="hidden w-full md:flex flex-row items-center h-auto animate-pulse m-4">
    <Skeleton size="6rem" class="mx-4"/>
    <div class="flex flex-col ml-4 gap-1">
      <Skeleton width="38rem" />
      <Skeleton width="8rem" />
      <Skeleton width="22rem" />
      <Skeleton width="15rem" />
    </div>
  </div>
  <!-- Small -->
  <div class="md:hidden w-full flex flex-col items-start h-auto animate-pulse m-4">
    <Skeleton size="6rem" class="m-4 self-center"/>
    <div class="flex flex-col ml-4 gap-1">
      <Skeleton width="10rem" />
      <Skeleton width="4rem" />
      <Skeleton width="2rem" />
      <Skeleton width="5rem" />
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.p-multiselect {
  min-width: 17rem;
}
.p-multiselect-label {
  display: flex;
  flex-wrap: wrap;
}
.p-multiselect-token {
  margin: 0.1rem;
}
</style>