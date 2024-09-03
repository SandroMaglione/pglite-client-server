import { Config, ConfigProvider, Layer, ManagedRuntime } from "effect";
import { ApiClient } from "./ApiClient";
import { ApiDatabase } from "./ApiDatabase";
import { PgLite } from "./PgLite";
import { Versioning } from "./Versioning";

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
const VersioningLive = Versioning.Live.pipe(Layer.provide(PgLiteLive));
const ApiDatabaseLive = ApiDatabase.Live.pipe(Layer.provide(PgLiteLive));

const MainLayer = Layer.mergeAll(
  PgLiteLive,
  ApiClientLive,
  VersioningLive,
  ApiDatabaseLive,
).pipe(Layer.provide(ConfigProviderVite));

export const RuntimeClient = ManagedRuntime.make(MainLayer);
