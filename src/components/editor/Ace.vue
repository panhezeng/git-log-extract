<template>
  <div class="editor-comp" ref="editorElement"></div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  PropType,
  nextTick,
  watch,
} from "vue";

import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { storeKey } from "src/store";
import { useQuasar } from "quasar";

import * as ace from "ace-builds";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/mode-markdown";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<Partial<ace.Ace.EditorOptions>>,
      default() {
        return {};
      },
    },
    sync: {
      type: Boolean,
      default: true,
    },
  },
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(
    props: {
      modelValue: string;
      options: Partial<ace.Ace.EditorOptions>;
      sync: boolean;
    },
    context
  ) {
    const router = useRouter();
    const route = useRoute();
const store = useStore(storeKey);
    const $q = useQuasar();
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const editorElement = ref<HTMLElement | null>(null);
    let editor: ace.Ace.Editor;

    // 初始化
    function initEditor() {
      if (editorElement.value) {
        // 合并配置
        const options: Partial<ace.Ace.EditorOptions> = {
          value: props.modelValue,
          theme: "ace/theme/nord_dark",
          mode: "ace/mode/markdown",
        };

        editor = ace.edit(editorElement.value, options);

        if (props.sync) {
          const emitValue = () => {
            if (editor && props.modelValue !== editor.getValue()) {
              context.emit("update:modelValue", editor.getValue());
            }
          };

          editor.on("input", emitValue);
          editor.on("paste", emitValue);
          editor.on("blur", emitValue);

          watch(
            () => props.modelValue,
            () => {
              if (editor && props.modelValue !== editor.getValue()) {
                editor.setValue(props.modelValue);
              }
            }
          );
        }
      }

      // 编辑器生成完成
      context.emit("ready", editor);
    }

    onMounted(async () => {
      await nextTick();
      // 初始化编辑器
      initEditor();
    });

    onBeforeUnmount(() => {
      // 销毁编辑器
      editor && editor.destroy();
    });

    return {
      editorElement,
    };
  },
});
</script>
<style lang="less">
.editor-comp {
}
</style>
