"use client";

import React, { useCallback, useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold, Italic, Strikethrough, Underline, Quote, List, ListOrdered,
  Heading1, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Highlighter,
  Loader2 // Icon loading
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/axios";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref để điều khiển input file
  const [isUploading, setIsUploading] = useState(false); // State loading

  const setLink = useCallback(() => {
    if (!editor) {
      return null;
    }

    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // 1. Hàm kích hoạt input file ẩn
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 2. Hàm xử lý khi người dùng chọn file
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true); // Bật loading

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/file/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = res.data?.data?.secure_url;

      if (imageUrl) {
        editor?.chain().focus().setImage({
          src: imageUrl
        }).run();
      }

    } catch (error) {
      console.error("Lỗi upload:", error);
      alert("Upload ảnh thất bại!");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Component Button (Tái sử dụng)
  const ToolbarButton = ({
    onClick,
    isActive = false,
    icon: Icon,
    label,
    disabled = false
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    label: string;
    disabled?: boolean
  }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={cn(
        "p-2 rounded-md hover:bg-slate-200 transition-colors disabled:opacity-50",
        isActive ? "bg-slate-200 text-black font-bold" : "text-slate-600"
      )}
      title={label}
      type="button"
    >
      <Icon className={cn("w-4 h-4", disabled && "animate-spin")} />
    </button>
  );

  return (
    <div className=" border-b bg-slate-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10 items-center">
      {/* INPUT FILE ẨN - QUAN TRỌNG */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* --- HISTORY --- */}
      <div className="flex gap-1 pr-2 border-r border-slate-300">
        <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} icon={Undo} label="Undo" />
        <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} icon={Redo} label="Redo" />
      </div>

      {/* --- HEADINGS --- */}
      <div className="flex gap-1 px-2 border-r border-slate-300">
        <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor?.isActive("heading", { level: 1 })} icon={Heading1} label="H1" />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor?.isActive("heading", { level: 2 })} icon={Heading2} label="H2" />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor?.isActive("heading", { level: 3 })} icon={Heading3} label="H3" />
      </div>

      {/* --- FORMATTING --- */}
      <div className="flex gap-1 px-2 border-r border-slate-300">
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive("bold")} icon={Bold} label="Bold" />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive("italic")} icon={Italic} label="Italic" />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} isActive={editor?.isActive("underline")} icon={Underline} label="Underline" />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleStrike().run()} isActive={editor?.isActive("strike")} icon={Strikethrough} label="Strike" />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleHighlight().run()} isActive={editor?.isActive("highlight")} icon={Highlighter} label="Highlight" />
      </div>

      {/* --- ALIGNMENT --- */}
      <div className="flex gap-1 px-2 border-r border-slate-300">
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("left").run()} isActive={editor?.isActive({ textAlign: "left" })} icon={AlignLeft} label="Left" />
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("center").run()} isActive={editor?.isActive({ textAlign: "center" })} icon={AlignCenter} label="Center" />
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("right").run()} isActive={editor?.isActive({ textAlign: "right" })} icon={AlignRight} label="Right" />
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("justify").run()} isActive={editor?.isActive({ textAlign: "justify" })} icon={AlignJustify} label="Justify" />
      </div>

      {/* --- LISTS --- */}
      <div className="flex gap-1 px-2 border-r border-slate-300">
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive("bulletList")} icon={List} label="Bullet List" />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} isActive={editor?.isActive("orderedList")} icon={ListOrdered} label="Ordered List" />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} isActive={editor?.isActive("blockquote")} icon={Quote} label="Blockquote" />
      </div>

      {/* --- INSERTS --- */}
      <div className="flex gap-1 px-2">
        <ToolbarButton onClick={setLink} isActive={editor?.isActive("link")} icon={LinkIcon} label="Link" />

        {/* Nút Image đã được sửa lại logic */}
        <ToolbarButton
          onClick={handleImageClick}
          isActive={editor?.isActive("image")}
          icon={isUploading ? Loader2 : ImageIcon} // Đổi icon khi loading
          label="Image"
          disabled={isUploading}
        />
      </div>
    </div>
  );
}