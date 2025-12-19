"use client";

import React, { useCallback, useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold, Italic, Strikethrough, Underline, Quote, List, ListOrdered,
  Heading1, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Highlighter,
  Loader2, // Icon loading
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/axios";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

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
        "p-2 rounded-md hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer",
        isActive ? "bg-slate-200 text-black font-bold" : "text-slate-600"
      )}
      title={label}
      type="button"
    >
      <Icon className={cn("w-4 h-4", disabled && "animate-spin")} />
    </button>
  );

  // --- HÀM XỬ LÝ MÀU SẮC ---
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    editor?.chain().focus().setColor(event.target.value).run();
  };

  const handleColorClick = () => {
    colorInputRef.current?.click();
  };

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "default") {
      editor?.chain().focus().unsetFontFamily().run();
    } else {
      editor?.chain().focus().setFontFamily(value).run();
    }
  };

  return (
    <div className="border-b bg-slate-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10 items-center">
      {/* INPUT FILE ẨN - QUAN TRỌNG */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <input
        type="color"
        ref={colorInputRef}
        onChange={handleColorChange}
        className="hidden"
      />

      {/* --- HISTORY --- */}
      <div className="flex gap-1 pr-2 border-r border-slate-300">
        <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} icon={Undo} label="Undo" />
        <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} icon={Redo} label="Redo" />
      </div>

      {/* --- FONT STYLE & COLOR (NEW) --- */}
      <div className="flex gap-1 px-2 border-r border-slate-300 items-center">
        {/* Font Select Dropdown */}
        <div className="relative mr-1">
          <select
            onChange={handleFontChange}
            value={editor?.getAttributes('textStyle').fontFamily || "default"}
            className="h-8 w-[100px] text-xs px-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
          >
            <option className="cursor-pointer" value="default">Default</option>
            <option className="cursor-pointer" value="Arial">Arial</option>
            <option className="cursor-pointer" value="Georgia">Georgia</option>
            <option className="cursor-pointer" value="Times New Roman">Times New Roman</option>
            <option className="cursor-pointer" value="Courier New">Courier New</option>
            <option className="cursor-pointer" value="Verdana">Verdana</option>
          </select>
        </div>

        {/* Color Button */}
        <div className="relative flex items-center">
          <ToolbarButton
            onClick={handleColorClick}
            icon={Palette}
            label="Text Color"
            isActive={!!editor?.getAttributes('textStyle').color}
          />
          <div
            className="w-3 h-3 rounded-full border border-slate-300 ml-[-6px] pointer-events-none"
            style={{ backgroundColor: editor?.getAttributes('textStyle').color || '#000' }}
          />
        </div>
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

      <div className="flex gap-1 px-2">
        <ToolbarButton onClick={setLink} isActive={editor?.isActive("link")} icon={LinkIcon} label="Link" />

        <ToolbarButton
          onClick={handleImageClick}
          isActive={editor?.isActive("image")}
          icon={isUploading ? Loader2 : ImageIcon}
          label="Image"
          disabled={isUploading}
        />
      </div>
    </div>
  );
}