import { 
  useState, 
  type SyntheticEvent, 
  type ChangeEvent 
} from 'react'
import { useMutation } from '@tanstack/react-query';
import { TransactionStatus } from './components/TransactionStatus';
import type { ApiResponse, FaucetFunding } from './types';

function App() {

  const [ address, setAddress ] = useState<string>("");

  const useFund = useMutation<ApiResponse<FaucetFunding>, Error, string>({
    mutationFn: async (address: string) => {
      const response = await fetch("http://localhost:3000/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      
      const json = await response.json();
      if (response.ok && json.success) {
        return json;
      }
      
      throw new Error(json.error);
    }
  });

  // Simple regex to validate the ETHaddress 0x + 40 alpha numerical chars  
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  const onFundSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidAddress(address)) {
      useFund.mutate(address);
    }
  }

  const onAddressChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setAddress(event.target.value);
  }

  /**
   * TODO use polling instead of using a new button in Transaction status
   */
  return (
    <>
      <div>
        <h2>Faucet (Sepolia)</h2>
        <h3>Send 0.001 ETH to your wallet</h3>
        <form className="form" onSubmit={onFundSubmit}>
          <input 
            name="wallet" 
            value={address}
            placeholder="0x00000000..."
            onChange={onAddressChange}
          />
          <button type="submit" disabled={!isValidAddress(address) || useFund.isPending}>
            Submit
          </button>
        </form>
      </div>
      {useFund.isPending && <p>Loading...</p>}
      {useFund.isError ? (<p className="red">{useFund.error.message}</p>) : ""}
      {useFund.isSuccess ? <TransactionStatus hash={useFund.data.data?.hash} /> : ""}
    </>
  )
}

export default App
