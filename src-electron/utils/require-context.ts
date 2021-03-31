type ReturnType = { module: { default: any }; path: string };

export default function (
  context: __WebpackModuleApi.RequireContext
): ReturnType[] {
  return context.keys().map((path: string) => {
    return { module: context(path), path } as ReturnType;
  });
}
