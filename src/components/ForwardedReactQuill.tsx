// src/components/ForwardedReactQuill.tsx
import React, { forwardRef } from "react";
import ReactQuill from "react-quill";

// BOLT-UI-ANPASSUNG 2025-01-15: Dieses Forwarding ermöglicht eine korrekte Weitergabe von Refs ohne findDOMNode!
const ForwardedReactQuill = forwardRef((props, ref) => (
  <ReactQuill {...props} ref={ref} />
));

export default ForwardedReactQuill;