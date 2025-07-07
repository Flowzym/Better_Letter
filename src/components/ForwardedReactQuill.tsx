// src/components/ForwardedReactQuill.tsx
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactQuill from "react-quill";

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

  return renderEditor ? <ReactQuill {...rest} ref={setRefs} /> : null;
});

export default ForwardedReactQuill;
