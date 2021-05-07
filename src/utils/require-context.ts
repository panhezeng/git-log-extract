import { Module } from "vuex";

type ReturnType = {
  module: Module<any, any> & {
    names: {
      module: string;
      getters?: { [key: string]: string };
      mutations?: { [key: string]: string };
      actions?: { [key: string]: string };
    };
    default: any;
  };
  path: string;
};

export default function (
  context: __WebpackModuleApi.RequireContext
): ReturnType[] {
  return context.keys().map((path: string) => {
    return { module: context(path), path } as ReturnType;
  });
}
