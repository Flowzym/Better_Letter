import Quill from "quill";
const LineHeightStyle = Quill.import("attributors/style/line-height");

Quill.register(LineHeightStyle, true);

export default LineHeightStyle;
