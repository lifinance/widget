import { useTranslation } from 'react-i18next'
import { DateLabelContainer, DateLabelText } from './DateLabel.style.js'

interface DateLabelProps {
  date: Date
}

export const DateLabel: React.FC<DateLabelProps> = ({ date }) => {
  const { i18n } = useTranslation()

  return (
    <DateLabelContainer>
      <DateLabelText color="text.secondary">
        {date.toLocaleString(i18n.language, { dateStyle: 'long' })}
      </DateLabelText>
      <DateLabelText color="text.secondary">
        {date.toLocaleString(i18n.language, { timeStyle: 'short' })}
      </DateLabelText>
    </DateLabelContainer>
  )
}
