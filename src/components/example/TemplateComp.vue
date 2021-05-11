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
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
import {
  computed,
  defineComponent,
  ref,
  Ref,
  toRef,
  PropType,
  onMounted,
} from "vue";

import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { storeKey } from "@/store";
import { useQuasar } from "quasar";
import { api } from "@/boot/axios";

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

  setup(props: PropValueType, context) {
    const router = useRouter();
    const route = useRoute();
const store = useStore(storeKey);
    const $q = useQuasar();

    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    function danger(event: Event) {
      context.emit("template-comp-danger", event);
      // console.log(event:Event);
    }

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
