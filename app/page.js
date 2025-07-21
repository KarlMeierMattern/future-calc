"use client";

import React, { useReducer } from "react";
import Footer from "@/components/footer";
import InvestmentInfo from "@/components/investmentInfo";
import Header from "@/components/header";
import Results from "@/components/results";
import InvestmentBreakdown from "@/components/investmentBreakdown";

// Action types
const ACTIONS = {
  SET_STARTING_BALANCE: "SET_STARTING_BALANCE",
  SET_ANNUAL_RETURN: "SET_ANNUAL_RETURN",
  ADD_INVESTMENT_PERIOD: "ADD_INVESTMENT_PERIOD",
  DELETE_INVESTMENT_PERIOD: "DELETE_INVESTMENT_PERIOD",
  UPDATE_INVESTMENT_PERIOD: "UPDATE_INVESTMENT_PERIOD",
};

// Initial state
const initialState = {
  startingBalance: 0,
  investmentPeriods: [{ years: 10, monthlyInvestment: 15000 }],
  annualReturn: 10.0,
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
          (_, index) => index !== action.payload
        ),
      };

    case ACTIONS.UPDATE_INVESTMENT_PERIOD:
      return {
        ...state,
        investmentPeriods: state.investmentPeriods.map((period, index) =>
          index === action.payload.index
            ? { ...period, [action.payload.field]: action.payload.value }
            : period
        ),
      };

    default:
      return state;
  }
};

const InvestmentCalculator = () => {
  const [state, dispatch] = useReducer(investmentReducer, initialState);
  const { startingBalance, investmentPeriods, annualReturn } = state;

  const addInvestmentPeriod = () => {
    dispatch({ type: ACTIONS.ADD_INVESTMENT_PERIOD });
  };

  const deleteInvestmentPeriod = (index) => {
    dispatch({ type: ACTIONS.DELETE_INVESTMENT_PERIOD, payload: index });
  };

  const updatePeriod = (index, field, value) => {
    dispatch({
      type: ACTIONS.UPDATE_INVESTMENT_PERIOD,
      payload: { index, field, value },
    });
  };

  const setStartingBalance = (value) => {
    dispatch({ type: ACTIONS.SET_STARTING_BALANCE, payload: value });
  };

  const setAnnualReturn = (value) => {
    dispatch({ type: ACTIONS.SET_ANNUAL_RETURN, payload: value });
  };

  const calculateInvestmentGrowth = () => {
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;

    const data = [];
    let balance = startingBalance;
    let currentDate = new Date();

    // Add the initial entry (starting balance, start of period)
    data.push({
      date: currentDate.toISOString().split("T")[0],
      balance: balance,
      period: 0,
    });

    investmentPeriods.forEach((period, periodIndex) => {
      for (let month = 0; month < period.years * 12; month++) {
        balance = (balance + period.monthlyInvestment) * (1 + monthlyReturn);
        currentDate = new Date(
          currentDate.setMonth(currentDate.getMonth() + 1)
        );

        data.push({
          date: currentDate.toISOString().split("T")[0],
          balance: Math.round(balance),
          period: periodIndex + 1,
        });
      }
    });

    return data;
  };

  const calculateBreakdown = () => {
    const breakdown = [];
    let openingBalance = startingBalance;
    let startYear = new Date().getFullYear();

    investmentPeriods.forEach((period, index) => {
      const periodData = calculatedData.filter((d) => d.period === index + 1);
      const closingBalance = periodData[periodData.length - 1]?.balance || 0;
      const totalContributions = period.monthlyInvestment * period.years * 12;
      const totalEarnings =
        closingBalance - openingBalance - totalContributions;
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

  const calculatedData = calculateInvestmentGrowth();
  const finalBalance = calculatedData[calculatedData.length - 1]?.balance || 0;
  const totalContributions = investmentPeriods.reduce(
    (acc, period) => acc + period.monthlyInvestment * period.years * 12,
    0
  );
  const totalEarnings = finalBalance - totalContributions;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Header />
      <InvestmentInfo
        startingBalance={startingBalance}
        setStartingBalance={setStartingBalance}
        investmentPeriods={investmentPeriods}
        annualReturn={annualReturn}
        setAnnualReturn={setAnnualReturn}
        addInvestmentPeriod={addInvestmentPeriod}
        deleteInvestmentPeriod={deleteInvestmentPeriod}
        updatePeriod={updatePeriod}
      />

      {calculatedData.length > 0 && (
        <>
          <Results
            calculatedData={calculatedData}
            finalBalance={finalBalance}
            totalContributions={totalContributions}
            totalEarnings={totalEarnings}
          />
          <InvestmentBreakdown calculateBreakdown={calculateBreakdown} />
          <Footer />
        </>
      )}
    </div>
  );
};

export default InvestmentCalculator;
