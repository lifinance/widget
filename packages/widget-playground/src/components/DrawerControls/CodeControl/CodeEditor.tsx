import { useEffect, useRef, useState } from 'react';
import { CircularProgress, Tooltip, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { BeforeMount, OnMount, OnChange } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import type { WidgetConfig } from '@lifi/widget';
import { useThemeMode } from '../../../hooks';
import { tooltipPopperZIndex } from '../DrawerControls.style';
import {
  CodeContainer,
  EditorContainer,
  CodeCopyButton,
} from './CodeControl.style';
import { getWhitelistedConfig, useConfig } from '../../../store';
import { getValueFromPath } from '../../../utils';

interface MonacoEditor {
  layout: (dimensions: { width: number; height: number }) => void;
}

const configTemplate = (config?: string) =>
  config ? `const config = ${config}` : null;

const substitions = {
  walletConfig: {
    '"walletConfig": {}': '"walletConfig": { async onConnect() {} }',
  },
};
const configToStringWithSubstitions = (
  config?: Partial<WidgetConfig>,
): string | undefined => {
  if (!config) {
    return undefined;
  }
  let stringifiedConfig = JSON.stringify(config, null, 2);

  Object.entries(substitions).forEach(([property, substition]) => {
    if (getValueFromPath(config, property)) {
      const [[find, replace]] = Object.entries(substition);
      stringifiedConfig = stringifiedConfig.replace(find, replace);
    }
  });

  return stringifiedConfig.replace(/"([^"]+)":/g, '$1:');
};

interface CodeEditorProps {
  onChange?: (code: string | undefined) => void;
}

export const CodeEditor = ({ onChange }: CodeEditorProps) => {
  const { config } = useConfig();

  const [editorContent, setEditorContent] = useState('');
  const [editor, setEditor] = useState();
  const editorContainerRef = useRef(null);
  const theme = useTheme();
  const themeMode = useThemeMode();

  const code = config
    ? configTemplate(
        configToStringWithSubstitions(getWhitelistedConfig(config)),
      )
    : null;

  useEffect(() => {
    if (code) {
      setEditorContent(code);
    }
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
          loading={<CircularProgress />}
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
