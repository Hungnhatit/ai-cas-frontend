import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";
import { ImageNodeView } from "./ImageNodeView";

export const CustomImage = Image.extend({
  name: "customImage",
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },

  parseHTML() {
    return [
      {
        tag: "figure", 
        getAttrs: (element) => {          
          if (typeof element === "string") return {}; 

          const img = element.querySelector("img");
          const figcaption = element.querySelector("figcaption");
         
          return {
            src: img?.getAttribute("src"),
            alt: img?.getAttribute("alt"),
            title: img?.getAttribute("title"),
            caption: figcaption?.innerText || "", caption
          };
        },
      },
      {
        tag: "img", 
        getAttrs: (element) => {
          if (typeof element === "string") return {};
          return {
            src: element.getAttribute("src"),
            alt: element.getAttribute("alt"),
            title: element.getAttribute("title"),
            caption: element.getAttribute("data-caption") || "", 
          }
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...attributes } = HTMLAttributes;

    if (caption) {
      return [
        "figure",
        { class: "image-wrapper text-center" },
        [
          "img",
          mergeAttributes(this.options.HTMLAttributes, attributes),
        ],
        ["figcaption", { class: "text-lg text-slate-500 italic mt-2" }, caption],
      ];
    }

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, attributes),
    ];
  },
});