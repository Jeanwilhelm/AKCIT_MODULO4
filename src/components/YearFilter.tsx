'use client';

interface YearFilterProps {
  availableYears: number[];
  selectedYear: number;
  onChange: (year: number) => void;
}

export function YearFilter({ availableYears, selectedYear, onChange }: YearFilterProps) {
  const currentYear = new Date().getFullYear();
  const years = availableYears.includes(currentYear)
    ? availableYears
    : [currentYear, ...availableYears].sort((a, b) => b - a);

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="year-filter" className="text-sm font-medium text-gray-600">
        Ano:
      </label>
      <select
        id="year-filter"
        value={selectedYear}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
