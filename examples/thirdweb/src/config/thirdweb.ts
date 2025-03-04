import { createThirdwebClient } from 'thirdweb'

export const THIRDWEB_CLIENT_ID: string = import.meta.env
  .VITE_THIRDWEB_CLIENT_ID

export const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
})
