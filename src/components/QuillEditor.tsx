import {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
} from "react";
import type ReactQuill from "react-quill";
import ForwardedReactQuill from "./ForwardedReactQuill";
import CustomToolbar from "./CustomToolbar";
import "react-quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function QuillEditor({
  value,
  onChange,
}: QuillEditorProps) {
  const editorRef = useRef<ReactQuill | null>(null);

  const modules = useMemo(
    () => ({
      toolbar: false,
      history: { delay: 1000, maxStack: 100, userOnly: true },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "color",
    "background",
  ];

  const preserveScrollPosition = useCallback((action: () => void) => {
    const quill = editorRef.current?.getEditor();
    if (!quill || !quill.root) return action();
    const scroll = quill.root.scrollTop;
    action();
    setTimeout(() => {
      if (quill && quill.root) {
        quill.root.scrollTop = scroll;
      }
    }, 0);
  }, []);

  const handleUndo = useCallback(() => {
    preserveScrollPosition(() => {
      const quill = editorRef.current?.getEditor();
      try {
        quill?.history?.undo();
      } catch {
        /* ignored */
      }
    });
  }, [preserveScrollPosition]);

  const handleRedo = useCallback(() => {
    preserveScrollPosition(() => {
      const quill = editorRef.current?.getEditor();
      try {
        quill?.history?.redo();
      } catch {
        /* ignored */
      }
    });
  }, [preserveScrollPosition]);

  const handleSelectAll = useCallback(() => {
    const quill = editorRef.current?.getEditor();
    try {
      const length = quill?.getLength ? quill.getLength() : 0;
      quill?.setSelection(0, length);
    } catch {
      /* ignored */
    }
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      const quill = editorRef.current?.getEditor();
      if (!quill) return;
      const selection = quill.getSelection();
      const text =
        selection && selection.length > 0 && typeof selection.index === "number"
          ? quill.getText(selection.index, selection.length)
          : quill.getText();
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignored */
    }
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const quill = editorRef.current?.getEditor();
      if (!quill) return;
      const selection =
        quill.getSelection() || { index: quill.getLength() || 0, length: 0 };
      if (typeof selection.index === "number") {
        quill.insertText(selection.index, text);
      }
    } catch {
      /* ignored */
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const [zoom, setZoom] = useState(100);
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 10, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - 10, 50));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(100);
  }, []);

  const handleZoomChange = useCallback((z: number) => {
    setZoom(z);
  }, []);

  const noop = useCallback(() => {}, []);

  return (
    <>
      <CustomToolbar
        quillRef={editorRef}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSelectAll={handleSelectAll}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onPrint={handlePrint}
        onTemplates={noop}
        onSettings={noop}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        zoom={zoom}
        onZoomChange={handleZoomChange}
        minZoom={50}
        maxZoom={200}
      />
      <ForwardedReactQuill
        ref={editorRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Text hier eingeben..."
      />
    </>
  );
}

