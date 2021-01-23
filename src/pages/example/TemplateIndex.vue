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
import Vue from "vue";
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  getCurrentInstance,
  SetupContext,
} from "@vue/composition-api";
import TemplateComp from "@/components/example/TemplateComp.vue";
import { StateInterface, names } from "@/store/example-module";

export default defineComponent({
  components: {
    TemplateComp,
  },
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

    const state = computed<StateInterface>(() => $store.state[names.module]);

    // $store.commit(names.module + "/" + names.mutations.SOME_MUTATION)
    // $store.dispatch(names.module + "/" + names.actions.SOME_ACTION)

    const rootElement = ref<HTMLElement | null>(null);
    const rootElementTagName = ref("");
    const compProps = {
      user: {
        firstName: "s",
        lastName: "b",
      },
    };

    const localTodo = ref(state.value.prop);
    const eventTip = ref("");
    function eventHandler(event: Event) {
      eventTip.value = JSON.stringify(event);
    }

    onMounted(async () => {
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
