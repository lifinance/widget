import { useTranslation } from 'react-i18next';

export function SwapPage() {
  const { t } = useTranslation();
  return (
    <div>
      {t(`swap.header`)}
    </div>
  );
}
