import { useState } from 'react';
import { PageContainer, SentToWalletTabPanel } from './SendToWalletPage.style';
import { useTranslation } from 'react-i18next';
import { TabContext } from '@mui/lab';
import { Tab, Tabs } from '../../components/Tabs';
import { CustomTabPanel } from './CustomTabPanel';

type TabTypes = 'custom' | 'bookmarks';
export const SendToWalletPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabTypes>('custom');

  const handleTabsChange = (_: React.SyntheticEvent, newTabValue: TabTypes) => {
    setActiveTab(newTabValue);
  };

  return (
    <PageContainer>
      <TabContext value={activeTab}>
        <Tabs
          value={activeTab}
          aria-label="send to wallet tabs"
          indicatorColor="primary"
          onChange={handleTabsChange}
        >
          <Tab label={t(`button.custom`)} value="custom" disableRipple />
          <Tab label={t(`button.bookmarks`)} value="bookmarks" disableRipple />
        </Tabs>

        <SentToWalletTabPanel value="custom">
          <CustomTabPanel />
        </SentToWalletTabPanel>
      </TabContext>
    </PageContainer>
  );
};
