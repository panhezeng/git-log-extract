<template>
  <div
    ref="editorElement"
    class="editor-comp"
  ></div>
</template>
<script lang="ts">
import type {PropType} from 'vue';
import {defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue';

import {useQuasar} from 'quasar';
import {useRoute, useRouter} from 'vue-router';

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
  emits: ['update:modelValue', 'ready', 'save'],
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(
    props: {
      modelValue: string;
      options: monaco.editor.IStandaloneEditorConstructionOptions;
      sync: boolean;
    },
    context,
  ) {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const editorElement = ref<HTMLElement | null>(null);
    let editor: monaco.editor.IStandaloneCodeEditor;

    // 格式化json
    function format() {
      editor && editor.getAction('editor.action.formatDocument').run();
    }
    function save() {
      if (editor) {
        format();
        const value = editor.getValue();
        context.emit('update:modelValue', value);
        context.emit('save', value);
      }
    }

    // 初始化
    function initEditor() {
      if (editorElement.value) {
        // 合并配置
        const options: monaco.editor.IStandaloneEditorConstructionOptions = {
          value: props.modelValue,
          theme: 'vs-dark',
          language: 'markdown',
          automaticLayout: true,
          scrollBeyondLastLine: false,
        };
        Object.assign(options, props.options);

        editor = monaco.editor.create(editorElement.value, options);

        if (props.sync) {
          editor.onDidChangeModelContent(() => {
            if (editor && props.modelValue !== editor.getValue()) {
              context.emit('update:modelValue', editor.getValue());
            }
          });
          watch(
            () => props.modelValue,
            () => {
              if (editor && props.modelValue !== editor.getValue()) {
                editor.setValue(props.modelValue);
              }
            },
          );
        }

        // 绑定键值
        // cmd + f
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
          format();
        });
        // cmd + s
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
          save();
        });
      }

      // 编辑器生成完成
      context.emit('ready', editor);
    }

    onMounted(async () => {
      await nextTick();
      // 初始化编辑器
      initEditor();
    });

    onBeforeUnmount(() => {
      // 销毁编辑器
      editor && editor.dispose();
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
