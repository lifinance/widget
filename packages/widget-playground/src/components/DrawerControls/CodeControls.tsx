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
import { Tooltip } from '@mui/material';

// TODO: this should probable be done on config rehdration as well
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

  const code = configToStringWithSubstitions(config);
  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
    }
  };

  return (
    <Card sx={{ p: 1 }}>
      {code ? (
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
      ) : null}
    </Card>
  );
};
