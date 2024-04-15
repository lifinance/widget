import { useEffect, useRef, useState } from 'react';
import { Tooltip, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { BeforeMount, OnMount } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import { useThemeMode } from '../../../hooks';
import { tooltipPopperZIndex } from '../DrawerControls.style';
import {
  CodeContainer,
  EditorContainer,
  CodeCopyButton,
  EditorSkeleton,
} from './CodeControl.style';
import { useConfig, getConfigOutput } from '../../../store';
import { stringifyConfig } from './utils/stringifyConfig';

interface MonacoEditor {
  layout: (dimensions: { width: number; height: number }) => void;
}

interface CodeEditorProps {
  onChange?: (code: string | undefined) => void;
}

export const CodeEditor = ({ onChange }: CodeEditorProps) => {
  const { config } = useConfig();

  const [editor, setEditor] = useState();
  const editorContainerRef = useRef<HTMLElement | null>(null);
  const theme = useTheme();
  const themeMode = useThemeMode();

  const code = config ? stringifyConfig(getConfigOutput(config)) : undefined;

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

  // The Monaco editor isn't great for layout
  // This ensures the editor fills the EditorContainer
  useEffect(() => {
    const resizeEditor = () => {
      if (editor && editorContainerRef.current) {
        (editor as MonacoEditor).layout({
          width: 0,
          height: 0,
        });
        const rect = editorContainerRef.current.getBoundingClientRect();
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
    if (code) {
      navigator.clipboard.writeText(code);
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
          loading={
            <EditorSkeleton variant="rounded" width="100%" height="100%" />
          }
          defaultLanguage="typescript"
          value={code}
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
