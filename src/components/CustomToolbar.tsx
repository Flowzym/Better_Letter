import React, { useEffect, useRef, useState } from 'react';
import type ReactQuill from 'react-quill';

interface CustomToolbarProps {
  quillRef: React.RefObject<ReactQuill>;
}

const UndoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 4v6h6" />
    <path d="M1 10l3.586-3.586a2 2 0 0 1 2.828 0L10 9" />
    <path d="M7 7a8 8 0 1 1 8 8" />
  </svg>
);

const RedoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" />
    <path d="M23 10l-3.586-3.586a2 2 0 0 0-2.828 0L14 9" />
    <path d="M17 7a8 8 0 1 0-8 8" />
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export default function CustomToolbar({ quillRef }: CustomToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (quillRef.current && toolbarRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbarModule = quill.getModule('toolbar');
      if (toolbarModule && toolbarModule.container !== toolbarRef.current) {
        toolbarModule.container = toolbarRef.current;
        // toolbarModule.init(); // removed, does not exist
      }
    }
  }, [quillRef]);

  return (
    <div className="toolbar-wrapper">
      <div ref={toolbarRef} className="flex flex-wrap items-center gap-2">
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
