<template>
  <div class="editor-comp" ref="editorElement"></div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  PropType,
  nextTick,
  watch,
} from 'vue';

import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

import * as monaco from 'monaco-editor';

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
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
      options: monaco.editor.IStandaloneEditorConstructionOptions;
      sync: boolean;
    },
    context
  ) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const $q = useQuasar();
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const editorElement = ref<HTMLElement | null>(null);
    const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null);
    // 格式化json
    function format() {
      editor.value &&
        editor.value.getAction('editor.action.formatDocument').run();
    }

    // 初始化
    function initEditor() {
      if (editorElement.value) {
        // 合并配置
        const options = Object.assign(
          {
            value: props.modelValue,
            theme: 'vs-dark',
            language: 'markdown',
            automaticLayout: true,
            scrollBeyondLastLine: false,
          },
          props.options
        );

        editor.value = monaco.editor.create(editorElement.value, options);

        if (props.sync) {
          editor.value.onDidChangeModelContent(() => {
            if (editor.value && props.modelValue !== editor.value.getValue()) {
              context.emit('update:modelValue', editor.value.getValue());
            }
          });
          watch(
            computed(() => props.modelValue),
            () => {
              if (
                editor.value &&
                props.modelValue !== editor.value.getValue()
              ) {
                editor.value.setValue(props.modelValue);
              }
            }
          );
        }

        // 绑定键值
        // cmd + f
        editor.value.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_F,
          () => {
            format();
          }
        );
        // cmd + s
        editor.value.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
          () => {
            if (editor.value) {
              const value = editor.value.getValue();
              format();
              context.emit('save', value);
              context.emit('update:modelValue', value);
            }
          }
        );
        // cmd + y
        editor.value.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Y,
          () => {
            context.emit('user-snippet', editor.value);
          }
        );
      }

      // 编辑器生成完成
      context.emit('editor-ready', editor.value);
    }

    onMounted(async () => {
      await nextTick();
      // 初始化编辑器
      initEditor();
    });

    onBeforeUnmount(() => {
      // 销毁编辑器
      editor.value && editor.value.dispose();
    });

    return {
      editorElement,
      editor,
    };
  },
});
</script>
<style lang="less">
.editor-comp {
}
</style>
