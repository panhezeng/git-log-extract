import xssType, * as xssAllType from "xss";
export default async function xss(): Promise<
  typeof xssType & typeof xssAllType
> {
  const xssModule: any = await import(/* webpackChunkName: "xss" */ "xss");
  return xssModule.default;
}

export async function plainText(html: string) {
  if (typeof html === "string" && html) {
    const filterXSS = new (await xss()).FilterXSS({
      whiteList: {}, // 白名单为空，表示过滤所有标签
      stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
      stripIgnoreTagBody: ["script"], // script标签较特殊，需要过滤标签中间的内容
    });
    return filterXSS
      .process(html)
      .trim()
      .replace(/&nbsp;/g, "");
  } else {
    return "";
  }
}
