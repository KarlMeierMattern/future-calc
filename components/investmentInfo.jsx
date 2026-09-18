import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  InvestmentContext,
  InvestmentDispatchContext,
} from "@/utils/investmentContext";
import { useContext, useState, useEffect, useRef } from "react";

export default function InvestmentInfo() {
  const {
    startingBalance,
    investmentPeriods,
    annualReturn,
    dividendYield,
    reinvestDividends,
    inflationRate,
    taxBracket,
    withdrawalPercentage,
  } = useContext(InvestmentContext);

  const dispatch = useContext(InvestmentDispatchContext);
  const [localStartingBalance, setLocalStartingBalance] = useState(
    startingBalance === 0 ? "" : startingBalance.toString(),
  );
  const isEditingRef = useRef(false);
  const [localPeriodValues, setLocalPeriodValues] = useState({});

  useEffect(() => {
    if (!isEditingRef.current) {
      setLocalStartingBalance(
        startingBalance === 0 ? "" : startingBalance.toString(),
      );
    }
  }, [startingBalance]);

  const handleStartingBalanceFocus = () => {
    isEditingRef.current = true;
    if (startingBalance === 0) {
      setLocalStartingBalance("");
    } else {
      setLocalStartingBalance(startingBalance.toString());
    }
  };

  const handleStartingBalanceBlur = () => {
    isEditingRef.current = false;
    const value = parseFloat(localStartingBalance) || 0;
    setLocalStartingBalance(value === 0 ? "" : value.toString());
    dispatch({
      type: "SET_STARTING_BALANCE",
      payload: value,
    });
  };

  const handleStartingBalanceChange = (e) => {
    setLocalStartingBalance(e.target.value);
  };

  return (
    <Card className="print:hidden">
      <CardContent className="p-6 space-y-6">
        <div>
          <label htmlFor="startingBalance" className="text-sm">
            Starting balance (R)
          </label>
          <Input
            id="startingBalance"
            type="number"
            min={0}
            step={1000}
            value={localStartingBalance}
            onChange={handleStartingBalanceChange}
            onFocus={handleStartingBalanceFocus}
            onBlur={handleStartingBalanceBlur}
            placeholder="0"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Periods</h3>
          {investmentPeriods.map((period, index) => (
            <div
              key={period.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-end"
            >
              <div>
                <label htmlFor={`period-${period.id}-years`} className="text-sm">
                  Investment period {index + 1} (years)
                </label>
                <Input
                  id={`period-${period.id}-years`}
                  type="number"
                  min={1}
                  value={
                    localPeriodValues[`${period.id}-years`] !== undefined
                      ? localPeriodValues[`${period.id}-years`]
                      : period.years || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalPeriodValues((prev) => ({
                      ...prev,
                      [`${period.id}-years`]: value,
                    }));
                    if (value !== "") {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue >= 1) {
                        dispatch({
                          type: "UPDATE_INVESTMENT_PERIOD",
                          payload: {
                            id: period.id,
                            field: "years",
                            value: numValue,
                          },
                        });
                      }
                    }
                  }}
                  onFocus={() => {
                    setLocalPeriodValues((prev) => ({
                      ...prev,
                      [`${period.id}-years`]: period.years?.toString() || "",
                    }));
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    const numValue = parseInt(value) || 1;
                    setLocalPeriodValues((prev) => {
                      const newState = { ...prev };
                      delete newState[`${period.id}-years`];
                      return newState;
                    });
                    dispatch({
                      type: "UPDATE_INVESTMENT_PERIOD",
                      payload: {
                        id: period.id,
                        field: "years",
                        value: numValue,
                      },
                    });
                  }}
                  placeholder="10"
                />
              </div>
              <div>
                <label htmlFor={`period-${period.id}-monthly`} className="text-sm">
                  Monthly investment (R)
                </label>
                <Input
                  id={`period-${period.id}-monthly`}
                  type="number"
                  min={0}
                  step={100}
                  value={
                    localPeriodValues[`${period.id}-monthlyInvestment`] !==
                    undefined
                      ? localPeriodValues[`${period.id}-monthlyInvestment`]
                      : period.monthlyInvestment || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalPeriodValues((prev) => ({
                      ...prev,
                      [`${period.id}-monthlyInvestment`]: value,
                    }));
                    if (value !== "") {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue) && numValue >= 0) {
                        dispatch({
                          type: "UPDATE_INVESTMENT_PERIOD",
                          payload: {
                            id: period.id,
                            field: "monthlyInvestment",
                            value: numValue,
                          },
                        });
                      }
                    }
                  }}
                  onFocus={() => {
                    setLocalPeriodValues((prev) => ({
                      ...prev,
                      [`${period.id}-monthlyInvestment`]:
                        period.monthlyInvestment?.toString() || "",
                    }));
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    const numValue = parseFloat(value) || 0;
                    setLocalPeriodValues((prev) => {
                      const newState = { ...prev };
                      delete newState[`${period.id}-monthlyInvestment`];
                      return newState;
                    });
                    dispatch({
                      type: "UPDATE_INVESTMENT_PERIOD",
                      payload: {
                        id: period.id,
                        field: "monthlyInvestment",
                        value: numValue,
                      },
                    });
                  }}
                  placeholder="0"
                />
              </div>
              {investmentPeriods.length > 1 && (
                <Button
                  variant="destructive"
                  onClick={() =>
                    dispatch({
                      type: "DELETE_INVESTMENT_PERIOD",
                      payload: period.id,
                    })
                  }
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
          <Button onClick={() => dispatch({ type: "ADD_INVESTMENT_PERIOD" })}>
            Add Investment Period
          </Button>
        </div>

        <div>
          <label id="annualReturnLabel" className="text-sm">
            Expected annual return (%)
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            <Slider
              id="annualReturn"
              aria-labelledby="annualReturnLabel annualReturnValue"
              value={[annualReturn]}
              onValueChange={(value) =>
                dispatch({
                  type: "SET_ANNUAL_RETURN",
                  payload: value[0],
                })
              }
              min={0}
              max={100}
              step={0.1}
              className="mt-2 flex-1 min-w-[200px]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch({
                  type: "SET_ANNUAL_RETURN",
                  payload: 10.0,
                })
              }
            >
              S&P 10%
            </Button>
          </div>
          <div
            id="annualReturnValue"
            className="text-right text-sm text-muted-foreground mt-1"
            aria-live="polite"
          >
            {annualReturn.toFixed(1)}%
          </div>
        </div>

        <div>
          <label id="dividendYieldLabel" className="text-sm">
            Annual dividend yield (%)
          </label>
          <Slider
            id="dividendYield"
            aria-labelledby="dividendYieldLabel dividendYieldValue"
            value={[dividendYield]}
            onValueChange={(value) =>
              dispatch({
                type: "SET_DIVIDEND_YIELD",
                payload: value[0],
              })
            }
            min={0}
            max={20}
            step={0.1}
            className="mt-2"
          />
          <div
            id="dividendYieldValue"
            className="text-right text-sm text-muted-foreground mt-1"
            aria-live="polite"
          >
            {dividendYield.toFixed(1)}%
          </div>
        </div>

        {dividendYield > 0 && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="reinvestDividends"
              checked={reinvestDividends}
              onChange={(e) =>
                dispatch({
                  type: "SET_REINVEST_DIVIDENDS",
                  payload: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="reinvestDividends"
              className="text-sm cursor-pointer"
            >
              Reinvest dividends
            </label>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Inflation & Tax</h3>
          <div>
            <label id="inflationRateLabel" className="text-sm">
              Expected inflation rate (%)
            </label>
            <Slider
              id="inflationRate"
              aria-labelledby="inflationRateLabel inflationRateValue"
              value={[inflationRate]}
              onValueChange={(value) =>
                dispatch({
                  type: "SET_INFLATION_RATE",
                  payload: value[0],
                })
              }
              min={0}
              max={10}
              step={0.1}
              className="mt-2"
            />
            <div
              id="inflationRateValue"
              className="text-right text-sm text-muted-foreground mt-1"
              aria-live="polite"
            >
              {inflationRate.toFixed(1)}%
            </div>
          </div>

          <div className="mt-4">
            <label id="taxBracketLabel" className="text-sm">
              Tax bracket (%)
            </label>
            <Slider
              id="taxBracket"
              aria-labelledby="taxBracketLabel taxBracketValue"
              value={[taxBracket]}
              onValueChange={(value) =>
                dispatch({
                  type: "SET_TAX_BRACKET",
                  payload: value[0],
                })
              }
              min={0}
              max={45}
              step={1}
              className="mt-2"
            />
            <div
              id="taxBracketValue"
              className="text-right text-sm text-muted-foreground mt-1"
              aria-live="polite"
            >
              {taxBracket}%
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Tax is applied to withdrawals as they occur (subject to R40k annual
            exclusion). Remaining gains taxed at maturity.
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Withdrawals</h3>
          <div>
            <label id="withdrawalRateLabel" className="text-sm">
              Annual withdrawal rate (%)
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <Slider
                id="withdrawalRate"
                aria-labelledby="withdrawalRateLabel withdrawalRateValue"
                value={[withdrawalPercentage]}
                onValueChange={(value) =>
                  dispatch({
                    type: "SET_WITHDRAWAL_PERCENTAGE",
                    payload: value[0],
                  })
                }
                min={0}
                max={10}
                step={0.1}
                className="mt-2 flex-1 min-w-[200px]"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch({
                    type: "SET_WITHDRAWAL_PERCENTAGE",
                    payload: 4.0,
                  })
                }
              >
                4% Rule
              </Button>
            </div>
            <div
              id="withdrawalRateValue"
              className="text-right text-sm text-muted-foreground mt-1"
              aria-live="polite"
            >
              {withdrawalPercentage.toFixed(2)}% of portfolio per year
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
