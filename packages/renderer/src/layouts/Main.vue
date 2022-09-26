<template>
  <router-view class="main-layout" />
</template>
<script lang="ts">
import {defineComponent, onMounted} from 'vue';

import {useQuasar} from 'quasar';
import {useRoute, useRouter} from 'vue-router';

export default defineComponent({
  components: {},
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();
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
.main-layout {
  height: 100%;
}
</style>
