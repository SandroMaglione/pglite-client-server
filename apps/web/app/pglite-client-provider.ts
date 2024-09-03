import type { Context } from "effect";
import React from "react";
import type { PgLite } from "./services/PgLite";

export const PgLiteClientProvider = React.createContext<
  Context.Tag.Service<typeof PgLite>["rawQuery"] | undefined
>(undefined);

export const usePgLiteClient = () =>
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  React.useContext(PgLiteClientProvider)!;
