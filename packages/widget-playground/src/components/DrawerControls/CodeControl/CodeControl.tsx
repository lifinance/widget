import { Card } from '../../Card';
import {
  CodeContainer,
  CodeCopyButton,
  tooltipPopperZIndex,
  TabContentContainer,
} from '../DrawerControls.style';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { WidgetConfig } from '@lifi/widget';
import {
  useConfig,
  useEditToolsActions,
  useEditToolsValues,
} from '../../../store';
import { getValueFromPath } from '../../../utils';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { Tab, Tabs } from '../../Tabs';
import TabContext from '@mui/lab/TabContext';
import { CodeEditor } from './CodeEditor';

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

export const CodeControl = () => {
  const { config } = useConfig();
  const { codeControlTab } = useEditToolsValues();
  const { setCodeControlTab } = useEditToolsActions();

  const code = configTemplate(configToStringWithSubstitions(config));

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
    }
  };

  return (
    <Card
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: codeControlTab === 'config' ? 1 : 0,
      }}
    >
      <Box sx={{ maxWidth: 326, height: 56 }}>
        <Tabs
          value={codeControlTab}
          aria-label="tabs"
          indicatorColor="primary"
          onChange={(_, value) => setCodeControlTab(value)}
        >
          <Tab label={'Config'} value="config" disableRipple />
          <Tab label={'Examples'} value="examples" disableRipple />
        </Tabs>
      </Box>
      <TabContext value={codeControlTab}>
        <TabContentContainer value="config" sx={{ flexGrow: 1 }}>
          {code ? (
            <Box
              id={'A BOX'}
              sx={{
                marginTop: 1,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <Typography variant="caption">
                Add this configuration to your widget
              </Typography>
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
                <CodeEditor code={code} />
              </CodeContainer>
            </Box>
          ) : null}
        </TabContentContainer>
        <TabContentContainer value="examples">
          <Typography variant="caption" sx={{ marginTop: 1.5 }}>
            Examples of widget in different projects
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant="text">Create-React-App</Button>
            <Button variant="text">Gatsby</Button>
            <Button variant="text">Next.js</Button>
            <Button variant="text">Remix</Button>
            <Button variant="text">Svelte</Button>
            <Button variant="text">Vite</Button>
            <Button variant="text">Vue</Button>
          </Box>
          <Typography variant="caption">
            Example of widget with external wallet connection
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              marginBottom: 1.5,
            }}
          >
            <Button variant="text">Rainbowkit</Button>
          </Box>
        </TabContentContainer>
      </TabContext>
    </Card>
  );
};
