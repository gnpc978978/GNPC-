"use client";

import {
  EditorContent,
  useEditor,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],

    content: value,

    immediatelyRender: false,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "min-h-[200px] rounded-md border p-4 outline-none prose max-w-none",
      },
    },
  });


  if (!editor) {
    return (
      <div className="min-h-[200px] rounded-md border p-4 text-gray-400">
        Loading editor...
      </div>
    );
  }


  return (
    <div className="space-y-3">

      <div className="flex flex-wrap gap-2 rounded-md border bg-gray-50 p-2">

        <button
          type="button"
          onClick={() =>
            editor.chain()
              .focus()
              .toggleBold()
              .run()
          }
          className="rounded border px-3 py-1"
        >
          Bold
        </button>


        <button
          type="button"
          onClick={() =>
            editor.chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className="rounded border px-3 py-1"
        >
          Italic
        </button>


        <button
          type="button"
          onClick={() =>
            editor.chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
          className="rounded border px-3 py-1"
        >
          H2
        </button>


        <button
          type="button"
          onClick={() =>
            editor.chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className="rounded border px-3 py-1"
        >
          Bullet
        </button>


        <button
          type="button"
          onClick={() =>
            editor.chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className="rounded border px-3 py-1"
        >
          Number
        </button>

      </div>


      <EditorContent editor={editor} />

    </div>
  );
}