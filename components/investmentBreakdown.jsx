import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

function BreakdownCard({ item, showTax, showWithdrawals, showInflation }) {
  return (
    <div className="rounded-lg border p-4 space-y-3 md:hidden">
      <div className="font-semibold">
        Period {item.period} ({item.years})
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Opening balance</dt>
        <dd className="font-medium text-right">{formatCurrency(item.openingBalance)}</dd>
        <dt className="text-muted-foreground">Contributions</dt>
        <dd className="font-medium text-right">{formatCurrency(item.totalContributions)}</dd>
        <dt className="text-muted-foreground">Earnings</dt>
        <dd className="font-medium text-right">{formatCurrency(item.totalEarnings)}</dd>
        {showTax && (
          <>
            <dt className="text-muted-foreground">Tax</dt>
            <dd className="font-medium text-right text-destructive">
              {formatCurrency(item.totalEarnings - item.totalEarningsAfterTax)}
            </dd>
            <dt className="text-muted-foreground">After tax earnings</dt>
            <dd className="font-medium text-right">{formatCurrency(item.totalEarningsAfterTax)}</dd>
          </>
        )}
        {showWithdrawals && (
          <>
            <dt className="text-muted-foreground">Withdrawals</dt>
            <dd className="font-medium text-right text-orange-700">
              {formatCurrency(item.totalWithdrawals)}
            </dd>
            {item.totalWithdrawalTax > 0 && (
              <>
                <dt className="text-muted-foreground">Withdrawal tax</dt>
                <dd className="font-medium text-right text-destructive">
                  {formatCurrency(item.totalWithdrawalTax)}
                </dd>
              </>
            )}
          </>
        )}
        <dt className="text-muted-foreground">Closing balance</dt>
        <dd className="font-medium text-right">{formatCurrency(item.closingBalance)}</dd>
        {showInflation && (
          <>
            <dt className="text-muted-foreground">Today&apos;s value</dt>
            <dd className="font-medium text-right text-muted-foreground">
              {formatCurrency(item.closingBalanceAfterInflation)}
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}

export default function InvestmentBreakdown({ breakdown, inflationRate }) {
  const showWithdrawals = breakdown.some((item) => item.totalWithdrawals > 0);
  const showWithdrawalTax = breakdown.some((item) => item.totalWithdrawalTax > 0);
  const showTax = breakdown.some(
    (item) => item.totalEarningsAfterTax !== item.totalEarnings,
  );
  const showInflation = inflationRate > 0;

  if (breakdown.length === 0) return null;

  return (
    <Card className="print:shadow-none print:break-inside-avoid">
      <CardHeader>
        <CardTitle as="h2">Investment Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 md:hidden print:hidden">
          {breakdown.map((item) => (
            <BreakdownCard
              key={item.period}
              item={item}
              showTax={showTax}
              showWithdrawals={showWithdrawals}
              showInflation={showInflation}
            />
          ))}
        </div>

        <div className="hidden md:block print:block overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">
              Investment breakdown by period
            </caption>
            <thead>
              <tr className="border-b">
                <th scope="col" className="py-2 pr-4 text-left font-medium text-muted-foreground">
                  Period
                </th>
                <th scope="col" className="py-2 px-2 text-right font-medium text-muted-foreground">
                  Opening
                </th>
                <th scope="col" className="py-2 px-2 text-right font-medium text-muted-foreground">
                  Contributions
                </th>
                <th scope="col" className="py-2 px-2 text-right font-medium text-muted-foreground">
                  Earnings
                </th>
                {showTax && (
                  <>
                    <th scope="col" className="py-2 px-2 text-right font-medium text-muted-foreground">
                      Tax
                    </th>
                    <th scope="col" className="py-2 px-2 text-right font-medium text-muted-foreground">
                      After tax
                    </th>
                  </>
                )}
                {showWithdrawals && (
                  <>
                    <th scope="col" className="py-2 px-2 text-right font-medium text-muted-foreground">
                      Withdrawals
                    </th>
                    {showWithdrawalTax && (
                      <th scope="col" className="py-2 px-2 text-right font-medium text-muted-foreground">
                        Wdl. tax
                      </th>
                    )}
                  </>
                )}
                <th scope="col" className="py-2 pl-2 text-right font-medium text-muted-foreground">
                  Closing
                </th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item) => (
                <tr key={item.period} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium whitespace-nowrap">
                    {item.period} ({item.years})
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {formatCurrency(item.openingBalance)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {formatCurrency(item.totalContributions)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {formatCurrency(item.totalEarnings)}
                  </td>
                  {showTax && (
                    <>
                      <td className="py-3 px-2 text-right tabular-nums text-destructive">
                        {formatCurrency(item.totalEarnings - item.totalEarningsAfterTax)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {formatCurrency(item.totalEarningsAfterTax)}
                      </td>
                    </>
                  )}
                  {showWithdrawals && (
                    <>
                      <td className="py-3 px-2 text-right tabular-nums text-orange-700">
                        {formatCurrency(item.totalWithdrawals)}
                      </td>
                      {showWithdrawalTax && (
                        <td className="py-3 px-2 text-right tabular-nums text-destructive">
                          {formatCurrency(item.totalWithdrawalTax)}
                        </td>
                      )}
                    </>
                  )}
                  <td className="py-3 pl-2 text-right tabular-nums">
                    <div>{formatCurrency(item.closingBalance)}</div>
                    {showInflation && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatCurrency(item.closingBalanceAfterInflation)} today
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
