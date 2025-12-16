import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MultipleSelectProps {
  value: {
    lua_chon: string[];
    // noi_dung: string
    la_dap_an_dung: number[];
  };
  onChange: (v: { lua_chon: string[]; la_dap_an_dung: number[] }) => void;
}

export const MultipleSelect = ({ value, onChange }: MultipleSelectProps) => {
  const { lua_chon, la_dap_an_dung } = value;

  const toggleCorrect = (index: number) => {
    let next = [...la_dap_an_dung];

    if (next.includes(index)) {
      next = next.filter((d) => d !== index);
    } else {
      next.push(index);
    }

    onChange({
      lua_chon,
      la_dap_an_dung: next,
    });
  };

  const updateOption = (index: number, text: string) => {
    const updated = [...lua_chon];
    updated[index] = text;

    onChange({
      lua_chon: updated,
      la_dap_an_dung,
    });
  };

  const addOption = () => {
    onChange({
      lua_chon: [...lua_chon, ""],
      la_dap_an_dung,
    });
  };

  const removeOption = (index: number) => {
    const updated = lua_chon.filter((_, i) => i !== index);

    const updatedCorrect = la_dap_an_dung
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i)); // giảm index

    onChange({
      lua_chon: updated,
      la_dap_an_dung: updatedCorrect,
    });
  };

  return (
    <div className="space-y-4 border-gray-200 ">
      {/* Render options */}
      <div className="space-y-2">
        {lua_chon.map((option, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border p-2 rounded-[3px]"
          >
            <Checkbox
              checked={la_dap_an_dung?.includes(index)}
              onCheckedChange={() => toggleCorrect(index)}
              className="rounded-[3px] border-gray-300"
            />

            <Input
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Lựa chọn ${index + 1}`}
              className="flex-1 rounded-[3px] shadow-none border-none"
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xoá tuỳ chọn này</TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>
        ))}
      </div>

      {/* Input add option */}
      <Button onClick={addOption} variant="outline" className="w-fit cursor-pointer rounded-[3px] shadow-none">
        <Plus className="w-4 h-4 mr-2" />
        Thêm lựa chọn
      </Button>
    </div>
  );
}
