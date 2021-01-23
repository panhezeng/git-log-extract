// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import Vue, { VNode } from "vue";
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import Vue from "vue";
import { ComponentRenderProxy } from "@vue/composition-api";

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}

    // tslint:disable no-empty-interface
    interface ElementClass extends ComponentRenderProxy {}

    interface ElementAttributesProperty {
      $props: any; // 定义要使用的属性名称
    }

    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
