<template>
  <div class="relative" id="scroll-target">
    <div class="fixed top-0 left-0 right-0 z-10">
      <HeaderBar :dividerVisible="dividierVisible" :key="$route.fullPath" />
    </div>
    <div class="min-h-screen" >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <ScrollTop />
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

let dividierVisible = ref(false);

const onScroll = (e) => {
  dividierVisible.value = window.scrollY != 0;
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
