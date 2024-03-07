import { Card } from '../../Card';
import {
  TabContentContainer,
  tooltipPopperZIndex,
} from '../DrawerControls.style';
import type { WidgetConfig } from '@lifi/widget';
import {
  useConfig,
  useEditToolsActions,
  useEditToolsValues,
} from '../../../store';
import { getValueFromPath } from '../../../utils';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
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
import { getWhitelistedConfig } from '../../../store/widgetConfig/utils/getWhitelistedConfig';
import { ProjectButton } from './ProjectButton';
import { FontEmbedInfo } from './FontEmbedInfo';

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

  const code = config
    ? configTemplate(
        configToStringWithSubstitions(getWhitelistedConfig(config)),
      )
    : null;

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
              <FontEmbedInfo />
            </>
          ) : null}
        </TabContentContainer>
        <TabContentContainer value="examples" sx={{ gap: 1, paddingBottom: 1 }}>
          <Typography variant="caption">
            Examples of the widget used in different projects
          </Typography>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/create-react-app"
            icon={<CRALogo />}
          >
            Create-React-App
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/gatsby"
            icon={<GatsbyLogo />}
          >
            Gatsby
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/nextjs14"
            icon={<NextLogo />}
          >
            Next.js
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/remix"
            icon={<RemixLogo />}
          >
            Remix
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/svelte"
            icon={<SvelteLogo />}
          >
            Svelte
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/vite"
            icon={<ViteLogo />}
          >
            Vite
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/vue"
            icon={<VueLogo />}
          >
            Vue
          </ProjectButton>
          <Typography variant="caption">
            Example of the widget with external wallet management
          </Typography>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/rainbowkit"
            icon={<RainbowKitLogo />}
          >
            Rainbowkit
          </ProjectButton>
        </TabContentContainer>
      </TabContext>
    </Card>
  );
};
