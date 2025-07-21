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
  totalEarnings,
  totalContributions,
  calculatedData,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Final Balance</div>
            <div className="text-2xl font-bold">
              {formatCurrency(finalBalance || 0)}
            </div>
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
                tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
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
  );
}
