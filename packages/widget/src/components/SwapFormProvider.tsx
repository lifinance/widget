import { FormProvider, useForm } from 'react-hook-form';

const defaultValues = {
  fromAmount: null,
  toAmount: null,
};

export const SwapFormProvider: React.FC = ({ children }) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};
