import { privateKeyToAccount } from "thirdweb/wallets";
import client from "./client";

const serverWalletAddress = process.env.SERVER_WALLET_ADDRESS || ""
const serverWallet = privateKeyToAccount({
    client,
    privateKey: serverWalletAddress
});

export default serverWallet