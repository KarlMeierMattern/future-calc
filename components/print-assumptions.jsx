"use client";

import { Fragment, useContext } from "react";
import { InvestmentContext } from "@/utils/investmentContext";
import { formatCurrency } from "@/utils/formatCurrency";

export default function PrintAssumptions() {
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

  const generatedAt = new Date().toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="hidden print:block print:mb-6 print:break-inside-avoid">
      <h2 className="text-lg font-semibold mb-1">Assumptions</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Report generated {generatedAt}
      </p>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Starting balance</dt>
        <dd className="font-medium">{formatCurrency(startingBalance)}</dd>

        {investmentPeriods.map((period, index) => (
          <Fragment key={period.id}>
            <dt className="text-muted-foreground">
              Period {index + 1} duration
            </dt>
            <dd className="font-medium">{period.years} years</dd>
            <dt className="text-muted-foreground">
              Period {index + 1} monthly investment
            </dt>
            <dd className="font-medium">
              {formatCurrency(period.monthlyInvestment)}
            </dd>
          </Fragment>
        ))}

        <dt className="text-muted-foreground">Expected annual return</dt>
        <dd className="font-medium">{annualReturn.toFixed(1)}%</dd>

        <dt className="text-muted-foreground">Annual dividend yield</dt>
        <dd className="font-medium">{dividendYield.toFixed(1)}%</dd>

        {dividendYield > 0 && (
          <>
            <dt className="text-muted-foreground">Reinvest dividends</dt>
            <dd className="font-medium">{reinvestDividends ? "Yes" : "No"}</dd>
          </>
        )}

        <dt className="text-muted-foreground">Expected inflation</dt>
        <dd className="font-medium">{inflationRate.toFixed(1)}%</dd>

        <dt className="text-muted-foreground">Tax bracket</dt>
        <dd className="font-medium">{taxBracket}%</dd>

        <dt className="text-muted-foreground">Annual withdrawal rate</dt>
        <dd className="font-medium">{withdrawalPercentage.toFixed(2)}%</dd>
      </dl>
    </section>
  );
}
