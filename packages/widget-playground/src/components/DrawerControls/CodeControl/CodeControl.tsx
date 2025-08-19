import TabContext from '@mui/lab/TabContext'
import { Box, Typography } from '@mui/material'
import { GatsbyLogo } from '../../../logo/Gatsby.js'
import { NextLogo } from '../../../logo/Next.js'
import { NuxtLogo } from '../../../logo/Nuxt.js'
import { RainbowKitLogo } from '../../../logo/RainbowKit.js'
import { RemixLogo } from '../../../logo/Remix.js'
import { SvelteLogo } from '../../../logo/Svelte.js'
import { ViteLogo } from '../../../logo/Vite.js'
import { VueLogo } from '../../../logo/Vue.js'
import { useCodeToolValues } from '../../../store/editTools/useCodeToolValues.js'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions.js'
import { Card } from '../../Card/Card.style.js'
import { Tab, Tabs } from '../../Tabs/Tabs.style.js'
import { TabContentContainer } from '../DrawerControls.style.js'
import { CodeEditor } from './CodeEditor.js'
import { FontEmbedInfo } from './FontEmbedInfo.js'
import { ProjectButton } from './ProjectButton.js'

export const CodeControl = () => {
  const { codeControlTab } = useCodeToolValues()
  const { setCodeControlTab } = useEditToolsActions()

  return (
    <Card
      sx={[
        {
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        },
        codeControlTab === 'config'
          ? {
              flexGrow: 1,
            }
          : {
              flexGrow: 0,
            },
      ]}
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
        <TabContentContainer value="config" sx={{ gap: 1 }}>
          <Typography variant="caption">
            Add this configuration to your widget
          </Typography>
          <CodeEditor />
          <FontEmbedInfo />
        </TabContentContainer>
        <TabContentContainer value="examples" sx={{ gap: 1, paddingBottom: 1 }}>
          <Typography variant="caption">
            Examples of the widget used in different projects
          </Typography>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/gatsby"
            icon={<GatsbyLogo />}
          >
            Gatsby
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/nextjs"
            icon={<NextLogo />}
          >
            Next.js
          </ProjectButton>
          <ProjectButton
            href="https://github.com/lifinance/widget/tree/main/examples/nuxt"
            icon={<NuxtLogo />}
          >
            Nuxt
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
  )
}
