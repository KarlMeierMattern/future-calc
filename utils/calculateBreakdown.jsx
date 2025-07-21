// Calculate breakdown data
export const calculateBreakdown = () => {
  const breakdown = [];
  let openingBalance = startingBalance;
  let startYear = new Date().getFullYear();

  investmentPeriods.forEach((period, index) => {
    const periodData = calculatedData.filter((d) => d.period === index + 1);
    const closingBalance = periodData[periodData.length - 1]?.balance || 0;
    const totalContributions = period.monthlyInvestment * period.years * 12;
    const totalEarnings = closingBalance - openingBalance - totalContributions;
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
