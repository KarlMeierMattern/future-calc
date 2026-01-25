import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { InvestmentContext } from "@/utils/investmentContext";
import { useContext } from "react";
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

export default function Results({
  finalBalance,
  finalBalanceAfterInflation,
  totalEarnings,
  totalEarningsAfterTax,
  totalContributions,
  totalWithdrawals,
  totalWithdrawalTax,
  calculatedData,
  inflationRate,
  taxBracket,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Final Balance</div>
            <div className="text-2xl font-bold">
              {formatCurrency(finalBalance || 0)}
            </div>
            {inflationRate > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {formatCurrency(finalBalanceAfterInflation || 0)} (today&apos;s value)
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Total Contributions
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(totalContributions || 0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Total Earnings</div>
            <div className="text-2xl font-bold">
              {formatCurrency(totalEarnings || 0)}
            </div>
            {taxBracket > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                After tax: {formatCurrency(totalEarningsAfterTax || 0)}
              </div>
            )}
          </div>
        </div>

        {totalWithdrawals > 0 && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Total Withdrawals</div>
            <div className="text-xl font-bold">
              {formatCurrency(totalWithdrawals || 0)}
            </div>
            {totalWithdrawalTax > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Tax paid on withdrawals: {formatCurrency(totalWithdrawalTax || 0)}
              </div>
            )}
          </div>
        )}

        <div className="h-[400px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={calculatedData} 
              margin={{ right: 10, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="category"
                tickFormatter={(date) => new Date(date).getFullYear()}
                interval={Math.max(0, Math.floor(calculatedData.length / 10))}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "balanceAfterInflation") {
                    return formatCurrency(value) + " (today&apos;s value)";
                  }
                  return formatCurrency(value);
                }}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                name="Investment Growth"
                stroke="#007AFF"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              {inflationRate > 0 && (
                <Line
                  type="monotone"
                  dataKey="balanceAfterInflation"
                  name="Inflation Adjusted"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
