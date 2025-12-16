import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3, Highlighter, Image, Italic, List, ListOrdered, Strikethrough } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { Editor } from "@tiptap/react";
import { Toggle } from '../ui/toggle';
import { api } from '@/lib/axios';
import { cn } from '@/lib/utils';

const TiptapMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive("highlight"),
    },
    {
      icon: <Image className="size-4" />,
      onClick: () => handleImageClick(),
      preesed: editor.isActive("image"),
    },
  ];


  return (
    <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  )
}

export default TiptapMenu