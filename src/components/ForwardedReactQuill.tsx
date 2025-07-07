// src/components/ForwardedReactQuill.tsx
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactQuill from "react-quill";
import Quill from "quill";

// Register custom font and size whitelists so that selections apply correctly
const Font = Quill.import("formats/font");
Font.whitelist = [
  "serif",
  "monospace",
  "Arial",
  "Helvetica",
  "Georgia",
  "Verdana",
  "Tahoma",
];
Quill.register(Font, true);

const Size = Quill.import("attributors/style/size");
Size.whitelist = [
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
];
Quill.register(Size, true);

const toolbarConfig = {
  toolbar: false,
  history: { delay: 1000, maxStack: 100, userOnly: true },
};

const formats = [
  "font",
  "size",
  "header",
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

// BOLT-UI-ANPASSUNG 2025-01-15: Dieses Forwarding ermöglicht eine korrekte Weitergabe von Refs ohne findDOMNode!
const ForwardedReactQuill = forwardRef((props: any, ref) => {
  const innerRef = useRef<ReactQuill | null>(null);
  const [renderEditor, setRenderEditor] = useState(false);

  // Delay rendering slightly to avoid initial focus
  useEffect(() => {
    const id = setTimeout(() => setRenderEditor(true), 50);
    return () => clearTimeout(id);
  }, []);

  // Immediately blur after mount so the cursor is not placed automatically
  useEffect(() => {
    if (!renderEditor) return;
    try {
      const quill = innerRef.current?.getEditor?.();
      quill?.blur?.();
    } catch {
      /* ignored */
    }
  }, [renderEditor]);

  const setRefs = (instance: ReactQuill | null) => {
    innerRef.current = instance;
    if (typeof ref === "function") {
      ref(instance);
    } else if (ref && typeof ref === "object") {
      (ref as React.MutableRefObject<ReactQuill | null>).current = instance;
    }
  };

  const { autoFocus: _ignored, ...rest } = props || {};

  return renderEditor ? (
    <ReactQuill
      {...rest}
      ref={setRefs}
      modules={toolbarConfig}
      formats={formats}
    />
  ) : null;
});

export default ForwardedReactQuill;
