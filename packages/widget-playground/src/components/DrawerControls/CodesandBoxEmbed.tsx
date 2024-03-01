import { Header, HeaderRow, tooltipPopperZIndex } from './DrawerControls.style';
import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect } from 'react';
import { createCodesandbox } from './createCodesandbox';

interface CodesandBoxEmbedProps {
  onClose: () => void;
}
export const CodesandBoxEmbed = ({ onClose }: CodesandBoxEmbedProps) => {
  const [iframeData, setIframeData] = React.useState({});

  const embedCodesandbox = React.useCallback(async () => {
    const data = await createCodesandbox();
    setIframeData(data);
  }, []);

  useEffect(() => {
    embedCodesandbox();
  }, []);

  return (
    <>
      <HeaderRow sx={{ paddingX: 2 }}>
        <Header as="h2" sx={{ fontSize: '1.2rem' }}>
          LI.FI Widget - React Example
        </Header>
        <Tooltip
          title="Close"
          PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
          arrow
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </HeaderRow>
      {iframeData ? <iframe title="vite-example" {...iframeData} /> : null}
    </>
  );
};
