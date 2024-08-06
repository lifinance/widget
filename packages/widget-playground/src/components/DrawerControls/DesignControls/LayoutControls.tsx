import { MenuItem, type SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { CardRowContainer, CardValue, ExpandableCard } from '../../Card';
import { popperZIndex } from '../DrawerControls.style';
import { Input, Select } from './DesignControls.style';

interface LayoutOption {
  id: string;
  name: string;
}

const layoutOptions = [
  {
    id: 'restricted-height',
    name: 'Restricted Height',
  },
  {
    id: 'restricted-max-height',
    name: 'Restricted Max Height',
  },
  {
    id: 'full-height',
    name: 'Full Height',
  },
];

interface InputLabel {
  [key: string]: string;
}

const inputLabel: InputLabel = {
  'restricted-height': 'Set height',
  'restricted-max-height': 'Set max height',
};

export const LayoutControls = () => {
  const [selectedLayoutId, setSelectedLayoutId] = useState('restricted-height');
  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelectedLayoutId(event.target.value);
  };

  return (
    <ExpandableCard
      title="Layout"
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>
          {layoutOptions.find((option) => option.id === selectedLayoutId)
            ?.name || ''}
        </CardValue>
      }
    >
      <CardRowContainer
        sx={
          selectedLayoutId !== 'full-height' ? { paddingBottom: 0 } : undefined
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
      </CardRowContainer>
      {selectedLayoutId !== 'full-height' ? (
        <CardRowContainer>
          <CardRowContainer
            sx={{
              flexGrow: 3,
            }}
          >
            <label htmlFor="height-input">{inputLabel[selectedLayoutId]}</label>
          </CardRowContainer>
          <Input id="height-input" type="number" />
        </CardRowContainer>
      ) : null}
    </ExpandableCard>
  );
};
