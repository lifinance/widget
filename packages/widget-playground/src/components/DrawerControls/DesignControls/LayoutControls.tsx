import { defaultMaxHeight } from '@lifi/widget';
import { MenuItem, type SelectChangeEvent } from '@mui/material';
import type { CSSProperties } from 'react';
import { type ChangeEventHandler, useEffect, useState } from 'react';
import {
  type Layout,
  useConfig,
  useConfigActions,
  useConfigVariant,
  useEditToolsActions,
  useHeaderAndFooterToolValues,
  useLayoutValues,
} from '../../../store';
import {
  CardRowColumn,
  CardRowContainer,
  CardValue,
  ExpandableCard,
} from '../../Card';
import { popperZIndex } from '../DrawerControls.style';
import {
  CapitalizeFirstLetter,
  ControlRowContainer,
  Input,
  Select,
} from './DesignControls.style';

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

const layoutsWithHeightControls: Layout[] = [
  'restricted-height',
  'restricted-max-height',
];

const getLayoutMode = (container?: CSSProperties) => {
  let layoutMode: Layout = 'default';
  if (
    container &&
    container?.display === 'flex' &&
    container?.height === '100%'
  ) {
    layoutMode = 'full-height';
  } else if (container && Number.isFinite(container?.height)) {
    layoutMode = 'restricted-height';
  } else if (container && Number.isFinite(container?.maxHeight)) {
    layoutMode = 'restricted-max-height';
  }
  return layoutMode;
};

export const LayoutControls = () => {
  const { config } = useConfig();
  const { variant } = useConfigVariant();
  const { showMockHeader } = useHeaderAndFooterToolValues();
  const { setHeader, setContainer, getCurrentConfigTheme, setVariant } =
    useConfigActions();

  const { selectedLayoutId } = useLayoutValues();
  const { setSelectedLayoutId } = useEditToolsActions();
  const [heightValue, setHeightValue] = useState<number | undefined>();

  useEffect(() => {
    setSelectedLayoutId(getLayoutMode(config?.theme?.container));
  }, [config?.theme?.container, setSelectedLayoutId]);

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const newLayoutId = event.target.value;

    switch (newLayoutId) {
      case 'restricted-height':
        setHeader();

        const heightContainer = {
          ...(getCurrentConfigTheme()?.container ?? {}),
          height: defaultMaxHeight,
          display: undefined,
          maxHeight: undefined,
        };
        delete heightContainer.display;
        delete heightContainer.maxHeight;

        setContainer(heightContainer);

        break;
      case 'restricted-max-height':
        setHeader();

        const maxHeightContainer = {
          ...(getCurrentConfigTheme()?.container ?? {}),
          maxHeight: defaultMaxHeight,
          display: undefined,
          height: undefined,
        };
        delete maxHeightContainer.display;
        delete maxHeightContainer.height;

        setContainer(maxHeightContainer);

        break;
      case 'full-height':
        setVariant('compact');

        setHeader({
          position: 'fixed',
          top: showMockHeader ? 48 : 0,
        });

        const fullHeightContainer = {
          ...(getCurrentConfigTheme()?.container ?? {}),
          display: 'flex',
          height: '100%',
          maxHeight: undefined,
        };
        delete fullHeightContainer.maxHeight;

        setContainer(fullHeightContainer);
        break;
      default:
        setHeightValue(undefined);
        setHeader();

        const defaultContainer = {
          ...(getCurrentConfigTheme()?.container ?? {}),
          maxHeight: undefined,
          display: undefined,
          height: undefined,
        };
        delete defaultContainer.display;
        delete defaultContainer.height;
        delete defaultContainer.maxHeight;

        setContainer(defaultContainer);
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const valueConvertedToNumber = parseInt(e.target.value, 10);
    const height = Number.isFinite(valueConvertedToNumber)
      ? valueConvertedToNumber
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

        if (!height) {
          const newContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            maxHeight: defaultMaxHeight,
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
      <ControlRowContainer
        sx={selectedLayoutId !== 'default' ? { paddingBottom: 0 } : undefined}
      >
        <Select
          value={selectedLayoutId ?? ''}
          onChange={handleSelectChange}
          aria-label="Layout"
          MenuProps={{ sx: { zIndex: popperZIndex } }}
          disabled={variant === 'drawer'}
        >
          {layoutOptions?.map(({ name, id }: LayoutOption) => {
            return (
              <MenuItem value={id} key={id}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </ControlRowContainer>
      {layoutsWithHeightControls.includes(selectedLayoutId) ? (
        <CardRowContainer>
          <CardRowColumn>
            <label htmlFor="layout-height-input">
              {inputLabel[selectedLayoutId]}
            </label>
            {(heightValue && heightValue < defaultMaxHeight) || !heightValue ? (
              <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
                {`${defaultMaxHeight}px minimum`}
              </CapitalizeFirstLetter>
            ) : null}
          </CardRowColumn>
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
        <ControlRowContainer>
          <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
            full height should be used with the compact variant
          </CapitalizeFirstLetter>
        </ControlRowContainer>
      ) : null}
    </ExpandableCard>
  );
};
