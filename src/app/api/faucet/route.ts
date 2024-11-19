import { NextRequest, NextResponse } from "next/server";
import { prepareContractCall, sendTransaction } from "thirdweb";
import contract from "@/thirdweb/contract";
import serverWallet from "@/thirdweb/account";
import Faucet from "@/models/Facet";
import { connectDb } from "@/lib/database";

/**
 * @swagger
 * /api/faucet:
 *   post:
 *     summary: Send funds to a user's wallet address.
 *     description: Sends funds to a specified wallet address if the IP or address hasn't accessed funds within the last 24 hours.
 *     tags:
 *       - Faucet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: The wallet address to receive funds.
 *                 example: "0x1234...abcd"
 *               amount:
 *                 type: number
 *                 description: The amount of funds to be sent.
 *                 example: 100
 *     responses:
 *       200:
 *         description: Funds sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Funds sent successfully after 24 hours."
 *                 data:
 *                   type: string
 *                   description: Transaction hash of the transfer.
 *                   example: "0xtransactionHash..."
 *       400:
 *         description: Bad Request - IP address not determined or body data missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "IP address could not be determined."
 *       404:
 *         description: Not Found - Required body data is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Body data is required"
 *       429:
 *         description: Too Many Requests - Wait period of 24 hours not yet elapsed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please wait 24 hours before accessing again."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */


export async function POST(request: NextRequest) {
    await connectDb();
    const bodyData = await request.json();
    if (!bodyData) {
        return NextResponse.json({ success: false, message: "Body data is required" }, { status: 404 });
    }

    const toAddress = bodyData.to;
    console.log(bodyData)
    

    try {
        const xForwardedFor = request.headers.get('x-forwarded-for');
        const clientIp = xForwardedFor ? xForwardedFor.split(',')[0].trim() : null;
        const ipv4 = clientIp?.replace(/^::ffff:/, '') || null;

        if (!ipv4) {
            return NextResponse.json({ success: false, message: 'IP address could not be determined.' }, { status: 400 });
        }

        const transaction = await prepareContractCall({
            contract,
            method: "function mint(address to, uint256 amount) returns (bool)",
            params: [toAddress, bodyData.amount]
        });

        

        const existingRecord = await Faucet.findOne({
            $or: [
                { ipAddress: ipv4 },
                { address: bodyData.to }
            ]
        });

        if (existingRecord) {
            const now = new Date();
            const lastAccessed = new Date(existingRecord.updatedAt);
            const hoursDifference = (now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60);

            if (hoursDifference < 24) {
                return NextResponse.json({ success: false, message: "Please wait 24 hours before accessing again." });
            }

            if (existingRecord.address === bodyData.to) {
                // Proceed with funding
                const { transactionHash } = await sendTransaction({
                    transaction,
                    account: serverWallet
                });

                existingRecord.updatedAt = now;
                await existingRecord.save();
                return NextResponse.json({ success: true, message: "Funds sent successfully after 24 hours.", data: transactionHash });
                // If the same address is used after 24 hours, update only the updatedAt field
            } else {
                // If a different address is used after 24 hours, create a new document
                const { transactionHash } = await sendTransaction({
                    transaction,
                    account: serverWallet
                });

                await Faucet.create({ address: bodyData.to, ipAddress: ipv4 });
                return NextResponse.json({ success: true, message: "Funds sent successfully after 24 hours.", data: transactionHash });
            }
        }

        // If no previous record, create a new one
        const { transactionHash } = await sendTransaction({
            transaction,
            account: serverWallet
        });

        await Faucet.create({
            address: bodyData.to,
            ipAddress: ipv4
        });

        return NextResponse.json({ success: true, message: "Wallet faucet success", data: transactionHash });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal server error" });
    }
}
