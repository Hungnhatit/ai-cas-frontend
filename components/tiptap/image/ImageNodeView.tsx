import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import React from "react";

export const ImageNodeView = (props: NodeViewProps) => {
  const { node, updateAttributes, selected } = props;

  return (
    <NodeViewWrapper className="image-component">
      <figure className={`relative my-6 transition-all ${selected ? "ring-2 ring-blue-500 rounded-lg" : ""}`}>
        <img
          src={node.attrs.src}
          alt={node.attrs.alt}
          className="rounded-lg shadow-md mx-auto block max-w-full h-auto"
        />

        {/* Input Caption */}
        <figcaption className="mt-2 text-center">
          <input
            type="text"
            placeholder="Nhập chú thích cho ảnh..."
            className="w-full text-center text-lg text-slate-500 italic bg-transparent border-none focus:ring-0 placeholder:text-slate-300"
            value={node.attrs.caption || ""}
            onChange={(e) => {
              updateAttributes({ caption: e.target.value });
            }}
          />
        </figcaption>
      </figure>
    </NodeViewWrapper>
  );
};