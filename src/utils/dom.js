/* istanbul ignore next */

import Vue from "vue";

const isServer = Vue.prototype.$isServer;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);

// 1
// document.documentMode
// - 作用：返回浏览器渲染文档的模式
// - 返回值
//  5 - 页面在 IE5 模式下展示
//  7 - 页面在 IE7 模式下展示
//  8 - 页面在 IE8 模式下展示
//  9 - 页面在 IE9 模式下展示

/* istanbul ignore next */
const trim = function (string) {
  return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};
/* istanbul ignore next */
const camelCase = function (name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, "Moz$1");
};

/* istanbul ignore next */
export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

/* istanbul ignore next */
export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(" ") !== -1) {
    throw new Error("className should not contain space.");
  }
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }
}

/* istanbul ignore next */
export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || "").split(" ");

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += " " + clsName;
    }
  }
  if (!el.classList) {
    el.setAttribute("class", curClass);
  }
}

/* istanbul ignore next */
export function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(" ");
  var curClass = " " + el.className + " ";

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ");
    }
  }
  if (!el.classList) {
    el.setAttribute("class", trim(curClass));
  }
}

/* istanbul ignore next */
// getStyle
// - 版本号小于 ie9，是第一个函数，否则第二个函数
export const getStyle =
  ieVersion < 9
    ? function (element, styleName) {
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === "float") {
          styleName = "styleFloat";
        }
        try {
          switch (styleName) {
            case "opacity":
              try {
                return element.filters.item("alpha").opacity / 100;
              } catch (e) {
                return 1.0;
              }
            default:
              return element.style[styleName] || element.currentStyle
                ? element.currentStyle[styleName]
                : null;
          }
        } catch (e) {
          return element.style[styleName];
        }
      }
    // > ie9，现代浏览器
    : function (element, styleName) {
        // > ie9
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === "float") {
          styleName = "cssFloat";
        }
        try {
          // 1
          // document.defaultView
          // - 在浏览器中，该属性返回当前 document 对象所关联的 window 对象，如果没有，会返回 null

          // 2
          // Window.getComputedStyle()
          // - Window.getComputedStyle()方法 - 获取指定元素的 CSS 样式
          // - 该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值
          // - 私有的CSS属性值可以通过对象提供的 ( API ) 或通过简单地使用 ( CSS属性名 ) 称进行索引来 ( 访问 )

          // 3
          // window.getComputedStyle(elem,null).getPropertyValue("height") -------------- api访问

          var computed = document.defaultView.getComputedStyle(element, "");
          return element.style[styleName] || computed
            ? computed[styleName]
            : null; // -- 属性名访问
        } catch (e) {
          return element.style[styleName];
        }
      };

/* istanbul ignore next */
export function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === "object") {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    // styleName 是 string
    styleName = camelCase(styleName);
    if (styleName === "opacity" && ieVersion < 9) {
      element.style.filter = isNaN(value)
        ? ""
        : "alpha(opacity=" + value * 100 + ")";
    } else {
      element.style[styleName] = value;
    }
  }
}

// isScroll
export const isScroll = (el, vertical) => {
  if (isServer) return;

  const determinedDirection = vertical !== null && vertical !== undefined;
  
  const overflow = determinedDirection // 确定滚动的方向，x y 和 x+y，根据方向获取 overflow 设置的值，比如 scroll，auto，hidden
    ? vertical
      ? getStyle(el, "overflow-y")
      : getStyle(el, "overflow-x")
    : getStyle(el, "overflow");

  // 匹配 scroll auto overlay
  // - overflow: overlay; 
  //  - 表示: 当overflow的值为overlay时，行为与auto相同，但滚动条绘制在内容之上而不是占用空间。
  //  - 注意: 这是一个实验性质的属性值，不建议在生产环境使用
  return overflow.match(/(scroll|auto|overlay)/);
};

// getScrollContainer
// - 在 InfiniteScroll 组件中，vertical = true
export const getScrollContainer = (el, vertical) => {
  // const isServer = Vue.prototype.$isServer;
  if (isServer) return;

  let parent = el;
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window;
    }
    
    if (isScroll(parent, vertical)) {
      return parent; // 如果 el 具有滚动属性，同时值是 scroll|auto|overlay 就返回该 el
    }

    // 继续向上寻找
    parent = parent.parentNode;
  }

  return parent;
};

export const isInContainer = (el, container) => {
  if (isServer || !el || !container) return false;

  const elRect = el.getBoundingClientRect();
  let containerRect;

  if (
    [window, document, document.documentElement, null, undefined].includes(
      container
    )
  ) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }

  return (
    elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
  );
};
