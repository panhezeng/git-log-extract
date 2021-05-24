<template>
  <div class="example-template-index-page" ref="rootElement">
    <p>rootElementTagName:{{ rootElementTagName }}</p>
    <div>
      <h3>导航:</h3>
      <div>
        <q-btn to="/">index</q-btn>
      </div>
    </div>
    <div>页面名：template-index</div>
    <template-comp
      :user="compProps.user"
      @template-comp-danger="eventHandler"
    />
    <div>localTodo:{{ localTodo }}</div>
    <div>eventTip:{{ eventTip }}</div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
import { defineComponent, ref, computed, onMounted } from "vue";

import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { storeKey } from "src/store";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

import { StateInterface, names } from "src/store/example-module";
import TemplateComp from "src/components/example/TemplateComp.vue";

export default defineComponent({
  components: {
    TemplateComp,
  },
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore(storeKey);
    const $q = useQuasar();

    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const state = computed(() => store.state[names.module] as StateInterface);

    // store.commit(names.module + "/" + names.mutations.SOME_MUTATION)
    // store.dispatch(names.module + "/" + names.actions.SOME_ACTION)

    const rootElement = ref<HTMLElement | null>(null);
    const rootElementTagName = ref("");
    const compProps = {
      user: {
        firstName: "s",
        lastName: "b",
      },
    };

    const localTodo = ref(state.value.example);
    const eventTip = ref("");
    function eventHandler(event: Event) {
      eventTip.value = JSON.stringify(event);
    }

    onMounted(() => {
      // console.log("pages onMounted ==============");

      // console.log(rootElement.value);
      if (rootElement.value) {
        rootElementTagName.value = rootElement.value.tagName;
      }
    });
    return {
      rootElement,
      rootElementTagName,
      compProps,
      localTodo,
      eventTip,
      eventHandler,
    };
  },
});
</script>
<style lang="less">
.example-template-index-page {
}
</style>
