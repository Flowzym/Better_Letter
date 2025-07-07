export default function CustomToolbar() {
  return (
    <div id="custom-toolbar">
      <select className="ql-font" defaultValue="">
        <option value="">Schriftart</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
      </select>

      <select className="ql-size" defaultValue="">
        <option value="">Größe</option>
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
      </select>

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
