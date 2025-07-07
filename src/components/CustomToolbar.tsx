import React, { useEffect, useRef, useState } from 'react';
import type ReactQuill from 'react-quill';
import { Undo2, Redo2, MoreHorizontal } from 'lucide-react';

interface CustomToolbarProps {
  quillRef: React.RefObject<ReactQuill>;
}

const UndoIcon = () => <Undo2 className="w-4 h-4" />;
const RedoIcon = () => <Redo2 className="w-4 h-4" />;
const MoreIcon = () => <MoreHorizontal className="w-4 h-4" />;

export default function CustomToolbar({ quillRef }: CustomToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (quillRef.current && toolbarRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbarModule = quill.getModule('toolbar');
      if (toolbarModule && toolbarModule.container !== toolbarRef.current) {
        toolbarModule.container = toolbarRef.current;
      }
    }
  }, [quillRef]);

  return (
    <div className="toolbar-wrapper">
      <div ref={toolbarRef} id="toolbar" className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => quillRef.current?.getEditor().history.undo()} title="Rückgängig" className="p-1">
          <UndoIcon />
        </button>
        <button type="button" onClick={() => quillRef.current?.getEditor().history.redo()} title="Wiederholen" className="p-1">
          <RedoIcon />
        </button>

        <select className="ql-font" />
        <select className="ql-size" />

        <button className="ql-bold" title="Fett" />
        <button className="ql-italic" title="Kursiv" />
        <button className="ql-underline" title="Unterstrichen" />
        <button className="ql-strike" title="Durchgestrichen" />

        <button className="ql-list" value="ordered" title="Nummeriert" />
        <button className="ql-list" value="bullet" title="Aufzählung" />

        <select className="ql-color" />
        <select className="ql-background" />

        <button onClick={() => setShowAdvanced(!showAdvanced)} className="p-1 border rounded" title="Weitere Optionen">
          <MoreIcon />
        </button>

        {showAdvanced && (
          <div className="flex flex-wrap gap-2 p-2 bg-white border rounded shadow-md z-10">
            <select className="ql-lineheight" defaultValue="">
              <option value="">Zeilenhöhe</option>
              <option value="1">1.0</option>
              <option value="1.15">1.15</option>
              <option value="1.5">1.5</option>
              <option value="2">2</option>
              <option value="2.5">2.5</option>
              <option value="3">3</option>
            </select>
            <select className="ql-margintop" defaultValue="">
              <option value="">Abstand oben</option>
              <option value="0px">0</option>
              <option value="8px">8</option>
              <option value="16px">16</option>
              <option value="24px">24</option>
              <option value="32px">32</option>
            </select>
            <select className="ql-marginbottom" defaultValue="">
              <option value="">Abstand unten</option>
              <option value="0px">0</option>
              <option value="8px">8</option>
              <option value="16px">16</option>
              <option value="24px">24</option>
              <option value="32px">32</option>
            </select>
            <button className="ql-align" value="" title="Links" />
            <button className="ql-align" value="center" title="Zentriert" />
            <button className="ql-align" value="right" title="Rechts" />
            <button className="ql-align" value="justify" title="Blocksatz" />
          </div>
        )}
      </div>
    </div>
  );
}
