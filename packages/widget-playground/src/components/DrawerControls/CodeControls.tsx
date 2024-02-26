import { Card } from '../Card';
import {
  Code,
  CodeContainer,
  CodeCopyButton,
  Pre,
  tooltipPopperZIndex,
} from './DrawerControls.style';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { WidgetConfig } from '@lifi/widget';
import { useConfig } from '../../store';
import { getValueFromPath } from '../../utils';
import { Box, Tooltip, Typography } from '@mui/material';
import { Tab, Tabs } from '../Tabs';
import React, { useState } from 'react';

const reactTemplate = (config?: string) =>
  config
    ? `import { LiFiWidget } from '@lifi/widget';

export function Widget() {
  const config = ${config.replace(/\n/g, '\n  ')}

  return (
      <LiFiWidget config={config} integrator="li.fi-playground" open />
  );
}
  `
    : null;

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

export const CodeControls = () => {
  const { config } = useConfig();
  const [codeTabsState, setCodeTabsState] = useState<'config' | 'react'>(
    'config',
  );

  const code =
    codeTabsState === 'config'
      ? configToStringWithSubstitions(config)
      : reactTemplate(configToStringWithSubstitions(config));

  const message =
    codeTabsState === 'config'
      ? 'Add this configuration to your widget'
      : 'Ensure that @lifi/widget is installed in your project';

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
    }
  };

  return (
    <Card sx={{ p: 1 }}>
      <Tabs
        value={codeTabsState}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={(_, value) => setCodeTabsState(value)}
      >
        <Tab label={'Config'} value="config" disableRipple />
        <Tab label={'React'} value="react" disableRipple />
      </Tabs>
      {code ? (
        <Box sx={{ marginTop: 1 }}>
          <Typography variant="caption">{message}</Typography>
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
            <Pre>
              <Code>{code}</Code>
            </Pre>
          </CodeContainer>
        </Box>
      ) : null}
    </Card>
  );
};
