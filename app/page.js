"use client";

import React, { useReducer, useState, useEffect, useMemo } from "react";
import Footer from "@/components/footer";
import InvestmentInfo from "@/components/investmentInfo";
import Header from "@/components/header";
import Results from "@/components/results";
import InvestmentBreakdown from "@/components/investmentBreakdown";
import {
  InvestmentContext,
  InvestmentDispatchContext,
} from "@/utils/investmentContext";

// Action types
const ACTIONS = {
  SET_STARTING_BALANCE: "SET_STARTING_BALANCE",
  SET_ANNUAL_RETURN: "SET_ANNUAL_RETURN",
  SET_DIVIDEND_YIELD: "SET_DIVIDEND_YIELD",
  SET_REINVEST_DIVIDENDS: "SET_REINVEST_DIVIDENDS",
  SET_INFLATION_RATE: "SET_INFLATION_RATE",
  SET_TAX_BRACKET: "SET_TAX_BRACKET",
  SET_WITHDRAWAL_PERCENTAGE: "SET_WITHDRAWAL_PERCENTAGE",
  ADD_INVESTMENT_PERIOD: "ADD_INVESTMENT_PERIOD",
  DELETE_INVESTMENT_PERIOD: "DELETE_INVESTMENT_PERIOD",
  UPDATE_INVESTMENT_PERIOD: "UPDATE_INVESTMENT_PERIOD",
};

// Initial state
const initialState = {
  startingBalance: 0,
  investmentPeriods: [{ years: 10, monthlyInvestment: 15000 }],
  annualReturn: 10.0,
  dividendYield: 0.0,
  reinvestDividends: false,
  inflationRate: 0.0,
  taxBracket: 0, // 0-45% (South African tax brackets)
  withdrawalPercentage: 0.0,
};

// Reducer function
const investmentReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_STARTING_BALANCE:
      return {
        ...state,
        startingBalance: action.payload,
      };

    case ACTIONS.SET_ANNUAL_RETURN:
      return {
        ...state,
        annualReturn: action.payload,
      };

    case ACTIONS.SET_DIVIDEND_YIELD:
      return {
        ...state,
        dividendYield: action.payload,
      };

    case ACTIONS.SET_REINVEST_DIVIDENDS:
      return {
        ...state,
        reinvestDividends: action.payload,
      };

    case ACTIONS.SET_INFLATION_RATE:
      return {
        ...state,
        inflationRate: action.payload,
      };

    case ACTIONS.SET_TAX_BRACKET:
      return {
        ...state,
        taxBracket: action.payload,
      };

    case ACTIONS.SET_WITHDRAWAL_PERCENTAGE:
      return {
        ...state,
        withdrawalPercentage: action.payload,
      };

    case ACTIONS.ADD_INVESTMENT_PERIOD:
      return {
        ...state,
        investmentPeriods: [
          ...state.investmentPeriods,
          { years: 10, monthlyInvestment: 15000 },
        ],
      };

    case ACTIONS.DELETE_INVESTMENT_PERIOD:
      if (state.investmentPeriods.length <= 1) return state;
      return {
        ...state,
        investmentPeriods: state.investmentPeriods.filter(
          (_, index) => index !== action.payload,
        ),
      };

    case ACTIONS.UPDATE_INVESTMENT_PERIOD:
      return {
        ...state,
        investmentPeriods: state.investmentPeriods.map((period, index) =>
          index === action.payload.index
            ? { ...period, [action.payload.field]: action.payload.value }
            : period,
        ),
      };

    default:
      return state;
  }
};

const InvestmentCalculator = () => {
  const [state, dispatch] = useReducer(investmentReducer, initialState);
  const [isMounted, setIsMounted] = useState(false);
  const {
    startingBalance,
    investmentPeriods,
    annualReturn,
    dividendYield,
    reinvestDividends,
    inflationRate,
    taxBracket,
    withdrawalPercentage,
  } = state;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const calculatedData = useMemo(() => {
    if (!isMounted) return [];

    // Growth happens at full return rate - tax is applied at withdrawal/maturity
    // Tax-advantaged accounts may have different tax treatment at withdrawal
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
    const monthlyDividendRate = dividendYield / 100 / 12;
    const monthlyInflation = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;
    const monthlyWithdrawalRate = withdrawalPercentage / 100 / 12;

    const data = [];
    let balance = startingBalance;
    let costBasis = startingBalance; // Track cost basis for capital gains calculation
    let currentDate = new Date();
    let cumulativeInflation = 1;
    let annualCapitalGains = 0; // Track annual capital gains for R40k exclusion

    // Add the initial entry (starting balance, start of period)
    data.push({
      date: currentDate.toISOString().split("T")[0],
      balance: balance,
      balanceAfterInflation: balance,
      withdrawals: 0,
      period: 0,
    });

    investmentPeriods.forEach((period, periodIndex) => {
      for (let month = 0; month < period.years * 12; month++) {
        // Calculate monthly dividend
        const monthlyDividend = balance * monthlyDividendRate;

        // If dividends are reinvested, add them to balance and cost basis
        if (reinvestDividends && monthlyDividend > 0) {
          balance = balance + monthlyDividend;
          costBasis = costBasis + monthlyDividend; // Reinvested dividends increase cost basis
        }

        // Apply monthly investment
        balance = balance + period.monthlyInvestment;
        costBasis = costBasis + period.monthlyInvestment; // Add contributions to cost basis

        // Apply monthly return first
        balance = balance * (1 + monthlyReturn);

        // Calculate withdrawal if applicable (after return)
        const withdrawal = balance * monthlyWithdrawalRate;
        let withdrawalTax = 0;

        if (withdrawal > 0 && taxBracket > 0) {
          // Calculate proportion of withdrawal that is gains
          const totalValue = balance;
          const totalGains = totalValue - costBasis;
          const gainRatio =
            totalGains > 0 && totalValue > 0 ? totalGains / totalValue : 0;

          // Calculate capital gains portion of withdrawal
          const capitalGainsInWithdrawal = withdrawal * gainRatio;

          // Apply R40k annual exclusion (pro-rated monthly)
          const monthlyExclusion = 40000 / 12;
          const taxableGains = Math.max(
            0,
            capitalGainsInWithdrawal - monthlyExclusion,
          );

          // Calculate tax on taxable gains
          withdrawalTax = taxableGains * (taxBracket / 100);

          // Update annual capital gains tracking
          annualCapitalGains += capitalGainsInWithdrawal;

          // Reset at year end (every 12 months)
          if ((month + 1) % 12 === 0) {
            annualCapitalGains = 0;
          }

          // Update cost basis (reduce proportionally)
          const costBasisRatio = costBasis / totalValue;
          costBasis = costBasis - withdrawal * costBasisRatio;
        } else if (withdrawal > 0) {
          // Update cost basis even if not taxing (proportional reduction)
          const costBasisRatio = costBasis / balance;
          costBasis = costBasis - withdrawal * costBasisRatio;
        }

        balance = balance - withdrawal - withdrawalTax;

        // Update inflation factor
        cumulativeInflation = cumulativeInflation * (1 + monthlyInflation);

        currentDate = new Date(
          currentDate.setMonth(currentDate.getMonth() + 1),
        );

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
  }, [
    isMounted,
    startingBalance,
    investmentPeriods,
    annualReturn,
    dividendYield,
    reinvestDividends,
    inflationRate,
    withdrawalPercentage,
    taxBracket,
  ]);

  const finalBalance = calculatedData[calculatedData.length - 1]?.balance || 0;
  const finalBalanceAfterInflation =
    calculatedData[calculatedData.length - 1]?.balanceAfterInflation || 0;
  const totalContributions = investmentPeriods.reduce(
    (acc, period) => acc + period.monthlyInvestment * period.years * 12,
    0,
  );
  // Total earnings = final balance - contributions - starting balance
  const totalEarnings = finalBalance - totalContributions - startingBalance;

  // Calculate total withdrawals
  const totalWithdrawals = calculatedData.reduce(
    (acc, d) => acc + (d.withdrawals || 0),
    0,
  );

  // Calculate total withdrawal tax paid
  const totalWithdrawalTax = calculatedData.reduce(
    (acc, d) => acc + (d.withdrawalTax || 0),
    0,
  );

  // Tax calculation: tax already paid on withdrawals, apply remaining tax on final gains
  const finalGains = finalBalance - startingBalance - totalContributions;
  const remainingGains = finalGains - totalWithdrawals;
  const remainingTax =
    remainingGains > 0 ? remainingGains * (taxBracket / 100) : 0;
  const totalEarningsAfterTax =
    totalEarnings - totalWithdrawalTax - remainingTax;

  const calculateBreakdown = () => {
    if (!isMounted || calculatedData.length === 0) return [];

    const breakdown = [];
    let openingBalance = startingBalance;
    let startYear = new Date().getFullYear();
    let cumulativeInflation = 1;
    const monthlyInflation = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;

    investmentPeriods.forEach((period, index) => {
      const periodData = calculatedData.filter((d) => d.period === index + 1);
      const closingBalance = periodData[periodData.length - 1]?.balance || 0;
      const closingBalanceAfterInflation =
        periodData[periodData.length - 1]?.balanceAfterInflation || 0;
      const totalContributions = period.monthlyInvestment * period.years * 12;
      const totalWithdrawals = periodData.reduce(
        (acc, d) => acc + (d.withdrawals || 0),
        0,
      );
      const totalWithdrawalTax = periodData.reduce(
        (acc, d) => acc + (d.withdrawalTax || 0),
        0,
      );

      // Total earnings for the period (before tax)
      const totalEarnings =
        closingBalance - openingBalance - totalContributions + totalWithdrawals;

      // Tax calculation: tax already paid on withdrawals, calculate remaining tax
      const periodGains = closingBalance - openingBalance - totalContributions;
      const remainingGains = periodGains - totalWithdrawals;
      const remainingTax =
        remainingGains > 0 ? remainingGains * (taxBracket / 100) : 0;
      const totalEarningsAfterTax =
        totalEarnings - totalWithdrawalTax - remainingTax;
      const endYear = startYear + period.years - 1;

      // Update inflation for next period
      cumulativeInflation =
        cumulativeInflation * Math.pow(1 + monthlyInflation, period.years * 12);

      breakdown.push({
        period: index + 1,
        years: `${startYear}-${endYear}`,
        openingBalance,
        totalContributions,
        totalEarnings,
        totalEarningsAfterTax,
        totalWithdrawals,
        totalWithdrawalTax,
        closingBalance,
        closingBalanceAfterInflation,
      });

      openingBalance = closingBalance;
      startYear = endYear + 1;
    });

    return breakdown;
  };

  return (
    <InvestmentContext.Provider value={state}>
      <InvestmentDispatchContext.Provider value={dispatch}>
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <Header />
          <InvestmentInfo />

          {calculatedData.length > 0 && (
            <>
              <Results
                finalBalance={finalBalance}
                finalBalanceAfterInflation={finalBalanceAfterInflation}
                totalEarnings={totalEarnings}
                totalEarningsAfterTax={totalEarningsAfterTax}
                totalContributions={totalContributions}
                totalWithdrawals={totalWithdrawals}
                totalWithdrawalTax={totalWithdrawalTax}
                calculatedData={calculatedData}
                inflationRate={inflationRate}
                taxBracket={taxBracket}
              />
              <InvestmentBreakdown
                calculateBreakdown={calculateBreakdown}
                inflationRate={inflationRate}
              />
              <Footer />
            </>
          )}
        </div>
      </InvestmentDispatchContext.Provider>
    </InvestmentContext.Provider>
  );
};

export default InvestmentCalculator;
