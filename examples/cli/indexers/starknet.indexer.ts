import { defineIndexer } from "@apibara/indexer";
import { sqlitePersistence } from "@apibara/indexer/plugins/persistence";
import { StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import Database from "better-sqlite3";
import { hash } from "starknet";

export default function (runtimeConfig: ApibaraRuntimeConfig) {
  console.log("--> Starknet Indexer Runtime Config: ", runtimeConfig);
  const database = new Database(":memory:");

  return defineIndexer(StarknetStream)({
    streamUrl: "https://starknet.preview.apibara.org",
    finality: "accepted",
    startingCursor: {
      orderKey: 800_000n,
    },
    plugins: [sqlitePersistence({ database })],
    filter: {
      events: [
        {
          address:
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7" as `0x${string}`,
          keys: [hash.getSelectorFromName("Transfer") as `0x${string}`],
          includeReceipt: true,
        },
      ],
    },
    async transform({ block: { header } }) {
      console.log("Transforming block ", header?.blockNumber);
    },
  });
}
