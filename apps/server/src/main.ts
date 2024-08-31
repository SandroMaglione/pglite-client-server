import { HttpApiBuilder, HttpMiddleware, HttpServer } from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { createServer } from "node:http";
import { MyApiLive } from "./api";

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(
    HttpApiBuilder.middlewareCors({
      allowedOrigins: ["*"],
    }),
  ),
  Layer.provide(MyApiLive),
  HttpServer.withLogAddress,
  Layer.provide(
    NodeHttpServer.layer(createServer, { host: "localhost", port: 3000 }),
  ),
);

Layer.launch(HttpLive).pipe(NodeRuntime.runMain);
