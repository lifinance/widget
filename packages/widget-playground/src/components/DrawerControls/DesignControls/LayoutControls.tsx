import { MenuItem, type SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { CardValue, ExpandableCard } from '../../Card';
import { popperZIndex } from '../DrawerControls.style';
import { Select } from './DesignControls.style';

interface LayoutOption {
  id: string;
  name: string;
}

export const LayoutControls = () => {
  const layoutOptions = [
    {
      id: 'restricted-height',
      name: 'Restricted Height',
    },
    {
      id: 'restrict-height',
      name: 'Restrict with container',
    },
    {
      id: 'mobile-height',
      name: 'Mobile optimised',
    },
  ];

  const [selectedLayoutId, setSelectedLayoutId] = useState('restricted-height');
  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelectedLayoutId(event.target.value);
  };

  return (
    <ExpandableCard
      title="Layout"
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>
          selected layout
        </CardValue>
      }
    >
      <Select
        value={selectedLayoutId}
        onChange={handleChange}
        aria-label="Layout"
        MenuProps={{ sx: { zIndex: popperZIndex } }}
      >
        {layoutOptions?.map(({ name, id }: LayoutOption) => {
          return (
            <MenuItem value={id} key={id}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </ExpandableCard>
  );
};
