export default function CustomToolbar() {
  return (
    <div id="custom-toolbar">
      <select className="ql-font" />
      <select className="ql-size" />
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
      <select className="ql-color" />
      <select className="ql-background" />
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-align" value="" />
      <button className="ql-align" value="center" />
      <button className="ql-align" value="right" />
      <button className="ql-align" value="justify" />
    </div>
  );
}
