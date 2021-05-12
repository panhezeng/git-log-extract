<template>
  <router-view class="example-layout" />
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
import { defineComponent, onMounted } from "vue";

import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { storeKey } from "src/store";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

export default defineComponent({
  components: {},
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
const store = useStore(storeKey);
    const $q = useQuasar();

    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    // 在这获得 ref 关联的 DOM 元素
    onMounted(async () => {
      // console.log("layout onMounted ==============");
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
