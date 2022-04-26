import * as React from 'react';
import { InputAmountWithDuration, InputText, SelectToken } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import { ITokenLists } from 'types';
import { useContractWrite, useProvider } from 'wagmi';
import llamaContract from 'abis/llamaContract';
import { useQueryClient } from 'react-query';
import BigNumber from 'bignumber.js';
import { secondsByDuration } from 'utils/constants';
import { DisclosureState } from 'ariakit';
import toast from 'react-hot-toast';
import { getAddress } from 'ethers/lib/utils';

const WithdrawOnBehalfForm = ({
  tokens,
  formDialog,
  transactionDialog,
  setTransactionHash,
}: {
  tokens: ITokenLists[];
  formDialog: DisclosureState;
  transactionDialog: DisclosureState;
  setTransactionHash: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');
  const [tokenContractAddress, setTokenContract] = React.useState(tokens[0]?.llamaContractAddress ?? '');
  const [error, setError] = React.useState<string | null>(null);

  const provider = useProvider();

  const [{ loading }, withdraw] = useContractWrite(
    {
      addressOrName: getAddress(tokenContractAddress),
      contractInterface: llamaContract,
      signerOrProvider: provider,
    },
    'withdraw'
  );

  const handleTokenChange = (token: string) => {
    setTokenAddress(token);

    const tokenDetails = tokens?.find((t) => t.tokenAddress === token);

    if (tokenDetails) {
      setTokenAddress(tokenDetails.tokenAddress);
      setTokenContract(tokenDetails.llamaContractAddress);
    }
  };

  const queryClient = useQueryClient();

  function handleWithdraw(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement & { streamedAmount: { value: string } };
    const payerAddress = form.payerAddress?.value;
    const payeeAddress = form.payeeAddress?.value;
    const streamedAmount = form.streamedAmount?.value;
    const streamDuration = form.streamDuration?.value;

    const duration = streamDuration === 'year' ? 'year' : 'month';

    const tokenDetails = tokens?.find((t) => t.tokenAddress === tokenAddress);

    if (tokenDetails && !Number.isNaN(streamedAmount)) {
      // format amount to bignumber
      const amountPerSec = new BigNumber(Number(streamedAmount) * 1e20).div(secondsByDuration[duration]).toFixed(0);

      withdraw({ args: [payerAddress, payeeAddress, amountPerSec] }).then(({ data, error }: any) => {
        if (data) {
          setTransactionHash(data.hash ?? '');

          formDialog.hide();

          transactionDialog.toggle();

          const toastId = toast.loading('Sending Funds');

          data.wait().then((receipt: any) => {
            toast.dismiss(toastId);

            queryClient.invalidateQueries();

            receipt.status === 1 ? toast.success('Funds Successfully Sent') : toast.error('Error Sending Funds');
          });
        }

        if (error) {
          setError(error.message);
        }
      });
    }
  }

  // format tokens list to only include token names
  const tokenOptions = React.useMemo(() => tokens?.map((t) => t.tokenAddress) ?? [], [tokens]);

  return (
    <form onSubmit={handleWithdraw} className="flex flex-col space-y-4">
      <span>
        <SelectToken
          handleTokenChange={handleTokenChange}
          tokens={tokenOptions}
          className="border border-neutral-300 py-[3px] shadow-none dark:border-neutral-700"
          label="Token"
        />
      </span>

      <InputText name="payerAddress" label="Payer:" isRequired />

      <InputText name="payeeAddress" label="Payee:" isRequired />

      <InputAmountWithDuration
        name="streamedAmount"
        isRequired={true}
        label="Streamed Amount"
        selectInputName="streamDuration"
      />

      <button className="form-submit-button">{loading ? <BeatLoader size={6} color="white" /> : 'Withdraw'}</button>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </form>
  );
};

export const Fallback = () => {
  return (
    <form className="flex flex-col space-y-4">
      <span>
        <SelectToken
          handleTokenChange={() => null}
          tokens={[]}
          className="border border-neutral-300 py-[3px] shadow-none dark:border-neutral-700"
          label="Token"
        />
      </span>

      <InputText name="payerAddress" label="Payer:" isRequired />

      <InputText name="payeeAddress" label="Payee:" isRequired />

      <InputAmountWithDuration
        name="streamedAmount"
        isRequired={true}
        label="Streamed Amount"
        selectInputName="streamDuration"
      />

      <button className="form-submit-button" disabled>
        <BeatLoader size={6} color="white" />
      </button>
    </form>
  );
};

export default WithdrawOnBehalfForm;
