"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GrowthChart from "@/components/growthChart";
import { formatCurrency } from "@/utils/formatCurrency";

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
        <CardTitle as="h2">Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Final Balance</div>
            <div className="text-xl sm:text-2xl font-bold break-words">
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
            <div className="text-xl sm:text-2xl font-bold break-words">
              {formatCurrency(totalContributions || 0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Total Earnings</div>
            <div className="text-xl sm:text-2xl font-bold break-words">
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

        <div className="mt-6">
          <GrowthChart
            calculatedData={calculatedData}
            inflationRate={inflationRate}
          />
        </div>
      </CardContent>
    </Card>
  );
}
