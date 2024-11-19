// "use client"

import { defineChain, getContract } from "thirdweb";
import client from "./client";

const contractAddress = process.env.CONTRACT_ADDRESS || ""
const lpTokenContract = process.env.NEXT_PUBLIC_DEFA_LPTOKEN || ""
const tvlContracts = process.env.NEXT_PUBLIC_TVL_CONTRACT || ""
const serverContracts = process.env.SERVER_CONTRACT_ADDRESS || ""
const walletContracts = process.env.NEXT_PUBLIC_WALLET_CONTRACT || ""   
const getContributionContracts = process.env.NEXT_PUBLIC_GETCONTRIBUTION_CONTRACT || ""

const contract = getContract({
    client,
    chain: defineChain(421614),
    address: contractAddress || serverContracts
});

export default contract

export const lpContarct = getContract({
    client,
    chain: defineChain(421614),
    address:lpTokenContract

})

export const tvlContract = getContract({
    client,
    chain: defineChain(421614),
    address:tvlContracts

})


export const wallectContract = getContract({ 
    client,
    chain: defineChain(421614),
    address: walletContracts

    // Replace with the address of your wallet contract
})

export const getContributionContract = getContract({
    client,
    chain: defineChain(421614),
    address: getContributionContracts 
})