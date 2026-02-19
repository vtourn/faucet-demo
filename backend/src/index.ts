import dotenv from 'dotenv'
import cors from 'cors'
import express, { 
    Request, 
    Response 
} from 'express'
import { isAddress, isHexString } from 'ethers'
import { ok, fail } from './response'
import {
    JsonRpcProvider, 
    Wallet, 
    parseEther
} from 'ethers'

dotenv.config();

const PORT = process.env.PORT || 3000;
const FAUCET_AMOUNT = process.env.FAUCET_AMOUNT || "0.001";

const app = express();

// Using CORS for local dev
app.use(cors());
app.use(express.json());

export interface FaucetRequest {
  address: string
}

const provider = new JsonRpcProvider(process.env.SEPOLIA_ENDPOINT);
const wallet = new Wallet(process.env.FAUCET_PRIVATE_KEY as string, provider);

/**
 * Request ETH funcding
 */
app.post("/fund", async (request: Request, response: Response) => {
    const { address } = request.body as FaucetRequest;

    if (!address) {
        // Returning 400 bad request status
        return response.status(400)
            .json(
                fail("No ETH address supplied")
            );
    }

    // Check address is a valid ethereum address
    if (!isAddress(address)) {
        return response.status(400)
            .json(
                fail(`${address} is not a valid ETH address`)
            );
    }
    
    try {
        const transaction = await wallet.sendTransaction({
            to: address, 
            value: parseEther(FAUCET_AMOUNT)
        });
        
        // Let's not wait
        // const receipt = await transaction.wait();

        return response.status(200)
            .json(
                ok({hash: transaction?.hash})
            );
    }
    catch (error) {
        // TODO better exception handling (500 is not the right answer here)
        const message = error instanceof Error ? error.message : `Unable to send ETH to ${address}`;
        
        return response.status(500)
            .json(
                fail(message)
            );
    }
});

/**
 * Check transaction status {pending, succeeded, failed}
 */
app.get('/tx/:hash', async (request: Request, response: Response) => {
    const hash = request.params.hash as string;

    // Check if transaction hash is a valid hash
    if (!isHexString(hash)) {
        return response.status(400)
            .json(
                fail(`${hash} is not a valid hash`)
            );
    }

    const receipt = await provider.getTransactionReceipt(hash);

    // If receipt is not ready yet
    if (!receipt) {
        return response.status(200)
            .json(
                ok({status: "pending", blockNum: null})
            );
    }

    const status = receipt?.status == 1 ? "succeeded" : "failed";

    return response.status(200)
        .json(
            ok({status: status, blockNum: receipt?.blockNumber})
        );
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
