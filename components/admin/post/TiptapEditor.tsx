"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { Toolbar } from "./TiptapMenuBar";
import Paragraph from "@tiptap/extension-paragraph";
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading';
import Text from '@tiptap/extension-text'
import { Color, FontFamily, TextStyleKit } from '@tiptap/extension-text-style'
import { CustomImage } from "@/components/tiptap/image/CustomImage";
import TabKeyExtension from "@/components/tiptap/image/Tab";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5 space-y-1",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5 space-y-1",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "ml-1",
          },
        },
      }),
      Document,
      Paragraph,
      Text,
      Underline,
      TextStyleKit,
      Color,
      FontFamily,
      Highlight,
      // Image.configure({
      //   inline: true,
      //   allowBase64: true,
      // }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Nhập nội dung của bạn tại đây...",
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true
      }),
      TabKeyExtension
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3 \
          [&_h1]:text-3xl \
          [&_h1]:mb-4 \
          [&_h1]:font-bold \
          prose-h2:!text-2xl \
          prose-h3:!text-xl \
          [&_a]:font-bold\
          [&_a]:text-blue-700\
          [&_ul]:m-2\
           "
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="w-full border rounded-lg shadow-sm bg-white">
      <Toolbar editor={editor} />
      <div className="max-h-[1000px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}