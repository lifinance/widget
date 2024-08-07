import { MenuItem, type SelectChangeEvent } from '@mui/material';
import { type ChangeEventHandler, useState } from 'react';
import { useConfig, useConfigActions } from '../../../store';
import { CardRowContainer, CardValue, ExpandableCard } from '../../Card';
import { popperZIndex } from '../DrawerControls.style';
import { CapitalizeFirstLetter, Input, Select } from './DesignControls.style';

interface LayoutOption {
  id: string;
  name: string;
}

const layoutOptions = [
  {
    id: 'default',
    name: 'Default',
  },
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

const defaultHeight = 682;

export const LayoutControls = () => {
  const { config } = useConfig();
  const { setHeader, setContainer, getCurrentConfigTheme, setVariant } =
    useConfigActions();

  const [selectedLayoutId, setSelectedLayoutId] = useState(
    'restricted-max-height',
  );
  const [heightValue, setHeightValue] = useState<number | undefined>();

  // TODO: on mount establish the Layout mode

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const newLayoutId = event.target.value;

    setSelectedLayoutId(newLayoutId);
    setHeightValue(682);

    switch (newLayoutId) {
      case 'restricted-height':
        const newHeight = config?.theme?.container?.height;
        if (Number.isFinite(newHeight) || newHeight === undefined) {
          setHeightValue(newHeight as number | undefined);
        }

        setHeader();
        setContainer({
          ...(getCurrentConfigTheme()?.container ?? {}),
          height: Number.isFinite(newHeight) ? newHeight : undefined,
          display: undefined,
          maxHeight: undefined,
        });

        break;
      case 'restricted-max-height':
        const newMaxHeight = config?.theme?.container?.maxHeight;
        if (Number.isFinite(newMaxHeight) || newMaxHeight === undefined) {
          setHeightValue(newMaxHeight as number | undefined);
        }

        setHeader();
        setContainer({
          ...(getCurrentConfigTheme()?.container ?? {}),
          maxHeight: Number.isFinite(newMaxHeight) ? newMaxHeight : undefined,
          display: undefined,
          height: undefined,
        });

        break;
      case 'full-height':
        setVariant('compact');

        setHeader({
          position: 'fixed',
          // TODO: top defaults to 0 but if header is visible make it 48
          top: 48,
        });

        const newContainer = {
          ...(getCurrentConfigTheme()?.container ?? {}),
          display: 'flex',
          height: '100%',
          maxHeight: undefined,
        };

        setContainer(newContainer);
        break;
      default:
        setHeightValue(undefined);
        setHeader();
        setContainer({
          ...(getCurrentConfigTheme()?.container ?? {}),
          maxHeight: undefined,
          display: undefined,
          height: undefined,
        });
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const height = Number.isFinite(parseInt(e.target.value, 10))
      ? parseInt(e.target.value, 10)
      : undefined;

    setHeightValue(height);

    switch (selectedLayoutId) {
      case 'restricted-height':
        if (getCurrentConfigTheme()?.header) {
          setHeader();
        }

        const containerWithMaxHeight = {
          ...(getCurrentConfigTheme()?.container ?? {}),
          height: height ? Math.max(height, defaultHeight) : undefined,
        };

        setContainer(containerWithMaxHeight);
        break;
      case 'restricted-max-height':
      default:
        if (getCurrentConfigTheme()?.header) {
          setHeader();
        }

        const newContainer = {
          ...(getCurrentConfigTheme()?.container ?? {}),
          maxHeight: height ? Math.max(height, defaultHeight) : undefined,
        };

        setContainer(newContainer);
    }
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
        sx={selectedLayoutId !== 'default' ? { paddingBottom: 0 } : undefined}
      >
        <Select
          value={selectedLayoutId ?? ''}
          onChange={handleSelectChange}
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
      {selectedLayoutId !== 'full-height' && selectedLayoutId !== 'default' ? (
        <CardRowContainer>
          <CardRowContainer
            sx={{
              flexGrow: 3,
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <label htmlFor="layout-height-input">
              {inputLabel[selectedLayoutId]}
            </label>
            {(heightValue && heightValue <= 682) || !heightValue ? (
              <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
                682px minimum
              </CapitalizeFirstLetter>
            ) : null}
          </CardRowContainer>
          <Input
            id="layout-height-input"
            type="number"
            value={heightValue ?? ''}
            placeholder={`${defaultHeight}`}
            onChange={handleInputChange}
          />
        </CardRowContainer>
      ) : null}
      {selectedLayoutId === 'full-height' ? (
        <CardRowContainer>
          <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
            full height should be used with the compact variant
          </CapitalizeFirstLetter>
        </CardRowContainer>
      ) : null}
    </ExpandableCard>
  );
};
