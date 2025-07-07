import Quill from "quill";
import { StyleAttributor } from "parchment";

const Parchment = Quill.import("parchment");

const LineHeightStyle = new StyleAttributor(
  "lineheight",
  "line-height",
  {
    scope: (Parchment as any).Scope.BLOCK,
    whitelist: ["1", "1.15", "1.5", "2"],
  }
);

Quill.register(LineHeightStyle, true);

export default LineHeightStyle;
