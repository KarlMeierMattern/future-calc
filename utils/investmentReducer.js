let nextPeriodId = 2;

export const initialInvestmentState = {
  startingBalance: 0,
  investmentPeriods: [{ id: 1, years: 10, monthlyInvestment: 15000 }],
  annualReturn: 10.0,
  dividendYield: 0.0,
  reinvestDividends: false,
  inflationRate: 0.0,
  taxBracket: 0,
  withdrawalPercentage: 0.0,
};

export function investmentReducer(state, action) {
  switch (action.type) {
    case "SET_STARTING_BALANCE":
      return { ...state, startingBalance: action.payload };

    case "SET_ANNUAL_RETURN":
      return { ...state, annualReturn: action.payload };

    case "SET_DIVIDEND_YIELD":
      return { ...state, dividendYield: action.payload };

    case "SET_REINVEST_DIVIDENDS":
      return { ...state, reinvestDividends: action.payload };

    case "SET_INFLATION_RATE":
      return { ...state, inflationRate: action.payload };

    case "SET_TAX_BRACKET":
      return { ...state, taxBracket: action.payload };

    case "SET_WITHDRAWAL_PERCENTAGE":
      return { ...state, withdrawalPercentage: action.payload };

    case "ADD_INVESTMENT_PERIOD":
      return {
        ...state,
        investmentPeriods: [
          ...state.investmentPeriods,
          { id: nextPeriodId++, years: 10, monthlyInvestment: 15000 },
        ],
      };

    case "DELETE_INVESTMENT_PERIOD":
      if (state.investmentPeriods.length <= 1) return state;
      return {
        ...state,
        investmentPeriods: state.investmentPeriods.filter(
          (period) => period.id !== action.payload,
        ),
      };

    case "UPDATE_INVESTMENT_PERIOD":
      return {
        ...state,
        investmentPeriods: state.investmentPeriods.map((period) =>
          period.id === action.payload.id
            ? { ...period, [action.payload.field]: action.payload.value }
            : period,
        ),
      };

    default:
      return state;
  }
}
