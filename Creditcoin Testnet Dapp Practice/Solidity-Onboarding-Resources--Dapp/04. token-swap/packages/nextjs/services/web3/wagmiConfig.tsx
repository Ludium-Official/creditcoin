import { wagmiConnectors } from "./wagmiConnectors";
import { Chain, createClient, http } from "viem";
import { hardhat, mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const { targetNetworks } = scaffoldConfig;

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);

export const wagmiConfig = createConfig({
  chains: enabledChains,
  connectors: wagmiConnectors,
  ssr: true,
  client({ chain }) {
    // 크레딧코인 테스트넷을 위한 특별 처리
    let transportUrl;
    if (chain.id === 102031) {
      // 크레딧코인 테스트넷의 경우 직접 RPC URL 사용
      transportUrl = 'https://rpc.cc3-testnet.creditcoin.network';
    } else {
      // 다른 네트워크는 기존 로직 사용
      transportUrl = getAlchemyHttpUrl(chain.id);
    }

    return createClient({
      chain,
      transport: http(transportUrl),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: scaffoldConfig.pollingInterval,
          }
        : {}),
    });
  },
});
