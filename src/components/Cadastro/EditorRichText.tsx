"use client";

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactQuill from 'react-quill-new';

// Importa o ReactQuill apenas no client-side (ssr: false)
//const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type EditorRichTextProps = {
  initialContent?: string;
  onContentChange?: (value: string) => void;
};

const EditorRichTextComponent: React.FC<EditorRichTextProps> = ({ initialContent = '', onContentChange }) => {
  const [content, setContent] = useState(initialContent);

  // Atualiza o estado somente se estiver vazio (primeira montagem)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  

  // Polyfill para ReactDOM.findDOMNode se não estiver definido
  if (typeof window !== 'undefined' && !(ReactDOM as any).findDOMNode) {
    (ReactDOM as any).findDOMNode = (instance: any) => instance;
  }

  const handleChange = (value: string) => {
    setContent(value);
    if (onContentChange) {
      onContentChange(value);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'link',
  ];

  return (
    <ReactQuill
      value={content}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      placeholder="Digite seu texto aqui..."
      className="min-h-[400px]"
    />
  );
};

const EditorRichText = React.memo(EditorRichTextComponent);

export default EditorRichText;
