import type { BoxProps } from '@mui/material';
import { useWidgetConfig } from '../../providers';
import { Card } from '../Card';

export const ContractComponent: React.FC<BoxProps> = (props) => {
  const { contractComponent } = useWidgetConfig();

  if (!contractComponent) {
    return null;
  }

  return (
    <Card flex={1} {...props}>
      {contractComponent}
    </Card>
  );
};
