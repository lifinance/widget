import type { BeforeMount, OnMount } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import React, { useEffect, useRef, useState } from 'react';
import { useThemeMode } from '../hooks';
import { useTheme } from '@mui/material';
import { EditorContainer } from './DrawerControls';

interface MonacoEditor {
  layout: (dimensions: { width: number; height: number }) => void;
}

interface CodeEditorProps {
  code: string;
}

export const CodeEditor = ({ code }: CodeEditorProps) => {
  const [editor, setEditor] = useState();
  const editorContainerRef = useRef(null);
  const theme = useTheme();
  const themeMode = useThemeMode();
  const handleEditorWillMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme('lifi-monaco-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme.palette.grey[800],
        'editor.lineHighlightBackground': theme.palette.grey[900],
      },
    });
    monaco.editor.defineTheme('lifi-monaco-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme.palette.grey[100],
        'editor.lineHighlightBackground': theme.palette.grey[200],
      },
    });
  };
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setEditor(editor);
  };

  useEffect(() => {
    const resizeEditor = () => {
      if (editor && editorContainerRef.current) {
        (editor as MonacoEditor).layout({
          width: 0,
          height: 0,
        });
        const rect = (
          editorContainerRef.current as HTMLElement
        ).getBoundingClientRect();
        (editor as MonacoEditor).layout({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    resizeEditor();

    let observer = new ResizeObserver(resizeEditor);
    if (editorContainerRef.current) {
      observer.observe(editorContainerRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [editor, editorContainerRef.current]);

  return (
    <EditorContainer ref={editorContainerRef}>
      <Editor
        loading=""
        defaultLanguage="typescript"
        defaultValue={code}
        options={{
          lineNumbers: 'off',
          glyphMargin: false,
          folding: false,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: false,
        }}
        theme={themeMode === 'light' ? 'lifi-monaco-light' : 'lifi-monaco-dark'}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
      />
    </EditorContainer>
  );
};
