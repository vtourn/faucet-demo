import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, FaucetTransaction } from '../types';

type TransactionStatusProps = {
  hash: string | undefined;
};

/**
 * Component to display the status of a transaction once the funding request has been sent 
 * Poll every 3 seconds until transaction succeed or fail
 * @param param0 
 * @returns 
 */
export const TransactionStatus = ({ hash }: TransactionStatusProps) => {

	const useTx = useQuery<ApiResponse<FaucetTransaction>>({
		queryKey: ["tx", hash],
		queryFn: async () => {
			const response = await fetch(`http://localhost:3000/tx/${hash}`, {
				headers: { "Content-Type": "application/json" }, 
    	});
			return response.json();
		},
		enabled: !!hash,
		refetchInterval: (query) => {
			if (query.state.data?.error) {
				return false;
			}

			if (query.state.data?.success && (
				query.state.data.data?.status == "succeeded"  || 
				query.state.data.data?.status == "failed")
			)
				return false; 
			return 3000;
		},
	});

	return (
		<div>
			<p className="green">Transaction submitted: {hash}</p>
			{useTx.isPending ? (<p>Loading ...</p>) : ""}
			{useTx.isSuccess ? (<p>Transaction status: {useTx.data.data?.status}</p>) : ""}
			{useTx.isError ? (<p className="red">{useTx.error.message}</p>) : ""}
		</div>
	)
}
