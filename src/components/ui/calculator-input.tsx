import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { evaluate } from "mathjs";
import { formatRupiah, parseRupiah } from "@/lib/utils";
import { Calculator } from "lucide-react";

const expressionSchema = z
  .string()
  .min(1)
  .regex(/^[0-9+\-*/().\s]+$/, "Ekspresi tidak valid");

interface CalculatorInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CalculatorInput({
  value,
  onChange,
  placeholder,
}: CalculatorInputProps) {
  const [expression, setExpression] = useState("");

  const handleEvaluate = () => {
    const parsed = expressionSchema.safeParse(expression);
    if (!parsed.success) return;

    try {
      const result = evaluate(expression);
      if (typeof result === "number" && result > 0) {
        onChange(Math.round(result).toString());
      }
    } catch {
      // silently fail (UX lebih halus)
    } finally {
      setExpression("");
    }
  };

  const append = (val: string) => setExpression((prev) => prev + val);

  return (
    <div className="relative">
      <Input
        value={formatRupiah(value)}
        placeholder={placeholder}
        inputMode="numeric"
        onChange={(e) => onChange(parseRupiah(e.target.value))}
        className="pr-10"
      />

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
          >
            <Calculator className="h-4 w-4" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-3">
          <Input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="contoh: 20000+5000*2"
            className="mb-2 text-sm"
          />

          {/* NUMPAD */}
          <div className="grid grid-cols-4 gap-2 text-sm">
            {["7", "8", "9", "/"].map((v) => (
              <CalcBtn key={v} onClick={() => append(v)}>
                {v}
              </CalcBtn>
            ))}
            {["4", "5", "6", "*"].map((v) => (
              <CalcBtn key={v} onClick={() => append(v)}>
                {v}
              </CalcBtn>
            ))}
            {["1", "2", "3", "-"].map((v) => (
              <CalcBtn key={v} onClick={() => append(v)}>
                {v}
              </CalcBtn>
            ))}
            {["0", ".", "(", "+"].map((v) => (
              <CalcBtn key={v} onClick={() => append(v)}>
                {v}
              </CalcBtn>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setExpression("")}
            >
              C
            </Button>
            <Button
              type="button"
              size="sm"
              className="w-full"
              onClick={handleEvaluate}
            >
              =
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function CalcBtn({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      {children}
    </Button>
  );
}
