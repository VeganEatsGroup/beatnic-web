import Amex from './Amex'
import CreditCard from './CreditCard'
import Discover from './Discover'
import Mastercard from './Mastercard'
import Visa from './Visa'

export const cardIconsMap = {
  AMEX: <Amex />,
  DISC: <Discover />,
  MC: <Mastercard />,
  VISA: <Visa />,
  OTHER: <CreditCard />,
}
