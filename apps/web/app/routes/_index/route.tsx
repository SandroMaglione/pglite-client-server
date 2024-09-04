import AddServingForm from "./add-serving-form";
import InsertFoodForm from "./insert-food-form";
import ListServings from "./list-servings";

export default function Index() {
  return (
    <main>
      {/* <FooShapes /> */}
      <InsertFoodForm />
      <AddServingForm />
      <ListServings />
    </main>
  );
}
