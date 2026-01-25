import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

export default function InvestmentBreakdown({
  calculateBreakdown,
  inflationRate,
}) {
  const breakdown = calculateBreakdown();
  const hasWithdrawals = breakdown.some((item) => item.totalWithdrawals > 0);
  const hasWithdrawalTax = breakdown.some((item) => item.totalWithdrawalTax > 0);
  const hasTax = breakdown.some(
    (item) => item.totalEarningsAfterTax !== item.totalEarnings,
  );
  const hasInflation = inflationRate > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {breakdown.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 gap-4 ${
                hasWithdrawals && hasWithdrawalTax && hasTax
                  ? "md:grid-cols-9"
                  : hasWithdrawals && hasWithdrawalTax
                    ? "md:grid-cols-8"
                    : hasWithdrawals && hasTax
                      ? "md:grid-cols-8"
                      : hasTax
                        ? "md:grid-cols-7"
                        : hasWithdrawals
                          ? "md:grid-cols-6"
                          : "md:grid-cols-5"
              } items-center border-b pb-4 last:border-0`}
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
                  Contributions
                </div>
                <div className="font-bold">
                  {formatCurrency(item.totalContributions)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Earnings</div>
                <div className="font-bold">
                  {formatCurrency(item.totalEarnings)}
                </div>
              </div>
              {hasTax && (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Tax</div>
                  <div className="font-bold text-red-600">
                    {formatCurrency(item.totalEarnings - item.totalEarningsAfterTax)}
                  </div>
                </div>
              )}
              {hasTax && (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    After Tax Earnings
                  </div>
                  <div className="font-bold">
                    {formatCurrency(item.totalEarningsAfterTax)}
                  </div>
                </div>
              )}
              {hasWithdrawals && (
                <>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Withdrawals
                    </div>
                    <div className="font-bold text-orange-600">
                      {formatCurrency(item.totalWithdrawals)}
                    </div>
                  </div>
                  {item.totalWithdrawalTax > 0 && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Withdrawal Tax
                      </div>
                      <div className="font-bold text-red-600">
                        {formatCurrency(item.totalWithdrawalTax)}
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Closing Balance
                </div>
                <div className="font-bold">
                  {formatCurrency(item.closingBalance)}
                </div>
                {hasInflation && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(item.closingBalanceAfterInflation)} (today)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
