// src/components/ForwardedReactQuill.tsx
import React, { forwardRef } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";

// BOLT-UI-ANPASSUNG 2025-01-15: Dieses Forwarding ermöglicht eine korrekte Weitergabe von Refs ohne findDOMNode!
const ForwardedReactQuill = forwardRef<ReactQuill, ReactQuillProps>((props, ref) => (
  <ReactQuill ref={ref} {...props} />
));

export default ForwardedReactQuill;