import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  } = useContext(InvestmentContext);

  const dispatch = useContext(InvestmentDispatchContext);
  const [localStartingBalance, setLocalStartingBalance] = useState(
    startingBalance === 0 ? "" : startingBalance.toString()
  );
  const isEditingRef = useRef(false);
  const [localPeriodValues, setLocalPeriodValues] = useState({});

  useEffect(() => {
    if (!isEditingRef.current) {
      setLocalStartingBalance(
        startingBalance === 0 ? "" : startingBalance.toString()
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
    const value = e.target.value;
    setLocalStartingBalance(value);
    const numValue = parseFloat(value) || 0;
    dispatch({
      type: "SET_STARTING_BALANCE",
      payload: numValue,
    });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <label className="text-sm">Starting balance (R)</label>
          <Input
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
                  value={
                    localPeriodValues[`${index}-years`] !== undefined
                      ? localPeriodValues[`${index}-years`]
                      : period.years || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalPeriodValues((prev) => ({
                      ...prev,
                      [`${index}-years`]: value,
                    }));
                    if (value !== "") {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue >= 1) {
                        dispatch({
                          type: "UPDATE_INVESTMENT_PERIOD",
                          payload: {
                            index,
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
                      [`${index}-years`]: period.years?.toString() || "",
                    }));
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    const numValue = parseInt(value) || 1;
                    setLocalPeriodValues((prev) => {
                      const newState = { ...prev };
                      delete newState[`${index}-years`];
                      return newState;
                    });
                    dispatch({
                      type: "UPDATE_INVESTMENT_PERIOD",
                      payload: {
                        index,
                        field: "years",
                        value: numValue,
                      },
                    });
                  }}
                  placeholder="10"
                />
              </div>
              <div>
                <label className="text-sm">Monthly investment (R)</label>
                <Input
                  type="number"
                  min={0}
                  step={100}
                  value={
                    localPeriodValues[`${index}-monthlyInvestment`] !== undefined
                      ? localPeriodValues[`${index}-monthlyInvestment`]
                      : period.monthlyInvestment || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalPeriodValues((prev) => ({
                      ...prev,
                      [`${index}-monthlyInvestment`]: value,
                    }));
                    if (value !== "") {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue) && numValue >= 0) {
                        dispatch({
                          type: "UPDATE_INVESTMENT_PERIOD",
                          payload: {
                            index,
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
                      [`${index}-monthlyInvestment`]: period.monthlyInvestment?.toString() || "",
                    }));
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    const numValue = parseFloat(value) || 0;
                    setLocalPeriodValues((prev) => {
                      const newState = { ...prev };
                      delete newState[`${index}-monthlyInvestment`];
                      return newState;
                    });
                    dispatch({
                      type: "UPDATE_INVESTMENT_PERIOD",
                      payload: {
                        index,
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
                  className="mt-6"
                  variant="destructive"
                  onClick={() =>
                    dispatch({
                      type: "DELETE_INVESTMENT_PERIOD",
                      payload: index,
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
          <label className="text-sm">Expected annual return (%)</label>
          <Slider
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
            className="mt-2"
          />
          <div className="text-right text-sm text-muted-foreground mt-1">
            {annualReturn.toFixed(1)}%
          </div>
        </div>

        <div>
          <label className="text-sm">Annual dividend yield (%)</label>
          <Slider
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
          <div className="text-right text-sm text-muted-foreground mt-1">
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
      </CardContent>
    </Card>
  );
}
