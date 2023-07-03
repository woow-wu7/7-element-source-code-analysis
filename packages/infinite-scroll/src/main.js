import throttle from "throttle-debounce/debounce";
import {
  isHtmlElement,
  isFunction,
  isUndefined,
  isDefined,
} from "element-ui/src/utils/types";
import { getScrollContainer } from "element-ui/src/utils/dom";

const getStyleComputedProperty = (element, property) => {
  if (element === window) {
    element = document.documentElement;
  }

  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  const css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
};

const entries = (obj) => {
  return Object.keys(obj || {}).map((key) => [key, obj[key]]);
};

const getPositionSize = (el, prop) => {
  return el === window || el === document
    ? document.documentElement[prop]
    : el[prop];
};

const getOffsetHeight = (el) => {
  return getPositionSize(el, "offsetHeight");
};

const getClientHeight = (el) => {
  return getPositionSize(el, "clientHeight");
};

const scope = "ElInfiniteScroll";
const attributes = {
  delay: {
    type: Number,
    default: 200,
  },
  distance: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  immediate: {
    type: Boolean,
    default: true,
  },
};

// getScrollOptions
const getScrollOptions = (el, vm) => {
  if (!isHtmlElement(el)) return {};

  // entries
  // const entries = (obj) => {
  //   return Object.keys(obj || {}).map((key) => [key, obj[key]]);
  // };

  // attributes - 是传入的props对象
  return entries(attributes).reduce((map, [key, option]) => {
    const { type, default: defaultValue } = option;
    let value = el.getAttribute(`infinite-scroll-${key}`); // 获取传入属性的值
    value = isUndefined(vm[value]) ? value : vm[value];
    switch (type) {
      case Number:
        value = Number(value);
        value = Number.isNaN(value) ? defaultValue : value;
        break;
      case Boolean:
        value = isDefined(value)
          ? value === "false"
            ? false
            : Boolean(value)
          : defaultValue;
        break;
      default:
        value = type(value);
    }
    map[key] = value;
    return map;
  }, {});
};

// top值
const getElementTop = (el) => el.getBoundingClientRect().top;

const handleScroll = function (cb) {
  const { el, vm, container, observer } = this[scope];
  const { distance, disabled } = getScrollOptions(el, vm);
  // distance 触发加载的距离阈值，单位为px
  // disabled 是否禁用

  if (disabled) return; // 禁用条件满足，不再往下执行，比如 loading.value || noMore.value

  const containerInfo = container.getBoundingClientRect();
  if (!containerInfo.width && !containerInfo.height) return; // 没形成滚动条件

  let shouldTrigger = false;

  // 指令所在元素 === 具有滚动条的元素
  // 1. el=== container触底判断
  if (container === el) {
    // be aware of difference between clientHeight & offsetHeight & window.getComputedStyle().height

    // scrollHeight - scrollTop - clientHeight <= distance 表示触底条件触发
    const scrollBottom = container.scrollTop + getClientHeight(container);
    shouldTrigger = container.scrollHeight - scrollBottom <= distance;
  }
  // 指令所在元素 !== 具有滚动条的元素
  // 2. el !== container 时的触底判断，即 el 是 container 的子元素，container可以滚动
  // - el 在 container 是否已经触底的公式
  //  - el.offsetHeight + el.top - container.top - container.offsetHeight - container.borderBottom因为包含border
  else {
    const heightBelowTop =
      getOffsetHeight(el) + getElementTop(el) - getElementTop(container);

    const offsetHeight = getOffsetHeight(container);
    const borderBottom = Number.parseFloat(
      getStyleComputedProperty(container, "borderBottomWidth")
    );
    shouldTrigger = heightBelowTop - offsetHeight + borderBottom <= distance;
  }

  if (shouldTrigger && isFunction(cb)) {
    cb.call(vm);
  } else if (observer) {
    observer.disconnect();
    this[scope].observer = null;
  }
};

// isScroll
// export const isScroll = (el, vertical) => {
//   if (isServer) return;
//   const determinedDirection = vertical !== null && vertical !== undefined;
//   const overflow = determinedDirection
//     ? vertical
//       ? getStyle(el, 'overflow-y')
//       : getStyle(el, 'overflow-x')
//     : getStyle(el, 'overflow');
//   return overflow.match(/(scroll|auto|overlay)/);
// };

// getScrollContainer
// export const getScrollContainer = (el, vertical) => {
//   if (isServer) return;
//   let parent = el;
//   while (parent) {
//     if ([window, document, document.documentElement].includes(parent)) {
//       return window;
//     }
//     if (isScroll(parent, vertical)) {
//       return parent;
//     }
//     parent = parent.parentNode;
//   }
//   return parent;
// };

export default {
  name: "InfiniteScroll",
  inserted(el, binding, vnode) {
    const cb = binding.value; // 指定的加载函数

    const vm = vnode.context;
    // only include vertical scroll
    const container = getScrollContainer(el, true); // 获取具有滚动条的元素
    const { delay, immediate } = getScrollOptions(el, vm); // 获取传入组件的属性的值 // delay 和 immediate 属性一般不会变化，所以可以在 mounted 时获取
    const onScroll = throttle(delay, handleScroll.bind(el, cb));

    // const scope = "ElInfiniteScroll";
    // 在 el 上挂载属性，方便获取 { el, vm, container, onScroll }
    el[scope] = { el, vm, container, onScroll };

    // 具有滚动条属性的元素 container
    if (container) {
      container.addEventListener("scroll", onScroll); // 添加 scroll 事件

      // immediate
      // - 是否立即执行加载方法，以防初始状态下内容无法撑满容器。
      if (immediate) {
        const observer = (el[scope].observer = new MutationObserver(onScroll));
        observer.observe(container, { childList: true, subtree: true });
        onScroll();
      }
    }
  },
  unbind(el) {
    const { container, onScroll } = el[scope];
    if (container) {
      container.removeEventListener("scroll", onScroll); // 移除 scroll 事件绑定
    }
  },
};
