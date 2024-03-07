import type { BeforeMount, OnMount, OnChange } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { useThemeMode } from '../../../hooks';
import { Tooltip, useTheme } from '@mui/material';
import {
  CodeContainer,
  EditorContainer,
  CodeCopyButton,
} from './CodeControl.style';
import { tooltipPopperZIndex } from '../DrawerControls.style';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface MonacoEditor {
  layout: (dimensions: { width: number; height: number }) => void;
}

interface CodeEditorProps {
  code: string;
  onChange?: (code: string | undefined) => void;
}

export const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  const [editorContent, setEditorContent] = useState('');
  const [editor, setEditor] = useState();
  const editorContainerRef = useRef(null);
  const theme = useTheme();
  const themeMode = useThemeMode();

  useEffect(() => {
    setEditorContent(code);
  }, [code]);

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

  const handleEditorChange: OnChange = (content) => {
    setEditorContent(content ? content : '');
    onChange?.(content);
  };
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setEditor(editor);
  };

  // The Monaco editor isn't great for layout
  // This ensures the editor fills the EditorContainer
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
  }, [editor, editorContainerRef]);

  const handleCopyCode = () => {
    if (editorContent) {
      navigator.clipboard.writeText(editorContent);
    }
  };

  return (
    <CodeContainer>
      <Tooltip
        title="Copy code"
        PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
        arrow
      >
        <CodeCopyButton onClick={handleCopyCode}>
          <ContentCopyIcon fontSize={'small'} />
        </CodeCopyButton>
      </Tooltip>
      <EditorContainer ref={editorContainerRef}>
        <Editor
          loading=""
          defaultLanguage="typescript"
          value={editorContent}
          onChange={handleEditorChange}
          options={{
            lineNumbers: 'off',
            glyphMargin: false,
            folding: false,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: false,
            contextmenu: false,
            readOnly: true,
          }}
          theme={
            themeMode === 'light' ? 'lifi-monaco-light' : 'lifi-monaco-dark'
          }
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
        />
      </EditorContainer>
    </CodeContainer>
  );
};
