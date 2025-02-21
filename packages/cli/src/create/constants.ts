import { blue, green, red, yellow } from "./colors";
import type { Chain, ColorFunc, Network } from "./types";

export type ChainDataType = {
  name: Chain;
  display: string;
  color: ColorFunc;
  networks: NetworkDataType[];
};

export type NetworkDataType = {
  name: Network;
  display: string;
  color: ColorFunc;
};

export type LanguageDataType = {
  name: "typescript" | "javascript";
  display: string;
  color: ColorFunc;
};

export type StorageDataType = {
  name: "postgres" | "none";
  display: string;
  color: ColorFunc;
};

export const chains: ChainDataType[] = [
  {
    name: "starknet",
    display: "Starknet",
    color: blue,
    networks: [
      { name: "mainnet", display: "Mainnet", color: blue },
      { name: "sepolia", display: "Sepolia", color: yellow },
    ],
  },
  {
    name: "ethereum",
    display: "Ethereum",
    color: green,
    networks: [
      { name: "mainnet", display: "Mainnet", color: blue },
      { name: "sepolia", display: "Sepolia", color: yellow },
    ],
  },
  {
    name: "beaconchain",
    display: "Beacon Chain",
    color: yellow,
    networks: [{ name: "mainnet", display: "Mainnet", color: yellow }],
  },
];

export const networks: NetworkDataType[] = [
  { name: "mainnet", display: "Mainnet", color: blue },
  { name: "sepolia", display: "Sepolia", color: green },
  { name: "other", display: "Other", color: red },
];

export const storages: StorageDataType[] = [
  { name: "postgres", display: "Postgres", color: green },
  { name: "none", display: "None", color: red },
];

export const packageVersions = {
  // Required Dependencies
  apibara: "^2.0.0-beta.42",
  "@apibara/indexer": "^2.0.0-beta.42",
  "@apibara/protocol": "^2.0.0-beta.42",
  // Chain Dependencies
  "@apibara/evm": "^2.0.0-beta.42",
  "@apibara/beaconchain": "^2.0.0-beta.42",
  "@apibara/starknet": "^2.0.0-beta.42",
  // Storage Dependencies
  "@apibara/plugin-drizzle": "^2.0.0-beta.42",
  "@apibara/plugin-mongo": "^2.0.0-beta.42",
  "@apibara/plugin-sqlite": "^2.0.0-beta.42",
  // Postgres Dependencies
  "@electric-sql/pglite": "^0.2.17",
  "drizzle-orm": "^0.37.0",
  pg: "^8.13.1",
  "@types/pg": "^8.11.10",
  "drizzle-kit": "^0.29.0",
  // Typescript Dependencies
  typescript: "^5.6.2",
  "@rollup/plugin-typescript": "^11.1.6",
  "@types/node": "^20.5.2",
};

export const dnaUrls = {
  ethereum: "https://ethereum.preview.apibara.org",
  ethereumSepolia: "https://ethereum-sepolia.preview.apibara.org",
  beaconchain: "https://beaconchain.preview.apibara.org",
  starknet: "https://starknet.preview.apibara.org",
  starknetSepolia: "https://starknet-sepolia.preview.apibara.org",
};
