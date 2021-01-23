<template>
  <div class="editor-comp" ref="editorElement"></div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  PropType,
  SetupContext,
  nextTick,
  watch,
} from "@vue/composition-api";

import * as monaco from "monaco-editor";

export default defineComponent({
  props: {
    value: {
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
    jsonDiagnosticsOptions: {
      type: Object as PropType<monaco.languages.json.DiagnosticsOptions>,
      default() {
        return {
          validate: true,
          allowComments: true,
        };
      },
    },
  },
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(
    props: {
      value: string;
      options: monaco.editor.IStandaloneEditorConstructionOptions;
      sync: boolean;
      jsonDiagnosticsOptions: monaco.languages.json.DiagnosticsOptions;
    },
    context: SetupContext
  ) {
    const internalInstance = getCurrentInstance()!;
    const componentInstance = internalInstance.proxy as Vue & {
      [key: string]: any;
    };
    const { $axios, $store, $router, $q } = componentInstance;
    //  $route 不能析构，会丢失反应
    const $route = computed(() => componentInstance.$route);
    const $emit = context.emit;
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const editorElement = ref<HTMLElement | null>(null);
    const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null);
    // 格式化json
    function format() {
      editor.value &&
        editor.value.getAction("editor.action.formatDocument").run();
    }

    // 初始化
    function initEditor() {
      if (editorElement.value) {
        if (props.options.language === "json") {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions(
            props.jsonDiagnosticsOptions
          );
        }
        // 合并配置
        const options = Object.assign(
          {
            value: props.value,
            theme: "vs-dark",
            language: "json",
            automaticLayout: true,
            scrollBeyondLastLine: false,
          },
          props.options
        );

        editor.value = monaco.editor.create(editorElement.value, options);

        if (props.sync) {
          editor.value.onDidChangeModelContent(() => {
            if (editor.value && props.value !== editor.value.getValue()) {
              $emit("input", editor.value.getValue());
            }
          });
          watch(
            computed(() => props.value),
            () => {
              if (editor.value && props.value !== editor.value.getValue()) {
                editor.value.setValue(props.value);
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
              $emit("save", value);
              $emit("input", value);
            }
          }
        );
        // cmd + y
        editor.value.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Y,
          () => {
            $emit("user-snippet", editor.value);
          }
        );
      }

      // 编辑器生成完成
      $emit("editor-ready", editor.value);
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
