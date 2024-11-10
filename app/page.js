"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InvestmentCalculator = () => {
  const [investmentPeriods, setInvestmentPeriods] = useState([
    { years: 10, monthlyInvestment: 15000 },
  ]);
  const [annualReturn, setAnnualReturn] = useState(7.0);

  const addInvestmentPeriod = () => {
    setInvestmentPeriods([
      ...investmentPeriods,
      { years: 10, monthlyInvestment: 15000 },
    ]);
  };

  const deleteInvestmentPeriod = (index) => {
    if (investmentPeriods.length > 1) {
      const newPeriods = [...investmentPeriods];
      newPeriods.splice(index, 1);
      setInvestmentPeriods(newPeriods);
    }
  };

  const updatePeriod = (index, field, value) => {
    const newPeriods = [...investmentPeriods];
    newPeriods[index][field] = value;
    setInvestmentPeriods(newPeriods);
  };

  const calculateInvestmentGrowth = () => {
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;

    const data = [];
    let balance = 0;
    let currentDate = new Date();

    // Add the initial entry (0 balance, start of period)
    data.push({
      date: currentDate.toISOString().split("T")[0],
      balance: balance,
      period: 0,
    });

    investmentPeriods.forEach((period, periodIndex) => {
      for (let month = 0; month < period.years * 12; month++) {
        balance = (balance + period.monthlyInvestment) * (1 + monthlyReturn);
        currentDate = new Date(
          currentDate.setMonth(currentDate.getMonth() + 1)
        );

        data.push({
          date: currentDate.toISOString().split("T")[0],
          balance: Math.round(balance),
          period: periodIndex + 1,
        });
      }
    });

    return data;
  };

  const calculatedData = calculateInvestmentGrowth();
  const finalBalance = calculatedData[calculatedData.length - 1]?.balance || 0;
  const totalContributions = investmentPeriods.reduce(
    (acc, period) => acc + period.monthlyInvestment * period.years * 12,
    0
  );
  const totalEarnings = finalBalance - totalContributions;

  // Calculate breakdown data
  const calculateBreakdown = () => {
    const breakdown = [];
    let openingBalance = 0;
    let startYear = new Date().getFullYear();

    investmentPeriods.forEach((period, index) => {
      const periodData = calculatedData.filter((d) => d.period === index + 1);
      const closingBalance = periodData[periodData.length - 1]?.balance || 0;
      const totalContributions = period.monthlyInvestment * period.years * 12;
      const totalEarnings =
        closingBalance - openingBalance - totalContributions;
      const endYear = startYear + period.years - 1;

      breakdown.push({
        period: index + 1,
        years: `${startYear}-${endYear}`,
        openingBalance,
        totalContributions,
        totalEarnings,
        closingBalance,
      });

      openingBalance = closingBalance;
      startYear = endYear + 1;
    });

    return breakdown;
  };

  const formatCurrency = (value) => {
    return `R${value.toLocaleString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Investment Calculator
        </CardTitle>
        <p className="text-muted-foreground">
          Calculate the future value of your monthly investments.
        </p>
      </CardHeader>

      <Card>
        <CardContent className="p-6 space-y-6">
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

      {calculatedData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Final Balance
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(finalBalance)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Total Contributions
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalContributions)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Total Earnings
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalEarnings)}
                  </div>
                </div>
              </div>

              <div className="h-[400px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calculatedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).getFullYear()}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `R${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString()
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      data={calculatedData}
                      name="Investment Growth"
                      stroke="#007AFF"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calculateBreakdown().map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
                  >
                    <div>
                      <div className="text-sm text-muted-foreground pb-6">
                        Period {item.period} ({item.years})
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Opening Balance
                      </div>
                      <div className="font-bold">
                        {formatCurrency(item.openingBalance)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Total Contributions
                      </div>
                      <div className="font-bold">
                        {formatCurrency(item.totalContributions)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Total Earnings
                      </div>
                      <div className="font-bold">
                        {formatCurrency(item.totalEarnings)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Closing Balance
                      </div>
                      <div className="font-bold">
                        {formatCurrency(item.closingBalance)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InvestmentCalculator;
