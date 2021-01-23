import { onMounted, onBeforeUnmount } from "@vue/composition-api";
import { debounce, DebounceSettings } from "lodash";

export default (
  callback: () => void,
  wait?: number,
  options?: DebounceSettings
) => {
  const debounceCallback = debounce(callback, wait || 150, options);
  onMounted(async () => {
    window.addEventListener("resize", debounceCallback);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", debounceCallback);
  });

  return {};
};
