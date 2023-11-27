<template>
  <nav
    class="h-16 font-normal select-none transition-all duration-300"
    :class="{
      'shadow-md': props.dividerVisible,
      'bg-surface': !transparentMode,
    }"
  >
    <div
      class="hidden md:flex flex-row container mx-auto xl:max-w-6xl items-center h-full px-4"
      :class="{'text-white': transparentMode}"
    >
      <router-link to="/">
        <img src="/resources/images/logo.png" alt="Logo" class="h-8 shrink-0" />
      </router-link>
      <router-link
        to="/datasets"
        class="ml-16 hover:text-primary"
        active-class="text-primary"
      >
        Dataset
      </router-link>
      <router-link
        to="/organizations"
        class="ml-8 hover:text-primary"
        active-class="text-primary"
      >
        Organisasi
      </router-link>
      <router-link
        to="/groups"
        class="ml-8 hover:text-primary"
        active-class="text-primary"
      >
        Grup
      </router-link>
      <router-link
        to="/about"
        class="ml-8 hover:text-primary"
        active-class="text-primary"
      >
        Tentang
      </router-link>
      <div class="flex-grow"></div>
      <!-- <Button
        @click="switchTheme"
        icon="pi"
        rounded
        class="text-primary border-none shrink-0 ml-4"
      >
        <div v-if="currentTheme == 'gk-theme'">
          <i-material-symbols:dark-mode />
        </div>
        <div v-else>
          <i-material-symbols:light-mode />
        </div>
      </Button> -->
    </div>

    <div
      class="md:hidden h-full flex flex-row-reverse items-center p-4 text-text justify-between"
    >
      <i-material-symbols:menu-rounded
        class="h-10 w-10 rounded-lg p-1.5 cursor-pointer hover:bg-gray-500 hover:bg-opacity-20"
        @click="menuVisible = !menuVisible"
      />

      <div class="flex flex-row-reverse">
        <router-link to="/">
          <img
            src="/resources/images/logo.png"
            alt="Logo"
            class="h-8 shrink-0"
            @click="menuVisible = false"
          />
        </router-link>
      </div>
    </div>
  </nav>

  <!-- Mobile -->
  <div
    v-if="menuVisible"
    class="h-fit p-4 bg-surface flex flex-col gap-3 shadow-lg select-none"
  >
    <router-link
      to="/datasets"
      class="hover:text-primary"
      active-class="text-primary"
      @click="menuVisible = false"
    >
      Dataset
    </router-link>
    <router-link
      to="/organizations"
      class="hover:text-primary"
      active-class="text-primary"
      @click="menuVisible = false"
    >
      Organisasi
    </router-link>
    <router-link
      to="/groups"
      class="hover:text-primary"
      active-class="text-primary"
      @click="menuVisible = false"
    >
      Grup
    </router-link>
    <router-link
      to="/about"
      class="hover:text-primary"
      active-class="text-primary"
      @click="menuVisible = false"
    >
      Tentang
    </router-link>
    <!-- <div class="flex flex-row justify-between items-center">
      Mode gelap
      <InputSwitch />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted } from "vue";
import { usePrimeVue } from "primevue/config";
import { useRoute } from "vue-router";

const primevue = usePrimeVue();
const props = defineProps<{
  dividerVisible: boolean;
}>();

const route = useRoute();

let currentTheme = ref("gk-theme");

let menuVisible = ref(false);

let transparentMode = ref(false)

const switchTheme = () => {
  let nextTheme = currentTheme.value == "gk-theme" ? "lara-dark" : "gk-theme";
  primevue.changeTheme(currentTheme.value, nextTheme, "theme-link", () => {
    currentTheme.value = nextTheme;
  });
};

watchEffect(() => {
  console.log("ROUTE UPDATED!")
  console.log(route.matched)
  
  if (!route.matched.length) return

  transparentMode.value = route.matched.some(({ name }) => name == 'home') && !props.dividerVisible
  console.log("TRANSPARENT MODE: " + transparentMode.value)
})

watchEffect(() => {
  transparentMode.value = !menuVisible.value
})

onMounted(() => {

})


</script>

<style lang="scss" scoped></style>
