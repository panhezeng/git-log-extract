<template>
  <div class="example-template-comp">
    <div>template-comp</div>
    <q-btn type="danger" @click="danger">危险按钮</q-btn>
    <p>{{ user.firstName + user.lastName }}</p>

    <div>
      <ul>
        <li v-for="todo in todos" :key="todo.id" @click="increment">
          {{ todo.id }} - {{ todo.content }}
        </li>
      </ul>

      <p>Clicks on todos: {{ clickCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  computed,
  defineComponent,
  ref,
  Ref,
  toRef,
  PropType,
  onServerPrefetch,
  onMounted,
  getCurrentInstance,
  SetupContext,
} from "@vue/composition-api";

import { Todo } from "@/components/example/models";

function useClickCount() {
  const clickCount = ref(0);

  function increment() {
    clickCount.value += 1;
    return clickCount.value;
  }

  return { clickCount, increment };
}

function useDisplayTodo(todos: Ref<Todo[]>) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}

interface User {
  firstName: string;
  lastName: string;
}

type PropValueType = {
  user: User;
  todos: Todo[];
};

export default defineComponent({
  components: {},
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },

    todos: {
      type: Array as PropType<Todo[]>,
      default: () => [] as Todo[],
    },
  },
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(props: PropValueType, context: SetupContext) {
    const internalInstance = getCurrentInstance()!;
    const componentInstance = internalInstance.proxy as Vue & {
      [key: string]: any;
    };
    const { $axios, $store, $router, $q } = componentInstance;
    //  $route 不能析构，会丢失反应
    const $route = computed(() => componentInstance.$route);
    const $emit = context.emit;
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    function danger(event: Event) {
      $emit("template-comp-danger", event);
      // console.log(event:Event);
    }

    // 在这获得异步数据，服务端渲染会等待结果后再输出页面
    onServerPrefetch(async () => {
      // console.log("pages onServerPrefetch ==============");
    });

    // 在这获得 ref 关联的 DOM 元素
    onMounted(async () => {
      // console.log("pages onMounted ==============");
    });

    return {
      danger,
      ...useClickCount(),
      ...useDisplayTodo(toRef(props, "todos")),
    };
  },
});
</script>
<style lang="less">
.example-template-comp {
}
</style>
