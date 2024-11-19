import { createThirdwebClient } from "thirdweb";

const clientKey = process.env.NEXT_PUBLIC_CLIENT_ID || ""
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ""

const client = createThirdwebClient({
    clientId: clientKey,
    secretKey: secretKey,
});

export default client