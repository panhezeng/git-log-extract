<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "App",
});
</script>
<style lang="less">
#q-app {
  background: #fff;
}
</style>
