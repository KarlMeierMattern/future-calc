export function calculateInvestmentTimeline({
  startingBalance,
  investmentPeriods,
  annualReturn,
  dividendYield,
  reinvestDividends,
  inflationRate,
  taxBracket,
  withdrawalPercentage,
}) {
  const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
  const monthlyDividendRate = dividendYield / 100 / 12;
  const monthlyInflation = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;
  const monthlyWithdrawalRate = withdrawalPercentage / 100 / 12;

  const data = [];
  let balance = startingBalance;
  let costBasis = startingBalance;
  let currentDate = new Date();
  let cumulativeInflation = 1;

  data.push({
    date: currentDate.toISOString().split("T")[0],
    balance,
    balanceAfterInflation: balance,
    withdrawals: 0,
    period: 0,
  });

  investmentPeriods.forEach((period, periodIndex) => {
    for (let month = 0; month < period.years * 12; month++) {
      const monthlyDividend = balance * monthlyDividendRate;

      if (reinvestDividends && monthlyDividend > 0) {
        balance += monthlyDividend;
        costBasis += monthlyDividend;
      }

      balance += period.monthlyInvestment;
      costBasis += period.monthlyInvestment;
      balance *= 1 + monthlyReturn;

      const withdrawal = balance * monthlyWithdrawalRate;
      let withdrawalTax = 0;

      if (withdrawal > 0 && taxBracket > 0) {
        const totalValue = balance;
        const totalGains = totalValue - costBasis;
        const gainRatio =
          totalGains > 0 && totalValue > 0 ? totalGains / totalValue : 0;
        const capitalGainsInWithdrawal = withdrawal * gainRatio;
        const monthlyExclusion = 40000 / 12;
        const taxableGains = Math.max(
          0,
          capitalGainsInWithdrawal - monthlyExclusion,
        );

        withdrawalTax = taxableGains * (taxBracket / 100);

        const costBasisRatio = costBasis / totalValue;
        costBasis -= withdrawal * costBasisRatio;
      } else if (withdrawal > 0) {
        const costBasisRatio = costBasis / balance;
        costBasis -= withdrawal * costBasisRatio;
      }

      balance -= withdrawal + withdrawalTax;
      cumulativeInflation *= 1 + monthlyInflation;

      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));

      data.push({
        date: currentDate.toISOString().split("T")[0],
        balance: Math.round(balance),
        balanceAfterInflation: Math.round(balance / cumulativeInflation),
        withdrawals: Math.round(withdrawal),
        withdrawalTax: Math.round(withdrawalTax),
        period: periodIndex + 1,
      });
    }
  });

  return data;
}

export function calculatePeriodEarningsAfterTax({
  totalEarnings,
  totalWithdrawalTax,
  closingBalance,
  openingBalance,
  totalContributions,
  totalWithdrawals,
  taxBracket,
}) {
  const periodGains = closingBalance - openingBalance - totalContributions;
  const remainingGains = periodGains - totalWithdrawals;
  const remainingTax =
    remainingGains > 0 ? remainingGains * (taxBracket / 100) : 0;
  return totalEarnings - totalWithdrawalTax - remainingTax;
}

export function calculateSummary(
  calculatedData,
  { startingBalance, investmentPeriods, taxBracket },
) {
  const finalBalance = calculatedData[calculatedData.length - 1]?.balance || 0;
  const finalBalanceAfterInflation =
    calculatedData[calculatedData.length - 1]?.balanceAfterInflation || 0;
  const totalContributions = investmentPeriods.reduce(
    (acc, period) => acc + period.monthlyInvestment * period.years * 12,
    0,
  );
  const totalEarnings = finalBalance - totalContributions - startingBalance;
  const totalWithdrawals = calculatedData.reduce(
    (acc, d) => acc + (d.withdrawals || 0),
    0,
  );
  const totalWithdrawalTax = calculatedData.reduce(
    (acc, d) => acc + (d.withdrawalTax || 0),
    0,
  );
  const finalGains = finalBalance - startingBalance - totalContributions;
  const remainingGains = finalGains - totalWithdrawals;
  const remainingTax =
    remainingGains > 0 ? remainingGains * (taxBracket / 100) : 0;
  const totalEarningsAfterTax =
    totalEarnings - totalWithdrawalTax - remainingTax;

  return {
    finalBalance,
    finalBalanceAfterInflation,
    totalContributions,
    totalEarnings,
    totalWithdrawals,
    totalWithdrawalTax,
    totalEarningsAfterTax,
  };
}

export function calculatePeriodBreakdown(
  calculatedData,
  { startingBalance, investmentPeriods, inflationRate, taxBracket },
) {
  if (calculatedData.length === 0) return [];

  const periodBreakdown = [];
  let openingBalance = startingBalance;
  let startYear = new Date().getFullYear();
  let cumulativeInflation = 1;
  const monthlyInflation = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;

  investmentPeriods.forEach((period, index) => {
    const periodData = calculatedData.filter((d) => d.period === index + 1);
    const closingBalance = periodData[periodData.length - 1]?.balance || 0;
    const closingBalanceAfterInflation =
      periodData[periodData.length - 1]?.balanceAfterInflation || 0;
    const periodContributions = period.monthlyInvestment * period.years * 12;
    const periodWithdrawals = periodData.reduce(
      (acc, d) => acc + (d.withdrawals || 0),
      0,
    );
    const periodWithdrawalTax = periodData.reduce(
      (acc, d) => acc + (d.withdrawalTax || 0),
      0,
    );
    const totalEarnings =
      closingBalance -
      openingBalance -
      periodContributions +
      periodWithdrawals;
    const totalEarningsAfterTax = calculatePeriodEarningsAfterTax({
      totalEarnings,
      totalWithdrawalTax: periodWithdrawalTax,
      closingBalance,
      openingBalance,
      totalContributions: periodContributions,
      totalWithdrawals: periodWithdrawals,
      taxBracket,
    });
    const endYear = startYear + period.years - 1;

    cumulativeInflation *= Math.pow(
      1 + monthlyInflation,
      period.years * 12,
    );

    periodBreakdown.push({
      period: index + 1,
      years: `${startYear}-${endYear}`,
      openingBalance,
      totalContributions: periodContributions,
      totalEarnings,
      totalEarningsAfterTax,
      totalWithdrawals: periodWithdrawals,
      totalWithdrawalTax: periodWithdrawalTax,
      closingBalance,
      closingBalanceAfterInflation,
    });

    openingBalance = closingBalance;
    startYear = endYear + 1;
  });

  return periodBreakdown;
}
