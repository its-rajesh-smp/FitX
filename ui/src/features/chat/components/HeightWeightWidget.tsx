import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type UnitSystem = "metric" | "imperial";

export function HeightWeightWidget({
  disabled,
  selectedAnswer,
  onSubmit,
}: {
  disabled: boolean;
  selectedAnswer?: string;
  onSubmit: (answer: string) => void;
}) {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");

  const metricValid =
    Number(height) >= 80 &&
    Number(height) <= 250 &&
    Number(weight) >= 25 &&
    Number(weight) <= 350;
  const imperialValid =
    Number(feet) >= 3 &&
    Number(feet) <= 8 &&
    Number(inches) >= 0 &&
    Number(inches) <= 11 &&
    Number(weight) >= 55 &&
    Number(weight) <= 770;
  const canSubmit = unitSystem === "metric" ? metricValid : imperialValid;

  const submit = () => {
    if (!canSubmit || disabled || selectedAnswer) return;

    onSubmit(
      unitSystem === "metric"
        ? `Height: ${height} cm, Weight: ${weight} kg`
        : `Height: ${feet} ft ${inches} in, Weight: ${weight} lb`,
    );
  };

  if (selectedAnswer) {
    return (
      <div className="mt-3 rounded-xl border bg-primary-soft/50 px-4 py-3 text-sm">
        <span className="text-muted-foreground">Your measurements: </span>
        <span className="font-semibold">{selectedAnswer}</span>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex w-fit rounded-lg bg-muted p-1">
        {(["metric", "imperial"] as const).map((unit) => (
          <button
            key={unit}
            type="button"
            className={cn(
              "rounded-md px-3 py-1 text-xs font-semibold capitalize transition",
              unitSystem === unit && "bg-white text-primary shadow-sm",
            )}
            disabled={disabled}
            onClick={() => setUnitSystem(unit)}
          >
            {unit}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-xs font-semibold">
          Height
          {unitSystem === "metric" ? (
            <MeasurementInput value={height} onChange={setHeight} unit="cm" placeholder="175" disabled={disabled} />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <MeasurementInput value={feet} onChange={setFeet} unit="ft" placeholder="5" disabled={disabled} />
              <MeasurementInput value={inches} onChange={setInches} unit="in" placeholder="9" disabled={disabled} />
            </div>
          )}
        </label>

        <label className="space-y-1.5 text-xs font-semibold">
          Weight
          <MeasurementInput
            value={weight}
            onChange={setWeight}
            unit={unitSystem === "metric" ? "kg" : "lb"}
            placeholder={unitSystem === "metric" ? "70" : "154"}
            disabled={disabled}
          />
        </label>
      </div>

      <Button className="mt-4 w-full" disabled={disabled || !canSubmit} onClick={submit}>
        Continue
      </Button>
    </div>
  );
}

function MeasurementInput({
  value,
  onChange,
  unit,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  unit: string;
  placeholder: string;
  disabled: boolean;
}) {
  return (
    <div className="relative">
      <Input
        type="number"
        min="0"
        step="1"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-10"
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
        {unit}
      </span>
    </div>
  );
}
