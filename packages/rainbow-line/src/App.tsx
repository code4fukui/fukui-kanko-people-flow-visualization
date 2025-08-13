import { FiltersSample } from "./components/parts/filters";
import { HeaderPlaceHolder } from "./components/parts/ph-header";

function App() {
  return (
    <div className="flex flex-col w-full h-full min-h-[100dvh] p-4">
      <HeaderPlaceHolder title="レインボーライン" />
      <FiltersSample className="pt-4" />
    </div>
  );
}

export default App;
