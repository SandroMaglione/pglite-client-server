import { PGliteProvider } from "@electric-sql/pglite-react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Effect } from "effect";
import { PgLiteClientProvider } from "./pglite-client-provider";
import { PgLite } from "./services/PgLite";
import { RuntimeClient } from "./services/RuntimeClient";
import { Versioning } from "./services/Versioning";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const clientLoader = async () => {
  return RuntimeClient.runPromise(
    Effect.gen(function* () {
      const { db, rawQuery } = yield* PgLite;
      const appVersion = yield* Versioning.up;
      return { appVersion, db, rawQuery };
    }),
  );
};

export function HydrateFallback() {
  return <p>Getting your data ready...</p>;
}

export default function App() {
  const {
    appVersion,
    db,
    // @ts-expect-error: Cannot infer function type from loader data?
    rawQuery,
  } = useLoaderData<typeof clientLoader>();
  return (
    <>
      <p>{`Running on version ${appVersion}`}</p>
      <PGliteProvider
        // @ts-expect-error: 勝手に objectify doesn't type check
        db={db}
      >
        <PgLiteClientProvider.Provider value={rawQuery}>
          <Outlet />
        </PgLiteClientProvider.Provider>
      </PGliteProvider>
    </>
  );
}
