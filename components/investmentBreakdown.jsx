import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

export default function InvestmentBreakdown({ calculateBreakdown }) {
  return (
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
  );
}
