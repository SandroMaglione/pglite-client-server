import {
	HttpApi,
	HttpApiBuilder,
	HttpApiEndpoint,
	HttpApiGroup,
} from "@effect/platform";
import { Schema } from "@effect/schema";
import { DateTime, Effect, Layer } from "effect";

class User extends Schema.Class<User>("User")({
	id: Schema.Number,
	name: Schema.String,
	createdAt: Schema.DateTimeUtc,
}) {}

class UsersApi extends HttpApiGroup.make("users").pipe(
	HttpApiGroup.add(
		HttpApiEndpoint.get("findById", "/users/:id").pipe(
			HttpApiEndpoint.setSuccess(User),
			HttpApiEndpoint.setPath(
				Schema.Struct({
					id: Schema.NumberFromString,
				}),
			),
		),
	),
) {}

class MyApi extends HttpApi.empty.pipe(HttpApi.addGroup(UsersApi)) {}

// --------------------------------------------
// Implementation
// --------------------------------------------

const UsersApiLive = HttpApiBuilder.group(MyApi, "users", (handlers) =>
	handlers.pipe(
		HttpApiBuilder.handle("findById", ({ path: { id } }) =>
			Effect.succeed(
				new User({
					id,
					name: "John Doe",
					createdAt: DateTime.unsafeNow(),
				}),
			),
		),
	),
);

export const MyApiLive = HttpApiBuilder.api(MyApi).pipe(
	Layer.provide(UsersApiLive),
);
