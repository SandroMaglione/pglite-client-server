import { Config, ConfigProvider, Layer, ManagedRuntime } from "effect";
import { ApiClient } from "./ApiClient";
import { PgLite } from "./PgLite";

const ConfigProviderVite = Layer.setConfigProvider(
  ConfigProvider.fromJson(import.meta.env),
);

const ApiClientConfig = Config.all({
  baseUrl: Config.string("VITE_SERVER_BASE_URL").pipe(
    Config.withDefault("http://localhost:3000"),
  ),
});

const PgLiteConfig = Config.all({
  dataDir: Config.string("VITE_DATA_DIR"),
});

const ApiClientLive = ApiClient.Live(ApiClientConfig);
const PgLiteLive = PgLite.Live(PgLiteConfig);

const MainLayer = Layer.mergeAll(PgLiteLive, ApiClientLive).pipe(
  Layer.provide(ConfigProviderVite),
);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
