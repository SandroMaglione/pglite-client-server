import AddServingForm from "./add-serving-form";
import FooShapes from "./foo-shapes";
import InsertFoodForm from "./insert-food-form";
import ListServings from "./list-servings";

export default function Index() {
  return (
    <main>
      <FooShapes />
      <InsertFoodForm />
      <AddServingForm />
      <ListServings />
    </main>
  );
}
