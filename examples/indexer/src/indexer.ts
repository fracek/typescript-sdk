import consola from "consola";
import assert from "node:assert";
import { EvmStream } from "@apibara/evm";
import { defineIndexer, sqlite, useIndexerContext } from "@apibara/indexer";
import { kv } from "@apibara/indexer/plugins";
import { encodeEventTopics, parseAbi, decodeEventLog } from "viem";
import { trace } from "@opentelemetry/api";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const abi = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

const tracer = trace.getTracer("evm-indexer-demo");

export function createIndexerConfig(streamUrl: string) {
  return defineIndexer(EvmStream)({
    streamUrl,
    finality: "accepted",
    startingCursor: {
      orderKey: 5_000_000n,
    },
    filter: {
      logs: [
        {
          strict: true,
          topics: encodeEventTopics({
            abi,
            eventName: "Transfer",
            args: { from: null, to: null },
          }),
        },
      ],
    },
    sink: sqlite({
      filename: "sqlite_test.db",
      driver: sqlite3.Database,
      tableName: "test",
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    }) as any,
    transform({ block: { header, logs, transactions } }) {
      const ctx = useIndexerContext();
      ctx.counter += 1;

      if (!transactions || !header || !header.number) return [];

      return tracer.startActiveSpan("parseLogs", (span) => {
        const rows = logs.map((log) => {
          assert(log.topics.length === 3, "Transfer event has 3 topics");

          const { args } = tracer.startActiveSpan("decodeEventLog", (span) => {
            const decoded = decodeEventLog({
              abi,
              topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
              data: log.data,
              eventName: "Transfer",
            });

            span.end();
            return decoded;
          });

          return {
            blockNumber: Number(header.number),
            blockHash: header.hash,
            logIndex: Number(log.logIndex),
            fromAddress: args.from,
            toAddress: args.to,
            value: Number(args.value),
          };
        });

        span.end();
        return rows;
      });
    },
    hooks: {
      async "run:before"() {
        const ctx = useIndexerContext();
        ctx.counter = 0;

        // Initialize SQLite database
        const db = await open({
          filename: "sqlite_test.db",
          driver: sqlite3.Database,
        });
        // Delete table if exists
        await db.run("DROP TABLE IF EXISTS test;");
        // Create table if not exists
        await db.run(
          `CREATE TABLE IF NOT EXISTS test (
              blockHash VARCHAR(66),
              blockNumber BIGINT,
              logIndex BIGINT,
              value BIGINT,
              fromAddress VARCHAR(66),
              toAddress VARCHAR(66),
              _cursor BIGINT
          );`,
        );
      },
      "handler:after"({ output }) {
        for (const transfer of output) {
          consola.debug(
            "Transfer",
            transfer.blockNumber,
            transfer.logIndex,
            transfer.fromAddress,
            transfer.toAddress,
            transfer.value.toString(),
          );
        }
      },
      "sink:write"({ data }) {
        consola.info("Wrote", data.length, "transfers");
      },
      "sink:flush"() {
        consola.debug("Flushing");
      },
    },
    plugins: [kv()],
  });
}
