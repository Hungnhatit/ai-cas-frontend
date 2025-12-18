import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";
import { ImageNodeView } from "./ImageNodeView";

export const CustomImage = Image.extend({
  name: "customImage", // Đặt tên mới để tránh xung đột nếu cần

  // 1. Thêm thuộc tính caption
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
        // Khi render ra HTML (lưu vào DB), caption sẽ nằm trong attribute data-caption
        // Tuy nhiên, logic renderHTML dưới đây sẽ quyết định cấu trúc chính
      },
    };
  },

  // 2. Sử dụng Component React để hiển thị trong Editor
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },

  // 3. Cấu hình cách render ra HTML (để lưu vào DB và hiển thị ở Frontend)
  renderHTML({ HTMLAttributes }) {
    const { caption, ...attributes } = HTMLAttributes;

    // Nếu có caption, render cấu trúc <figure> <img/> <figcaption>...</figcaption> </figure>
    if (caption) {
      return [
        "figure",
        { class: "image-wrapper text-center" }, // Class cho thẻ figure
        [
          "img",
          mergeAttributes(this.options.HTMLAttributes, attributes),
        ],
        ["figcaption", { class: "text-lg text-slate-500 italic mt-2" }, caption],
      ];
    }

    // Nếu không có caption, render thẻ img bình thường
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, attributes),
    ];
  },
});