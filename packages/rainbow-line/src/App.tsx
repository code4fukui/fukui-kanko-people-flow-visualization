import { useState } from "react";
import { FiltersSample } from "./components/parts/filters";
import { HeaderPlaceHolder } from "./components/parts/ph-header";

function App() {
  const [filters, setFilters] = useState({
    parkingLot: "all",
    region: "all",
    prefecture: "all",
    carCategory: "all",
  });

  return (
    <div className="flex flex-col w-full h-full min-h-[100dvh] p-4">
      <HeaderPlaceHolder title="レインボーライン" />
      <FiltersSample
        className="pt-4"
        defaultValues={filters}
        onFilterChange={(k, v) => setFilters({ ...filters, [`${k}`]: v })}
      />
    </div>
  );
}

export default App;
