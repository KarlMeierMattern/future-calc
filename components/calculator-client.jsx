"use client";

import { useReducer, useMemo } from "react";
import InvestmentInfo from "@/components/investmentInfo";
import Results from "@/components/results";
import InvestmentBreakdown from "@/components/investmentBreakdown";
import PrintAssumptions from "@/components/print-assumptions";
import PrintButton from "@/components/print-button";
import {
  InvestmentContext,
  InvestmentDispatchContext,
} from "@/utils/investmentContext";
import {
  initialInvestmentState,
  investmentReducer,
} from "@/utils/investmentReducer";
import {
  calculateInvestmentTimeline,
  calculateSummary,
  calculatePeriodBreakdown,
} from "@/utils/calculateInvestment";

export default function CalculatorClient() {
  const [state, dispatch] = useReducer(
    investmentReducer,
    initialInvestmentState,
  );

  const calculatedData = useMemo(
    () => calculateInvestmentTimeline(state),
    [state],
  );

  const summary = useMemo(
    () => calculateSummary(calculatedData, state),
    [calculatedData, state],
  );

  const breakdown = useMemo(
    () => calculatePeriodBreakdown(calculatedData, state),
    [calculatedData, state],
  );

  return (
    <InvestmentContext.Provider value={state}>
      <InvestmentDispatchContext.Provider value={dispatch}>
        <div className="flex justify-end print:hidden">
          <PrintButton />
        </div>
        <InvestmentInfo />
        <PrintAssumptions />
        <Results
          {...summary}
          calculatedData={calculatedData}
          inflationRate={state.inflationRate}
          taxBracket={state.taxBracket}
        />
        <InvestmentBreakdown
          breakdown={breakdown}
          inflationRate={state.inflationRate}
        />
      </InvestmentDispatchContext.Provider>
    </InvestmentContext.Provider>
  );
}
