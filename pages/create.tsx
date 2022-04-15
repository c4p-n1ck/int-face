import type { NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { CreateStream } from 'components/Stream';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from 'hooks';

const Create: NextPage = () => {
  const [{ data: accountData }] = useAccount();
  const { unsupported } = useNetworkProvider();

  return (
    <Layout className="mx-auto mt-12 flex w-full flex-col items-center space-y-6">
      {!accountData ? (
        <p className="mx-auto mt-8 text-red-500">Connect wallet to continue</p>
      ) : unsupported ? (
        <p className="mx-auto mt-8 text-red-500">Chain not supported</p>
      ) : (
        <CreateStream />
      )}
    </Layout>
  );
};

export default Create;
