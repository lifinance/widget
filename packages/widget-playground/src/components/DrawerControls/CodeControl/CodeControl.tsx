import { Card } from '../../Card';
import { TabContentContainer } from '../DrawerControls.style';
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
import {
  CRALogo,
  GatsbyLogo,
  NextLogo,
  RainbowKitLogo,
  RemixLogo,
  SvelteLogo,
  ViteLogo,
  VueLogo,
} from '../../../logo';
import { ProjectButton } from './CodeControl.style';

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

  return (
    <Card
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
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
        <TabContentContainer value="config" sx={{ flexGrow: 1, gap: 1 }}>
          {code ? (
            <>
              <Typography variant="caption">
                Add this configuration to your widget
              </Typography>
              <CodeEditor code={code} />
            </>
          ) : null}
        </TabContentContainer>
        <TabContentContainer value="examples" sx={{ gap: 1 }}>
          <Typography variant="caption">
            Examples of widget used in different projects
          </Typography>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/create-react-app"
            rel="nofollow"
            target="_blank"
            variant="text"
            startIcon={<CRALogo />}
          >
            Create-React-App
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/gatsby"
            rel="nofollow"
            target="_blank"
            variant="text"
            startIcon={<GatsbyLogo />}
          >
            Gatsby
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/nextjs14"
            rel="nofollow"
            target="_blank"
            variant="text"
            startIcon={<NextLogo />}
          >
            Next.js
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/remix"
            rel="nofollow"
            target="_blank"
            variant="text"
            startIcon={<RemixLogo />}
          >
            Remix
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/svelte"
            rel="nofollow"
            target="_blank"
            variant="text"
            startIcon={<SvelteLogo />}
          >
            Svelte
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/vite"
            rel="nofollow"
            target="_blank"
            variant="text"
            startIcon={<ViteLogo />}
          >
            Vite
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/vue"
            rel="nofollow"
            target="_blank"
            variant="text"
            startIcon={<VueLogo />}
          >
            Vue
          </ProjectButton>
          <Typography variant="caption">
            Example of widget with external wallet management
          </Typography>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/rainbowkit"
            rel="nofollow"
            target="_blank"
            variant="text"
            startIcon={<RainbowKitLogo />}
          >
            Rainbowkit
          </ProjectButton>
        </TabContentContainer>
      </TabContext>
    </Card>
  );
};
