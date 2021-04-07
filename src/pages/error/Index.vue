<template>
  <div class="fullscreen bg-white text-negative q-pa-md">
    <div>
      <h6 class="text-negative">错误提示：</h6>
      <div style="white-space: pre-line">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

export default defineComponent({
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const $q = useQuasar();
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
    const message = ref(route.query.message || '404 not found');
    return {
      message,
    };
  },
});
</script>
