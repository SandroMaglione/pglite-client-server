import { HttpApiClient, HttpClient } from "@effect/platform";
import { MyApi } from "@pglite/api";
import { Config, Context, Effect, Layer } from "effect";

interface ApiClientConfig {
  readonly baseUrl: string;
}

const make = ({ baseUrl }: ApiClientConfig) =>
  Effect.gen(function* () {
    const client = yield* HttpApiClient.make(MyApi, {
      baseUrl,
    });

    return { client };
  });

export class ApiClient extends Context.Tag("ApiClient")<
  ApiClient,
  Effect.Effect.Success<ReturnType<typeof make>>
>() {
  static readonly Live = (config: Config.Config.Wrap<ApiClientConfig>) =>
    Config.unwrap(config).pipe(
      Effect.flatMap(make),
      Layer.effect(this),
      Layer.provide(Layer.succeed(HttpClient.HttpClient, HttpClient.fetchOk)),
    );
}
