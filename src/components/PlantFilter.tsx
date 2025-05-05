
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlantFilterProps {
  onFilterChange: (filters: { 
    sizes: string[], 
    waterDemands: string[], 
    sunDemands: string[] 
  }) => void;
}

const PlantFilter = ({ onFilterChange }: PlantFilterProps) => {
  const [sizes, setSizes] = useState<string[]>([]);
  const [waterDemands, setWaterDemands] = useState<string[]>([]);
  const [sunDemands, setSunDemands] = useState<string[]>([]);

  const handleSizeChange = (size: string) => {
    const newSizes = sizes.includes(size)
      ? sizes.filter(s => s !== size)
      : [...sizes, size];
    
    setSizes(newSizes);
    applyFilters(newSizes, waterDemands, sunDemands);
  };

  const handleWaterChange = (demand: string) => {
    const newWaterDemands = waterDemands.includes(demand)
      ? waterDemands.filter(d => d !== demand)
      : [...waterDemands, demand];
    
    setWaterDemands(newWaterDemands);
    applyFilters(sizes, newWaterDemands, sunDemands);
  };

  const handleSunChange = (demand: string) => {
    const newSunDemands = sunDemands.includes(demand)
      ? sunDemands.filter(d => d !== demand)
      : [...sunDemands, demand];
    
    setSunDemands(newSunDemands);
    applyFilters(sizes, waterDemands, newSunDemands);
  };

  const applyFilters = (
    sizeFilters: string[],
    waterFilters: string[],
    sunFilters: string[]
  ) => {
    onFilterChange({
      sizes: sizeFilters,
      waterDemands: waterFilters,
      sunDemands: sunFilters
    });
  };

  const clearFilters = () => {
    setSizes([]);
    setWaterDemands([]);
    setSunDemands([]);
    applyFilters([], [], []);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50">
          <span>Размер</span>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuCheckboxItem
            checked={sizes.includes("small")}
            onCheckedChange={() => handleSizeChange("small")}
          >
            Маленький
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sizes.includes("medium")}
            onCheckedChange={() => handleSizeChange("medium")}
          >
            Средний
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sizes.includes("large")}
            onCheckedChange={() => handleSizeChange("large")}
          >
            Большой
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50">
          <span>Полив</span>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuCheckboxItem
            checked={waterDemands.includes("low")}
            onCheckedChange={() => handleWaterChange("low")}
          >
            Редкий полив
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={waterDemands.includes("medium")}
            onCheckedChange={() => handleWaterChange("medium")}
          >
            Умеренный полив
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={waterDemands.includes("high")}
            onCheckedChange={() => handleWaterChange("high")}
          >
            Частый полив
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50">
          <span>Освещение</span>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuCheckboxItem
            checked={sunDemands.includes("low")}
            onCheckedChange={() => handleSunChange("low")}
          >
            Полутень
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sunDemands.includes("medium")}
            onCheckedChange={() => handleSunChange("medium")}
          >
            Рассеянный свет
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sunDemands.includes("high")}
            onCheckedChange={() => handleSunChange("high")}
          >
            Яркий свет
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {(sizes.length > 0 || waterDemands.length > 0 || sunDemands.length > 0) && (
        <button 
          onClick={clearFilters} 
          className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 text-gray-500"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
};

export default PlantFilter;
