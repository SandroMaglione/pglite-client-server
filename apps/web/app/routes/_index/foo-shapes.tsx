import { useShape } from "@electric-sql/react";

export default function FooShapes() {
  const { data } = useShape({
    url: "http://localhost:3000/v1/shape/foo",
  });
  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}
