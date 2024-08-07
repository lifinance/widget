import { defaultMaxHeight } from '@lifi/widget';
import { MenuItem, type SelectChangeEvent } from '@mui/material';
import { type ChangeEventHandler, useEffect, useState } from 'react';
import { useConfig, useConfigActions } from '../../../store';
import { CardRowContainer, CardValue, ExpandableCard } from '../../Card';
import { popperZIndex } from '../DrawerControls.style';
import { CapitalizeFirstLetter, Input, Select } from './DesignControls.style';

type Layout =
  | 'default'
  | 'restricted-height'
  | 'restricted-max-height'
  | 'full-height';

interface LayoutOption {
  id: Layout;
  name: string;
}

const layoutOptions: LayoutOption[] = [
  {
    id: 'default',
    name: 'Default',
  },
  {
    id: 'restricted-max-height',
    name: 'Restricted Max Height',
  },
  {
    id: 'restricted-height',
    name: 'Restricted Height',
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
  const { config } = useConfig();
  const { setHeader, setContainer, getCurrentConfigTheme, setVariant } =
    useConfigActions();

  const [selectedLayoutId, setSelectedLayoutId] = useState<Layout>('default');
  const [heightValue, setHeightValue] = useState<number | undefined>();

  useEffect(() => {
    const container = config?.theme?.container;

    if (
      container &&
      container?.display === 'flex' &&
      container?.height === '100%'
    ) {
      setSelectedLayoutId('full-height');
    } else if (container && Number.isFinite(container?.height)) {
      setSelectedLayoutId('restricted-height');
      setHeightValue(container.height as number);
    } else if (container && Number.isFinite(container?.maxHeight)) {
      setSelectedLayoutId('restricted-max-height');
      setHeightValue(container.maxHeight as number);
    } else {
      setSelectedLayoutId('default');
    }
  }, [config?.theme?.container]);

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const newLayoutId = event.target.value;

    switch (newLayoutId) {
      case 'restricted-height':
        setHeader();
        setContainer({
          ...(getCurrentConfigTheme()?.container ?? {}),
          height: defaultMaxHeight,
          display: undefined,
          maxHeight: undefined,
        });

        break;
      case 'restricted-max-height':
        setHeader();
        setContainer({
          ...(getCurrentConfigTheme()?.container ?? {}),
          maxHeight: defaultMaxHeight,
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

        if (height && height >= defaultMaxHeight) {
          const containerWithMaxHeight = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            height,
          };

          setContainer(containerWithMaxHeight);
        }
        break;
      case 'restricted-max-height':
      default:
        if (getCurrentConfigTheme()?.header) {
          setHeader();
        }

        if (height && height >= defaultMaxHeight) {
          const newContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            maxHeight: height,
          };

          setContainer(newContainer);
        }
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
            {(heightValue && heightValue < defaultMaxHeight) || !heightValue ? (
              <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
                {`${defaultMaxHeight}px minimum`}
              </CapitalizeFirstLetter>
            ) : null}
          </CardRowContainer>
          <Input
            id="layout-height-input"
            type="number"
            value={heightValue ?? ''}
            placeholder={`${defaultMaxHeight}`}
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
