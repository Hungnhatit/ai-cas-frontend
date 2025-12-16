import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react';


import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import TiptapMenu from './TiptapMenu';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';

const TiptapEditor = () => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2]
      })
    ],
    editorProps: {
      attributes: {
        class: 'min-h-[500px] border rounded-[3px] shadow-none bg-slate-50 py-2 px-3'
      }
    }
  })

  return (
    <div>
      <TiptapMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor