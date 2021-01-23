<template>
  <div class="example-layout"><router-view /></div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  computed,
  defineComponent,
  onMounted,
  getCurrentInstance,
  SetupContext,
} from "@vue/composition-api";

export default defineComponent({
  components: {},
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(props: { [key: string]: any }, context: SetupContext) {
    const internalInstance = getCurrentInstance()!;
    const componentInstance = internalInstance.proxy as Vue & {
      [key: string]: any;
    };
    const { $axios, $store, $router, $q } = componentInstance;
    //  $route 不能析构，会丢失反应
    const $route = computed(() => componentInstance.$route);
    const $emit = context.emit;
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    // 在这获得 ref 关联的 DOM 元素
    onMounted(async () => {
      // console.log("pages onMounted ==============");
    });

    return {};
  },
});
</script>
<style lang="less">
.example-layout {
  height: 100%;
}
</style>
