"use client";

import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

interface CustomTextareaProps {
  onContentChange?: (jsonContent: JSONContent) => void;
  onGenerate?: () => void;
  characterLimit?: number;
  initialEditorContent?: JSONContent | null;
  className?: string;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  onContentChange = () => {},
  onGenerate,
  characterLimit,
  initialEditorContent,
  className,
}) => {
  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "What chang you want to do...",
        emptyEditorClass: cn(
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:inset-x-1 before:top-3 before:opacity-50 before-pointer-events-none"
        ),
      }),
      CharacterCount.configure({
        limit: characterLimit,
      }),
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: cn(
          "min-w-0 min-h-[60px] max-h-[150px] wrap-anywhere text-foreground/90 scrollbar-thin overflow-y-auto w-full bg-background p-1 text-sm focus-visible:outline-none disabled:opacity-50 max-sm:text-8!",
          className
        ),
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onGenerate?.();
          return true;
        }
      },
      handlePaste: (_view, event) => {
        if (!characterLimit) return false;

        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const pastedText = clipboardData.getData("text/plain");
        const currentCharacterCount =
          editor?.storage.characterCount.characters() || 0;
        const totalCharacters = currentCharacterCount + pastedText.length;

        if (totalCharacters > characterLimit) {
          event.preventDefault();
          toast("Text too long", {
            description: `The pasted content would exceed the ${characterLimit} character limit.`,
          });
          return true;
        }

        return false;
      },
    },
    content: initialEditorContent || "",
    onCreate: ({ editor }) => {
      editor.commands.focus("end");
    },
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      onContentChange(jsonContent);
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.blur();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();
  const isLimitExceeded = characterLimit && characterCount > characterLimit;
  const shouldShowCount =
    characterLimit && characterCount >= characterLimit * 0.9;

  return (
    <div className="relative isolate">
      <EditorContent editor={editor} />
      {shouldShowCount && (
        <div className="pointer-events-none absolute right-3 bottom-2 z-10 flex text-xs">
          <span
            className={cn(
              "bg-background/10 rounded-full px-0.5 backdrop-blur-xs",
              isLimitExceeded ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {characterCount} / {characterLimit}
          </span>
        </div>
      )}
    </div>
  );
};

export default CustomTextarea;
