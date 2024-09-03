import { Schema } from "@effect/schema";
import { Array, Context, Effect, pipe } from "effect";

export class FormData extends Context.Tag("FormData")<
  FormData,
  globalThis.FormData
>() {
  static readonly fromSchema = <A, I>(schema: Schema.Schema<A, I>) =>
    this.pipe(
      Effect.map((formData) =>
        pipe(
          [...formData.entries()],
          Array.reduce(
            {} as Record<string, string>,
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            (acc, [key, value]) => ({ ...acc, [key]: value.toString() }),
          ),
        ),
      ),
      Effect.flatMap(Schema.decodeUnknown(schema)),
    );
}
