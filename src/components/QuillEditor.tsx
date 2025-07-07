import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export default function QuillEditor({
  value,
  onChange,
  autoFocus = false,
}: QuillEditorProps) {
  const editorRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const id = setTimeout(() => {
      editorRef.current?.focus();
    });
    return () => clearTimeout(id);
  }, [autoFocus]);

  return (
    <ReactQuill
      ref={editorRef}
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder="Text hier eingeben..."
    />
  );
}
