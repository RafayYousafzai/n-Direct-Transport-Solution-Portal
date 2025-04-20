import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

export default function LayoutSelector({ selectedLayout, setSelectedLayout }) {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Select Layout</h2>
      <RadioGroup
        value={selectedLayout}
        onValueChange={setSelectedLayout}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem
            value="Layout1"
            id="Layout1"
            className="peer sr-only"
          />
          <Label
            htmlFor="Layout1"
            className="flex flex-col items-center justify-center w-full p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-gray-600   peer-checked:text-gray-600 hover:bg-gray-50   "
          >
            <div className="w-full h-32 mb-2 bg-pink-100   rounded-md flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <div className="w-full text-lg font-semibold">Layout 1</div>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="Layout2"
            id="Layout2"
            className="peer sr-only"
          />
          <Label
            htmlFor="Layout2"
            className="flex flex-col items-center justify-center w-full p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-gray-600   peer-checked:text-gray-600 hover:bg-gray-50   "
          >
            <div className="w-full h-32 mb-2 bg-purple-100  rounded-md flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <div className="w-full text-lg font-semibold">Layout 2</div>
          </Label>
        </div>
      </RadioGroup>
      <p className="mt-4 text-sm text-gray-500">
        Selected layout: {selectedLayout === "Layout1" ? "1" : "2"}
      </p>
    </div>
  );
}
