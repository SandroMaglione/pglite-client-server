import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "@effect/schema";

class DbSchemaApi extends HttpApiGroup.make("db").pipe(
  HttpApiGroup.add(
    HttpApiEndpoint.get("latestMigration", "/db/migration").pipe(
      HttpApiEndpoint.setSuccess(Schema.String),
    ),
  ),
) {}

export class MyApi extends HttpApi.empty.pipe(HttpApi.addGroup(DbSchemaApi)) {}
