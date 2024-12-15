'use client'

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";  // Mantine-based view for BlockNote
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react"; // Hook to create BlockNote editor instance
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
}

function Editor({ onChange, initialContent }: EditorProps) {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  // Handle file upload (using the provided edge store)
  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  // Initialize the editor using the useCreateBlockNote hook
  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUpload,
  });

  // Handle content changes and call the onChange prop
  editor.onChange(() => {
    onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
  });

  return (
    <div>
      {/* Render the editor view */}
      <BlockNoteView
        editor={editor}  // Pass the editor instance to the BlockNoteView
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}  // Set theme based on Next.js theme context
      />
    </div>
  );
}

export default Editor;
