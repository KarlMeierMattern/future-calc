import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function InvestmentInfo({
  startingBalance,
  setStartingBalance,
  investmentPeriods,
  addInvestmentPeriod,
  deleteInvestmentPeriod,
  updatePeriod,
  annualReturn,
  setAnnualReturn,
}) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <label className="text-sm">Starting balance (R)</label>
          <Input
            type="number"
            min={0}
            step={1000}
            value={startingBalance}
            onChange={(e) =>
              setStartingBalance(parseFloat(e.target.value) || 0)
            }
            placeholder="Enter your starting balance"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Periods</h3>
          {investmentPeriods.map((period, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
            >
              <div>
                <label className="text-sm">
                  Investment period {index + 1} (years)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={period.years}
                  onChange={(e) =>
                    updatePeriod(index, "years", parseInt(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="text-sm">Monthly investment (R)</label>
                <Input
                  type="number"
                  min={0}
                  step={100}
                  value={period.monthlyInvestment}
                  onChange={(e) =>
                    updatePeriod(
                      index,
                      "monthlyInvestment",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
              {investmentPeriods.length > 1 && (
                <Button
                  className="mt-6"
                  variant="destructive"
                  onClick={() => deleteInvestmentPeriod(index)}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
          <Button onClick={addInvestmentPeriod}>Add Investment Period</Button>
        </div>

        <div>
          <label className="text-sm">Expected annual return (%)</label>
          <Slider
            value={[annualReturn]}
            onValueChange={(value) => setAnnualReturn(value[0])}
            min={0}
            max={20}
            step={0.1}
            className="mt-2"
          />
          <div className="text-right text-sm text-muted-foreground mt-1">
            {annualReturn.toFixed(1)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
