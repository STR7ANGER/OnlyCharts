import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SymbolSearch } from '@/components/ui/symbol-search';
import { ChartType, TimeScale } from '@/utils/chart/types';
import { CHART_TYPE_LABELS, TIME_SCALE_LABELS } from '@/utils/chart/chartConfig';
import { SymbolResult } from '@/hooks/useSymbolSearch';

interface ChartHeaderProps {
  selectedSymbol: SymbolResult | null;
  onSymbolSelect: (symbol: SymbolResult | null) => void;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  timeScale: TimeScale;
  onTimeScaleChange: (scale: TimeScale) => void;
}

export function ChartHeader({
  selectedSymbol,
  onSymbolSelect,
  chartType,
  onChartTypeChange,
  timeScale,
  onTimeScaleChange,
}: ChartHeaderProps) {
  return (
    <div className="absolute top-6 left-6 z-20 flex gap-4">
      <SymbolSearch
        onSelect={onSymbolSelect}
        selectedSymbol={selectedSymbol}
      />
      
      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
          Chart Type
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[160px] justify-between bg-[#1A1A1A] text-gray-200 border-[#2A2A2A] hover:bg-[#252525] hover:border-[#3A3A3A]"
            >
              {CHART_TYPE_LABELS[chartType]}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[160px] bg-[#1A1A1A] border-[#2A2A2A]">
            <DropdownMenuRadioGroup
              value={chartType}
              onValueChange={(value) => onChartTypeChange(value as ChartType)}
            >
              <DropdownMenuRadioItem value="candlestick" className="text-gray-200 focus:bg-[#252525]">
                Candlestick
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="area" className="text-gray-200 focus:bg-[#252525]">
                Area
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bar" className="text-gray-200 focus:bg-[#252525]">
                Bar
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="baseline" className="text-gray-200 focus:bg-[#252525]">
                Baseline
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="histogram" className="text-gray-200 focus:bg-[#252525]">
                Histogram
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="line" className="text-gray-200 focus:bg-[#252525]">
                Line
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
          Time Scale
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[70px] justify-between bg-[#1A1A1A] text-gray-200 border-[#2A2A2A] hover:bg-[#252525] hover:border-[#3A3A3A]"
            >
              {TIME_SCALE_LABELS[timeScale]}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[70px] bg-[#1A1A1A] border-[#2A2A2A]">
            <DropdownMenuRadioGroup
              value={timeScale}
              onValueChange={(value) => onTimeScaleChange(value as TimeScale)}
            >
              <DropdownMenuRadioItem value="1m" className="text-gray-200 focus:bg-[#252525]">
                1m
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="5m" className="text-gray-200 focus:bg-[#252525]">
                5m
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="15m" className="text-gray-200 focus:bg-[#252525]">
                15m
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="30m" className="text-gray-200 focus:bg-[#252525]">
                30m
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="1h" className="text-gray-200 focus:bg-[#252525]">
                1h
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="1d" className="text-gray-200 focus:bg-[#252525]">
                1d
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="3d" className="text-gray-200 focus:bg-[#252525]">
                3d
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="1w" className="text-gray-200 focus:bg-[#252525]">
                1w
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="1M" className="text-gray-200 focus:bg-[#252525]">
                1M
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
