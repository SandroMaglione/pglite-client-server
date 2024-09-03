import { useLoaderData } from "@remix-run/react";
import { RuntimeClient } from "~/services/RuntimeClient";
import { Versioning } from "~/services/Versioning";
import InsertFoodForm from "./insert-food-form";

export const clientLoader = async () => {
  return RuntimeClient.runPromise(Versioning.up);
};

export function HydrateFallback() {
  return <p>Getting your data ready...</p>;
}

export default function Index() {
  const appVersion = useLoaderData<typeof clientLoader>();
  return (
    <main>
      <p>{`Running on version ${appVersion}`}</p>
      <InsertFoodForm />
    </main>
  );
}
