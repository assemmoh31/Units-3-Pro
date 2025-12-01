import { LucideIcon, Calculator, Coins, Landmark, TrendingUp, CreditCard, PieChart, Home, Briefcase, Percent, Activity, Building, Wallet, Shield } from 'lucide-react';
import { ChartDataPoint, LineSeries } from '../components/FinancialCharts';

export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'currency' | 'percent' | 'years';
  defaultValue: number;
  step?: number;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface CalculationResult {
  result: string;
  details: string[];
  chart?: {
    type: 'donut' | 'line' | 'bar';
    data?: ChartDataPoint[]; // For Donut/Bar
    series?: LineSeries[];   // For Line
    labels?: string[];       // X-axis
    title?: string;
  };
  stats?: {
    label: string;
    value: string;
    icon?: any;
    subtext?: string;
  }[];
}

export interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any; 
  inputs: CalculatorInput[];
  calculate: (values: Record<string, number>) => CalculationResult;
}

// --- Helper Math Functions ---
const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
const formatPercent = (val: number) => `${val.toFixed(2)}%`;
const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(val);

export const calculators: Record<string, CalculatorConfig> = {
  // ==========================================
  // LOANS & DEBT
  // ==========================================
  'loan-payment': {
    id: 'loan-payment',
    title: 'Loan Payment Calculator',
    description: 'Calculate your monthly payment and total interest breakdown.',
    category: 'Loans',
    icon: CreditCard,
    inputs: [
      { name: 'amount', label: 'Loan Amount', type: 'currency', defaultValue: 20000, min: 1000, max: 1000000, step: 1000 },
      { name: 'rate', label: 'Interest Rate (APR)', type: 'percent', defaultValue: 5.5, step: 0.1, min: 0.1, max: 30 },
      { name: 'years', label: 'Loan Term', type: 'years', defaultValue: 5, min: 1, max: 30 }
    ],
    calculate: (v) => {
      const p = v.amount;
      const r = v.rate / 100 / 12;
      const n = v.years * 12;
      
      let monthly = 0;
      let totalPayment = 0;
      let totalInterest = 0;

      if (r === 0) {
          monthly = p / n;
          totalPayment = p;
          totalInterest = 0;
      } else {
          monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          totalPayment = monthly * n;
          totalInterest = totalPayment - p;
      }

      return {
        result: formatCurrency(monthly) + ' / month',
        details: [
          `Total Repayment: ${formatCurrency(totalPayment)}`,
          `Total Interest: ${formatCurrency(totalInterest)}`
        ],
        chart: {
          type: 'donut',
          title: 'Total Cost Breakdown',
          data: [
            { label: 'Principal', value: p, color: '#10b981' }, 
            { label: 'Interest', value: totalInterest, color: '#f43f5e' } 
          ]
        },
        stats: [
            { label: 'Monthly Payment', value: formatCurrency(monthly) },
            { label: 'Total Interest', value: formatCurrency(totalInterest), subtext: `${((totalInterest/totalPayment)*100).toFixed(1)}% of total` },
            { label: 'Payoff Date', value: new Date(new Date().setMonth(new Date().getMonth() + n)).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) }
        ]
      };
    }
  },
  'car-loan': {
    id: 'car-loan',
    title: 'Auto Loan Calculator',
    description: 'Estimate monthly payments for a new or used car loan.',
    category: 'Loans',
    icon: CreditCard,
    inputs: [
      { name: 'price', label: 'Vehicle Price', type: 'currency', defaultValue: 35000, min: 5000 },
      { name: 'down', label: 'Down Payment', type: 'currency', defaultValue: 5000 },
      { name: 'tradein', label: 'Trade-In Value', type: 'currency', defaultValue: 2000 },
      { name: 'rate', label: 'Interest Rate', type: 'percent', defaultValue: 6.0 },
      { name: 'months', label: 'Term (Months)', type: 'number', defaultValue: 60, min: 12, max: 84, step: 12 }
    ],
    calculate: (v) => {
      const loanAmount = Math.max(0, v.price - v.down - v.tradein);
      const r = v.rate / 100 / 12;
      const n = v.months;
      let monthly = 0;
      
      if (loanAmount > 0) {
        monthly = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
      const totalInterest = (monthly * n) - loanAmount;

      return {
        result: formatCurrency(monthly) + ' / month',
        details: [
          `Loan Amount: ${formatCurrency(loanAmount)}`,
          `Total Cost: ${formatCurrency(monthly * n + v.down + v.tradein)}`
        ],
        chart: {
            type: 'donut',
            title: 'Cost Breakdown',
            data: [
                { label: 'Principal', value: loanAmount, color: '#3b82f6' },
                { label: 'Interest', value: totalInterest, color: '#f43f5e' },
                { label: 'Down/Trade', value: v.down + v.tradein, color: '#10b981' }
            ]
        },
        stats: [
            { label: 'Monthly Payment', value: formatCurrency(monthly) },
            { label: 'Loan Amount', value: formatCurrency(loanAmount) },
            { label: 'Total Interest', value: formatCurrency(totalInterest) }
        ]
      };
    }
  },
  'mortgage': {
    id: 'mortgage',
    title: 'Mortgage Calculator',
    description: 'Estimate monthly mortgage payments, including tax and insurance.',
    category: 'Loans',
    icon: Home,
    inputs: [
      { name: 'price', label: 'Home Price', type: 'currency', defaultValue: 300000, min: 50000, step: 5000 },
      { name: 'down', label: 'Down Payment', type: 'currency', defaultValue: 60000, min: 0, step: 1000 },
      { name: 'rate', label: 'Interest Rate', type: 'percent', defaultValue: 6.5, step: 0.1 },
      { name: 'years', label: 'Loan Term', type: 'years', defaultValue: 30, min: 10, max: 40, step: 5 },
      { name: 'tax', label: 'Annual Property Tax', type: 'currency', defaultValue: 3500 },
      { name: 'insurance', label: 'Annual Insurance', type: 'currency', defaultValue: 1200 }
    ],
    calculate: (v) => {
      const principal = v.price - v.down;
      const r = v.rate / 100 / 12;
      const n = v.years * 12;
      const pi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const monthlyTax = v.tax / 12;
      const monthlyIns = v.insurance / 12;
      const totalMonthly = pi + monthlyTax + monthlyIns;

      return {
        result: formatCurrency(totalMonthly) + ' / month',
        details: [
          `P&I: ${formatCurrency(pi)}`,
          `Taxes: ${formatCurrency(monthlyTax)}`,
          `Insurance: ${formatCurrency(monthlyIns)}`
        ],
        chart: {
            type: 'donut',
            title: 'Monthly Payment',
            data: [
                { label: 'Principal & Interest', value: pi, color: '#3b82f6' },
                { label: 'Property Tax', value: monthlyTax, color: '#f59e0b' },
                { label: 'Insurance', value: monthlyIns, color: '#10b981' }
            ]
        },
        stats: [
            { label: 'Monthly Payment', value: formatCurrency(totalMonthly) },
            { label: 'Loan Amount', value: formatCurrency(principal) },
            { label: 'Total Interest', value: formatCurrency((pi * n) - principal) }
        ]
      };
    }
  },
  'debt-to-income': {
    id: 'debt-to-income',
    title: 'Debt-to-Income Ratio (DTI)',
    description: 'Calculate your DTI to see if you qualify for loans.',
    category: 'Loans',
    icon: Activity,
    inputs: [
      { name: 'income', label: 'Monthly Gross Income', type: 'currency', defaultValue: 5000 },
      { name: 'mortgage', label: 'Rent / Mortgage', type: 'currency', defaultValue: 1200 },
      { name: 'cards', label: 'Credit Card Minimums', type: 'currency', defaultValue: 150 },
      { name: 'loans', label: 'Student/Car Loans', type: 'currency', defaultValue: 350 },
      { name: 'other', label: 'Other Debt', type: 'currency', defaultValue: 0 }
    ],
    calculate: (v) => {
      const totalDebt = v.mortgage + v.cards + v.loans + v.other;
      const dti = (totalDebt / v.income) * 100;
      
      return {
        result: formatPercent(dti),
        details: [
          `Total Debt: ${formatCurrency(totalDebt)}`,
          `Monthly Income: ${formatCurrency(v.income)}`
        ],
        chart: {
            type: 'bar',
            title: 'DTI Ratio Analysis',
            data: [
                { label: 'Your DTI', value: dti, color: dti < 36 ? '#10b981' : dti < 43 ? '#f59e0b' : '#ef4444' },
                { label: 'Healthy Limit', value: 36, color: '#3b82f6' },
                { label: 'Max (Qualified)', value: 43, color: '#94a3b8' }
            ]
        },
        stats: [
            { label: 'DTI Ratio', value: formatPercent(dti), subtext: dti < 36 ? 'Excellent' : dti < 43 ? 'Manageable' : 'High Risk' },
            { label: 'Total Monthly Debt', value: formatCurrency(totalDebt) },
            { label: 'Remaining Income', value: formatCurrency(v.income - totalDebt) }
        ]
      };
    }
  },
  'refinance': {
      id: 'refinance',
      title: 'Mortgage Refinance',
      description: 'Check if refinancing will save you money.',
      category: 'Loans',
      icon: Home,
      inputs: [
        { name: 'currentPayment', label: 'Current Monthly P&I', type: 'currency', defaultValue: 1800 },
        { name: 'newAmount', label: 'New Loan Amount', type: 'currency', defaultValue: 250000 },
        { name: 'newRate', label: 'New Interest Rate', type: 'percent', defaultValue: 5.5 },
        { name: 'newTerm', label: 'New Term (Years)', type: 'years', defaultValue: 30 },
        { name: 'costs', label: 'Closing Costs', type: 'currency', defaultValue: 4000 }
      ],
      calculate: (v) => {
          const r = v.newRate / 100 / 12;
          const n = v.newTerm * 12;
          const newPayment = (v.newAmount * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
          const monthlySavings = v.currentPayment - newPayment;
          const breakEvenMonths = monthlySavings > 0 ? v.costs / monthlySavings : 0;
          
          return {
              result: monthlySavings > 0 ? `Save ${formatCurrency(monthlySavings)}/mo` : `Cost ${formatCurrency(Math.abs(monthlySavings))}/mo`,
              details: [
                  `New Payment: ${formatCurrency(newPayment)}`,
                  `Break-even: ${breakEvenMonths.toFixed(1)} months`
              ],
              chart: {
                  type: 'bar',
                  title: 'Monthly Cost Comparison',
                  data: [
                      { label: 'Current', value: v.currentPayment, color: '#94a3b8' },
                      { label: 'New', value: newPayment, color: '#10b981' }
                  ]
              },
              stats: [
                  { label: 'Monthly Savings', value: formatCurrency(monthlySavings) },
                  { label: 'Break-Even Point', value: monthlySavings > 0 ? `${breakEvenMonths.toFixed(1)} Months` : 'N/A' },
                  { label: 'Annual Savings', value: formatCurrency(monthlySavings * 12) }
              ]
          };
      }
  },
  'credit-card-payoff': {
      id: 'credit-card-payoff',
      title: 'Credit Card Payoff',
      description: 'Find out how long it will take to pay off debt.',
      category: 'Loans',
      icon: CreditCard,
      inputs: [
          { name: 'balance', label: 'Card Balance', type: 'currency', defaultValue: 5000 },
          { name: 'rate', label: 'Interest Rate', type: 'percent', defaultValue: 18.9 },
          { name: 'payment', label: 'Monthly Payment', type: 'currency', defaultValue: 150 }
      ],
      calculate: (v) => {
          const r = v.rate / 100 / 12;
          if(v.payment <= v.balance * r) {
              return { 
                  result: 'Never Pay Off', 
                  details: ['Payment too low to cover interest.'], 
                  chart: { type: 'bar', data: [{label: 'Interest', value: v.balance * r, color: '#ef4444'}] },
                  stats: [{ label: 'Warning', value: 'Increase Payment', subtext: `Min interest: ${formatCurrency(v.balance * r)}` }]
              };
          }
          const n = -Math.log(1 - (r * v.balance) / v.payment) / Math.log(1 + r);
          const totalPaid = n * v.payment;
          const totalInt = totalPaid - v.balance;
          
          return {
              result: `${Math.ceil(n)} Months`,
              details: [`Total Interest: ${formatCurrency(totalInt)}`],
              chart: {
                  type: 'donut',
                  title: 'Total Payoff Cost',
                  data: [
                      { label: 'Principal', value: v.balance, color: '#3b82f6' },
                      { label: 'Interest', value: totalInt, color: '#ef4444' }
                  ]
              },
              stats: [
                  { label: 'Time to Payoff', value: `${(n/12).toFixed(1)} Years` },
                  { label: 'Total Interest', value: formatCurrency(totalInt) },
                  { label: 'Total Paid', value: formatCurrency(totalPaid) }
              ]
          };
      }
  },
  'debt-snowball': {
    id: 'debt-snowball',
    title: 'Debt Snowball',
    description: 'Calculate payoff for multiple debts using the snowball method.',
    category: 'Loans',
    icon: Coins,
    inputs: [
      { name: 'debt1', label: 'Debt 1 (Smallest)', type: 'currency', defaultValue: 2000 },
      { name: 'pay1', label: 'Debt 1 Payment', type: 'currency', defaultValue: 100 },
      { name: 'debt2', label: 'Debt 2', type: 'currency', defaultValue: 5000 },
      { name: 'pay2', label: 'Debt 2 Payment', type: 'currency', defaultValue: 150 },
      { name: 'extra', label: 'Extra Money', type: 'currency', defaultValue: 200 }
    ],
    calculate: (v) => {
       const totalDebt = v.debt1 + v.debt2;
       const monthly = v.pay1 + v.pay2 + v.extra;
       const months = totalDebt / monthly; // Simplified calc without interest for multi-debt demo
       return {
         result: `${Math.ceil(months)} Months`,
         details: [`Total Debt: ${formatCurrency(totalDebt)}`, `Total Speedup: ${formatCurrency(v.extra)}/mo extra`],
         chart: { type: 'bar', data: [{label: 'Snowball Payment', value: monthly, color: '#10b981'}, {label: 'Min Payments', value: v.pay1+v.pay2, color: '#94a3b8'}]},
         stats: [{label: 'Freedom Date', value: `In ${(months/12).toFixed(1)} Yrs`}, {label: 'Monthly Attack', value: formatCurrency(monthly)}]
       }
    }
  },
  'home-equity': {
    id: 'home-equity',
    title: 'Home Equity',
    description: 'Calculate how much equity you have in your home.',
    category: 'Loans',
    icon: Home,
    inputs: [
      { name: 'value', label: 'Home Value', type: 'currency', defaultValue: 450000 },
      { name: 'mortgage', label: 'Mortgage Balance', type: 'currency', defaultValue: 320000 },
      { name: 'liens', label: 'Other Liens', type: 'currency', defaultValue: 0 }
    ],
    calculate: (v) => {
      const equity = v.value - v.mortgage - v.liens;
      const ltv = ((v.mortgage + v.liens) / v.value) * 100;
      return {
        result: formatCurrency(equity),
        details: [`LTV Ratio: ${ltv.toFixed(1)}%`],
        chart: { type: 'donut', data: [{label: 'Equity', value: equity, color: '#10b981'}, {label: 'Debt', value: v.mortgage+v.liens, color: '#ef4444'}] },
        stats: [{label: 'Equity Value', value: formatCurrency(equity)}, {label: 'Loan-to-Value', value: ltv.toFixed(1)+'%'}]
      }
    }
  },
  'house-affordability': {
    id: 'house-affordability',
    title: 'House Affordability',
    description: 'How much house can you afford?',
    category: 'Loans',
    icon: Home,
    inputs: [
      { name: 'income', label: 'Annual Income', type: 'currency', defaultValue: 80000 },
      { name: 'down', label: 'Down Payment', type: 'currency', defaultValue: 40000 },
      { name: 'debt', label: 'Monthly Debts', type: 'currency', defaultValue: 500 }
    ],
    calculate: (v) => {
       const monthlyIncome = v.income / 12;
       const maxPayment = (monthlyIncome * 0.28) - v.debt; 
       // Reverse calc P&I approx for 30yr fixed @ 6.5%
       const r = 0.065/12; const n=360;
       const loanAmount = maxPayment * ((Math.pow(1+r,n)-1)/(r*Math.pow(1+r,n)));
       const price = loanAmount + v.down;
       return {
         result: formatCurrency(price),
         details: [`Max Monthly Payment: ${formatCurrency(maxPayment)}`],
         chart: { type: 'bar', data: [{label: 'Loan', value: loanAmount, color: '#3b82f6'}, {label: 'Down Payment', value: v.down, color: '#10b981'}] },
         stats: [{label: 'Max Home Price', value: formatCurrency(price)}, {label: 'Loan Amount', value: formatCurrency(loanAmount)}]
       }
    }
  },


  // ==========================================
  // INVESTMENT
  // ==========================================
  'compound-interest': {
    id: 'compound-interest',
    title: 'Compound Interest',
    description: 'Visualize how your money grows with compound interest over time.',
    category: 'Investments',
    icon: TrendingUp,
    inputs: [
      { name: 'principal', label: 'Initial Deposit', type: 'currency', defaultValue: 5000 },
      { name: 'monthly', label: 'Monthly Contribution', type: 'currency', defaultValue: 200 },
      { name: 'rate', label: 'Annual Interest Rate', type: 'percent', defaultValue: 7, step: 0.1 },
      { name: 'years', label: 'Years to Grow', type: 'years', defaultValue: 20, max: 50 }
    ],
    calculate: (v) => {
      const r = v.rate / 100 / 12;
      const n = v.years * 12;
      
      const fvLump = v.principal * Math.pow(1 + r, n);
      const fvSeries = v.monthly * ((Math.pow(1 + r, n) - 1) / r);
      const total = fvLump + fvSeries;
      const totalPrincipal = v.principal + (v.monthly * n);
      const totalInterest = total - totalPrincipal;

      const dataPoints = [];
      const principalPoints = [];
      let currentBal = v.principal;
      let currentPrincipal = v.principal;

      for (let i = 0; i <= v.years; i++) {
        dataPoints.push(Math.round(currentBal));
        principalPoints.push(Math.round(currentPrincipal));
        if(i < v.years) {
            for(let m=0; m<12; m++) {
                currentBal = (currentBal + v.monthly) * (1 + r);
                currentPrincipal += v.monthly;
            }
        }
      }

      return {
        result: formatCurrency(total),
        details: [
          `Principal Invested: ${formatCurrency(totalPrincipal)}`,
          `Interest Earned: ${formatCurrency(totalInterest)}`
        ],
        chart: {
            type: 'line',
            title: 'Growth Over Time',
            series: [
                { label: 'Total Balance', data: dataPoints, color: '#10b981' }, 
                { label: 'Principal', data: principalPoints, color: '#94a3b8' } 
            ]
        },
        stats: [
            { label: 'Future Value', value: formatCurrency(total) },
            { label: 'Total Interest', value: formatCurrency(totalInterest), icon: TrendingUp },
            { label: 'Total Contributions', value: formatCurrency(totalPrincipal) }
        ]
      };
    }
  },
  'roi': {
      id: 'roi',
      title: 'Return on Investment (ROI)',
      description: 'Calculate the percentage return on an investment.',
      category: 'Investments',
      icon: Percent,
      inputs: [
          { name: 'invested', label: 'Amount Invested', type: 'currency', defaultValue: 1000 },
          { name: 'returned', label: 'Amount Returned', type: 'currency', defaultValue: 1500 },
          { name: 'time', label: 'Time Period (Years)', type: 'years', defaultValue: 1 }
      ],
      calculate: (v) => {
          const profit = v.returned - v.invested;
          const roi = (profit / v.invested) * 100;
          const annualized = v.time > 0 ? (Math.pow(v.returned / v.invested, 1/v.time) - 1) * 100 : 0;
          
          return {
              result: formatPercent(roi),
              details: [`Profit: ${formatCurrency(profit)}`],
              chart: {
                  type: 'bar',
                  title: 'Investment Performance',
                  data: [
                      { label: 'Invested', value: v.invested, color: '#94a3b8' },
                      { label: 'Returned', value: v.returned, color: '#10b981' }
                  ]
              },
              stats: [
                  { label: 'Total ROI', value: formatPercent(roi) },
                  { label: 'Annualized ROI', value: formatPercent(annualized) },
                  { label: 'Net Profit', value: formatCurrency(profit) }
              ]
          };
      }
  },
  'investment-growth': {
      id: 'investment-growth',
      title: 'Investment Growth',
      description: 'Project the future value of your portfolio.',
      category: 'Investments',
      icon: TrendingUp,
      inputs: [
          { name: 'initial', label: 'Starting Balance', type: 'currency', defaultValue: 10000 },
          { name: 'years', label: 'Years', type: 'years', defaultValue: 10 },
          { name: 'rate', label: 'Annual Return', type: 'percent', defaultValue: 8 }
      ],
      calculate: (v) => {
          const final = v.initial * Math.pow(1 + v.rate/100, v.years);
          const growth = final - v.initial;
          const seriesData = [];
          for(let i=0; i<=v.years; i++) {
              seriesData.push(Math.round(v.initial * Math.pow(1 + v.rate/100, i)));
          }

          return {
              result: formatCurrency(final),
              details: [`Total Growth: ${formatCurrency(growth)}`],
              chart: {
                  type: 'line',
                  title: 'Portfolio Growth',
                  series: [{ label: 'Value', data: seriesData, color: '#8b5cf6' }]
              },
              stats: [
                  { label: 'Final Value', value: formatCurrency(final) },
                  { label: 'Total Gain', value: formatCurrency(growth) },
                  { label: 'Multiplier', value: `${(final/v.initial).toFixed(2)}x` }
              ]
          };
      }
  },
  'dividend': {
    id: 'dividend',
    title: 'Dividend Yield',
    description: 'Calculate dividend yield and payout.',
    category: 'Investments',
    icon: TrendingUp,
    inputs: [
      { name: 'price', label: 'Share Price', type: 'currency', defaultValue: 150 },
      { name: 'dividend', label: 'Annual Dividend', type: 'currency', defaultValue: 5 },
      { name: 'shares', label: 'Shares Owned', type: 'number', defaultValue: 100 }
    ],
    calculate: (v) => {
      const yieldPct = (v.dividend / v.price) * 100;
      const annualIncome = v.dividend * v.shares;
      return {
        result: formatPercent(yieldPct),
        details: [`Annual Income: ${formatCurrency(annualIncome)}`],
        chart: { type: 'bar', data: [{label: 'Share Price', value: v.price, color: '#94a3b8'}, {label: 'Dividend', value: v.dividend, color: '#10b981'}] },
        stats: [{label: 'Dividend Yield', value: formatPercent(yieldPct)}, {label: 'Annual Payout', value: formatCurrency(annualIncome)}]
      }
    }
  },
  'stock-profit': {
    id: 'stock-profit',
    title: 'Stock Profit Calculator',
    description: 'Calculate your profit or loss from a stock trade.',
    category: 'Investments',
    icon: TrendingUp,
    inputs: [
      { name: 'shares', label: 'Number of Shares', type: 'number', defaultValue: 50 },
      { name: 'buy', label: 'Buy Price', type: 'currency', defaultValue: 100 },
      { name: 'sell', label: 'Sell Price', type: 'currency', defaultValue: 120 },
      { name: 'comm', label: 'Commission', type: 'currency', defaultValue: 5 }
    ],
    calculate: (v) => {
      const cost = v.shares * v.buy;
      const revenue = v.shares * v.sell;
      const profit = revenue - cost - v.comm;
      return {
        result: formatCurrency(profit),
        details: [`ROI: ${((profit/cost)*100).toFixed(2)}%`],
        chart: { type: 'bar', data: [{label: 'Cost', value: cost, color: '#ef4444'}, {label: 'Revenue', value: revenue, color: '#10b981'}] },
        stats: [{label: 'Net Profit', value: formatCurrency(profit)}, {label: 'Total Revenue', value: formatCurrency(revenue)}]
      }
    }
  },
  'irr': {
    id: 'irr',
    title: 'Internal Rate of Return',
    description: 'Simplified IRR for a single payout investment.',
    category: 'Investments',
    icon: Percent,
    inputs: [
      { name: 'initial', label: 'Initial Investment', type: 'currency', defaultValue: 10000 },
      { name: 'final', label: 'Final Value', type: 'currency', defaultValue: 15000 },
      { name: 'years', label: 'Years Held', type: 'years', defaultValue: 5 }
    ],
    calculate: (v) => {
      const irr = (Math.pow(v.final / v.initial, 1/v.years) - 1) * 100;
      return {
        result: formatPercent(irr),
        details: [`Total Profit: ${formatCurrency(v.final - v.initial)}`],
        chart: { type: 'bar', data: [{label: 'Initial', value: v.initial, color: '#94a3b8'}, {label: 'Final', value: v.final, color: '#10b981'}] },
        stats: [{label: 'Annual IRR', value: formatPercent(irr)}, {label: 'Total Gain', value: formatCurrency(v.final - v.initial)}]
      }
    }
  },
  'risk-reward': {
    id: 'risk-reward',
    title: 'Risk/Reward Ratio',
    description: 'Calculate potential risk vs reward for a trade.',
    category: 'Investments',
    icon: Activity,
    inputs: [
      { name: 'entry', label: 'Entry Price', type: 'currency', defaultValue: 100 },
      { name: 'stop', label: 'Stop Loss', type: 'currency', defaultValue: 90 },
      { name: 'target', label: 'Target Price', type: 'currency', defaultValue: 130 }
    ],
    calculate: (v) => {
      const risk = v.entry - v.stop;
      const reward = v.target - v.entry;
      const ratio = reward / risk;
      return {
        result: `1 : ${ratio.toFixed(2)}`,
        details: [`Risk: ${formatCurrency(risk)}`, `Reward: ${formatCurrency(reward)}`],
        chart: { type: 'bar', data: [{label: 'Risk', value: risk, color: '#ef4444'}, {label: 'Reward', value: reward, color: '#10b981'}] },
        stats: [{label: 'Ratio', value: `1:${ratio.toFixed(2)}`}, {label: 'Upside', value: formatPercent((reward/v.entry)*100)}]
      }
    }
  },
  'cagr': {
      id: 'cagr',
      title: 'CAGR Calculator',
      description: 'Compound Annual Growth Rate.',
      category: 'Investments',
      icon: Activity,
      inputs: [
          { name: 'start', label: 'Start Value', type: 'currency', defaultValue: 1000 },
          { name: 'end', label: 'End Value', type: 'currency', defaultValue: 2500 },
          { name: 'years', label: 'Number of Years', type: 'years', defaultValue: 5 }
      ],
      calculate: (v) => {
          const cagr = (Math.pow(v.end / v.start, 1/v.years) - 1) * 100;
          return {
              result: formatPercent(cagr),
              details: [`Absolute Growth: ${((v.end - v.start)/v.start * 100).toFixed(2)}%`],
              chart: {
                  type: 'bar',
                  title: 'Value Change',
                  data: [
                      { label: 'Start', value: v.start, color: '#94a3b8' },
                      { label: 'End', value: v.end, color: '#3b82f6' }
                  ]
              },
              stats: [
                  { label: 'Annual Growth Rate', value: formatPercent(cagr) },
                  { label: 'Total Profit', value: formatCurrency(v.end - v.start) }
              ]
          };
      }
  },
  'dollar-cost-averaging': {
      id: 'dollar-cost-averaging',
      title: 'DCA Calculator',
      description: 'Average cost per share over multiple buys.',
      category: 'Investments',
      icon: TrendingUp,
      inputs: [
          { name: 'shares1', label: 'Buy 1 Shares', type: 'number', defaultValue: 10 },
          { name: 'price1', label: 'Buy 1 Price', type: 'currency', defaultValue: 50 },
          { name: 'shares2', label: 'Buy 2 Shares', type: 'number', defaultValue: 15 },
          { name: 'price2', label: 'Buy 2 Price', type: 'currency', defaultValue: 45 },
          { name: 'shares3', label: 'Buy 3 Shares', type: 'number', defaultValue: 0 },
          { name: 'price3', label: 'Buy 3 Price', type: 'currency', defaultValue: 0 }
      ],
      calculate: (v) => {
          const totalShares = v.shares1 + v.shares2 + v.shares3;
          const totalCost = (v.shares1 * v.price1) + (v.shares2 * v.price2) + (v.shares3 * v.price3);
          if(totalShares === 0) return { result: '$0.00', details: [], stats: [] };
          const avg = totalCost / totalShares;
          return {
              result: `${formatCurrency(avg)} / share`,
              details: [`Total Shares: ${totalShares}`],
              chart: {
                  type: 'donut',
                  title: 'Investment Distribution',
                  data: [
                      { label: 'Buy 1', value: v.shares1 * v.price1, color: '#60a5fa' },
                      { label: 'Buy 2', value: v.shares2 * v.price2, color: '#34d399' },
                      { label: 'Buy 3', value: v.shares3 * v.price3, color: '#f472b6' }
                  ].filter(d => d.value > 0)
              },
              stats: [
                  { label: 'Average Cost', value: formatCurrency(avg) },
                  { label: 'Total Invested', value: formatCurrency(totalCost) }
              ]
          };
      }
  },

  // ==========================================
  // RETIREMENT
  // ==========================================
  'monthly-budget': {
    id: 'monthly-budget',
    title: 'Simple Monthly Budget',
    description: 'Compare income vs expenses.',
    category: 'Retirement',
    icon: PieChart,
    inputs: [
      { name: 'income', label: 'Monthly Income (Net)', type: 'currency', defaultValue: 4000 },
      { name: 'needs', label: 'Needs (Rent, Food)', type: 'currency', defaultValue: 2000 },
      { name: 'wants', label: 'Wants (Fun, Shop)', type: 'currency', defaultValue: 1000 },
      { name: 'savings', label: 'Savings/Debt', type: 'currency', defaultValue: 500 }
    ],
    calculate: (v) => {
      const totalExp = v.needs + v.wants + v.savings;
      const remaining = v.income - totalExp;
      
      return {
        result: remaining >= 0 ? `${formatCurrency(remaining)} Surplus` : `${formatCurrency(remaining)} Deficit`,
        details: [
          `Total Expenses: ${formatCurrency(totalExp)}`
        ],
        chart: {
            type: 'donut',
            title: 'Budget Allocation',
            data: [
                { label: 'Needs', value: v.needs, color: '#f59e0b' },
                { label: 'Wants', value: v.wants, color: '#ec4899' },
                { label: 'Savings', value: v.savings, color: '#10b981' },
                { label: 'Remaining', value: Math.max(0, remaining), color: '#cbd5e1' }
            ]
        },
        stats: [
            { label: 'Needs %', value: ((v.needs/v.income)*100).toFixed(0)+'%', subtext: 'Target: 50%' },
            { label: 'Wants %', value: ((v.wants/v.income)*100).toFixed(0)+'%', subtext: 'Target: 30%' },
            { label: 'Savings %', value: ((v.savings/v.income)*100).toFixed(0)+'%', subtext: 'Target: 20%' }
        ]
      };
    }
  },
  'retirement-savings': {
    id: 'retirement-savings',
    title: 'Retirement Planner',
    description: 'Estimate savings needed for retirement.',
    category: 'Retirement',
    icon: Landmark,
    inputs: [
      { name: 'currentAge', label: 'Current Age', type: 'years', defaultValue: 30, max: 80 },
      { name: 'retireAge', label: 'Retirement Age', type: 'years', defaultValue: 65, max: 90 },
      { name: 'savings', label: 'Current Savings', type: 'currency', defaultValue: 50000 },
      { name: 'monthly', label: 'Monthly Saving', type: 'currency', defaultValue: 1000 },
      { name: 'rate', label: 'Annual Return', type: 'percent', defaultValue: 7 }
    ],
    calculate: (v) => {
      const years = Math.max(1, v.retireAge - v.currentAge);
      const r = v.rate / 100 / 12;
      const n = years * 12;
      
      const fv = v.savings * Math.pow(1 + r, n) + (v.monthly * (Math.pow(1 + r, n) - 1) / r);
      const monthlyIncome = (fv * 0.04) / 12;

      const balancePoints = [];
      let bal = v.savings;
      for(let i=0; i<=years; i+=5) { 
          balancePoints.push(Math.round(bal));
          for(let m=0; m<60; m++) {
               if((i*12 + m) < n) bal = (bal + v.monthly) * (1+r);
          }
      }
      balancePoints[balancePoints.length-1] = Math.round(fv);

      return {
        result: formatCurrency(fv),
        details: [
          `Safe Monthly Income (4% Rule): ${formatCurrency(monthlyIncome)}`
        ],
        chart: {
            type: 'line',
            title: 'Retirement Nest Egg',
            series: [{ label: 'Savings Balance', data: balancePoints, color: '#3b82f6' }]
        },
        stats: [
            { label: 'Target Age', value: v.retireAge.toString() },
            { label: 'Monthly Income', value: formatCurrency(monthlyIncome) },
            { label: 'Total Savings', value: formatCurrency(fv) }
        ]
      };
    }
  },
  'fire-calculator': {
      id: 'fire-calculator',
      title: 'FIRE Calculator',
      description: 'Financial Independence, Retire Early.',
      category: 'Retirement',
      icon: Shield,
      inputs: [
          { name: 'expenses', label: 'Annual Expenses', type: 'currency', defaultValue: 40000 },
          { name: 'savings', label: 'Current Portfolio', type: 'currency', defaultValue: 100000 },
          { name: 'contribution', label: 'Annual Savings', type: 'currency', defaultValue: 25000 },
          { name: 'rate', label: 'Return Rate', type: 'percent', defaultValue: 7 },
          { name: 'withdrawal', label: 'Withdrawal Rate', type: 'percent', defaultValue: 4 }
      ],
      calculate: (v) => {
          const target = v.expenses / (v.withdrawal / 100);
          let current = v.savings;
          let years = 0;
          while(current < target && years < 100) {
              current = current * (1 + v.rate/100) + v.contribution;
              years++;
          }
          
          return {
              result: `${years} Years`,
              details: [`FIRE Number: ${formatCurrency(target)}`],
              chart: {
                  type: 'bar',
                  title: 'Progress to FIRE',
                  data: [
                      { label: 'Current', value: v.savings, color: '#10b981' },
                      { label: 'Target', value: target, color: '#3b82f6' }
                  ]
              },
              stats: [
                  { label: 'FIRE Target', value: formatCurrency(target) },
                  { label: 'Years to Go', value: years.toString() },
                  { label: 'Retirement Age', value: `In ${years} yrs` }
              ]
          };
      }
  },
  'net-worth': {
    id: 'net-worth',
    title: 'Net Worth Calculator',
    description: 'Calculate your total net worth.',
    category: 'Retirement',
    icon: Wallet,
    inputs: [
      { name: 'realestate', label: 'Real Estate Value', type: 'currency', defaultValue: 300000 },
      { name: 'investments', label: 'Investments', type: 'currency', defaultValue: 50000 },
      { name: 'cash', label: 'Cash/Savings', type: 'currency', defaultValue: 10000 },
      { name: 'mortgage', label: 'Mortgage Debt', type: 'currency', defaultValue: 200000 },
      { name: 'loans', label: 'Other Loans', type: 'currency', defaultValue: 15000 }
    ],
    calculate: (v) => {
      const assets = v.realestate + v.investments + v.cash;
      const liab = v.mortgage + v.loans;
      
      return {
        result: formatCurrency(assets - liab),
        details: [
          `Total Assets: ${formatCurrency(assets)}`,
          `Total Liabilities: ${formatCurrency(liab)}`
        ],
        chart: {
            type: 'bar',
            title: 'Assets vs Liabilities',
            data: [
                { label: 'Assets', value: assets, color: '#10b981' },
                { label: 'Liabilities', value: liab, color: '#f43f5e' }
            ]
        },
        stats: [
            { label: 'Net Worth', value: formatCurrency(assets - liab) },
            { label: 'Debt Ratio', value: ((liab/assets)*100).toFixed(1) + '%' }
        ]
      };
    }
  },
  '401k': {
    id: '401k',
    title: '401(k) Planner',
    description: 'Estimate 401(k) growth with employer match.',
    category: 'Retirement',
    icon: Landmark,
    inputs: [
      { name: 'salary', label: 'Annual Salary', type: 'currency', defaultValue: 75000 },
      { name: 'contrib', label: 'Contribution %', type: 'percent', defaultValue: 6 },
      { name: 'match', label: 'Employer Match %', type: 'percent', defaultValue: 3 },
      { name: 'rate', label: 'Annual Return', type: 'percent', defaultValue: 7 },
      { name: 'years', label: 'Years to Grow', type: 'years', defaultValue: 30 }
    ],
    calculate: (v) => {
      const myContrib = v.salary * (v.contrib/100);
      const bossContrib = v.salary * (v.match/100);
      const totalAnnual = myContrib + bossContrib;
      const fv = totalAnnual * ((Math.pow(1 + v.rate/100, v.years) - 1) / (v.rate/100));
      return {
        result: formatCurrency(fv),
        details: [`Your Contrib: ${formatCurrency(myContrib)}/yr`, `Match: ${formatCurrency(bossContrib)}/yr`],
        chart: { type: 'line', series: [{label: 'Balance', data: [0, fv/2, fv], color: '#10b981'}] },
        stats: [{label: 'Total Balance', value: formatCurrency(fv)}, {label: 'Annual Saving', value: formatCurrency(totalAnnual)}]
      }
    }
  },
  'pension': {
    id: 'pension',
    title: 'Pension Estimator',
    description: 'Estimate defined benefit pension payout.',
    category: 'Retirement',
    icon: Shield,
    inputs: [
      { name: 'years', label: 'Years of Service', type: 'years', defaultValue: 25 },
      { name: 'salary', label: 'High Avg Salary', type: 'currency', defaultValue: 80000 },
      { name: 'multiplier', label: 'Multiplier %', type: 'percent', defaultValue: 2.0 }
    ],
    calculate: (v) => {
      const annual = v.years * v.salary * (v.multiplier/100);
      const monthly = annual / 12;
      return {
        result: formatCurrency(monthly) + ' / mo',
        details: [`Annual Pension: ${formatCurrency(annual)}`],
        chart: { type: 'bar', data: [{label: 'Salary', value: v.salary, color: '#94a3b8'}, {label: 'Pension', value: annual, color: '#10b981'}] },
        stats: [{label: 'Replacement Rate', value: formatPercent(v.years * v.multiplier)}, {label: 'Monthly Benefit', value: formatCurrency(monthly)}]
      }
    }
  },
  'emergency-fund': {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    description: 'Calculate how much cash you need for emergencies.',
    category: 'Retirement',
    icon: Wallet,
    inputs: [
      { name: 'expenses', label: 'Monthly Expenses', type: 'currency', defaultValue: 3000 },
      { name: 'months', label: 'Months Coverage', type: 'number', defaultValue: 6 }
    ],
    calculate: (v) => {
      const total = v.expenses * v.months;
      return {
        result: formatCurrency(total),
        details: [`Based on ${v.months} months of expenses.`],
        chart: { type: 'bar', data: [{label: '1 Month', value: v.expenses, color: '#94a3b8'}, {label: 'Target', value: total, color: '#10b981'}] },
        stats: [{label: 'Target Fund', value: formatCurrency(total)}, {label: 'Monthly Burn', value: formatCurrency(v.expenses)}]
      }
    }
  },
  'savings-goal': {
    id: 'savings-goal',
    title: 'Savings Goal',
    description: 'How much to save monthly to reach a goal?',
    category: 'Retirement',
    icon: Coins,
    inputs: [
      { name: 'goal', label: 'Goal Amount', type: 'currency', defaultValue: 10000 },
      { name: 'months', label: 'Time (Months)', type: 'number', defaultValue: 12 },
      { name: 'current', label: 'Current Savings', type: 'currency', defaultValue: 0 }
    ],
    calculate: (v) => {
      const needed = v.goal - v.current;
      const monthly = needed > 0 ? needed / v.months : 0;
      return {
        result: formatCurrency(monthly) + ' / month',
        details: [`Total to Save: ${formatCurrency(needed)}`],
        chart: { type: 'donut', data: [{label: 'Have', value: v.current, color: '#10b981'}, {label: 'Need', value: needed, color: '#ef4444'}] },
        stats: [{label: 'Monthly Target', value: formatCurrency(monthly)}, {label: 'Total Goal', value: formatCurrency(v.goal)}]
      }
    }
  },

  // ==========================================
  // BUSINESS & TAX
  // ==========================================
  'profit-margin': {
      id: 'profit-margin',
      title: 'Profit Margin Calculator',
      description: 'Calculate Gross and Net Profit Margins.',
      category: 'Business',
      icon: Briefcase,
      inputs: [
          { name: 'cost', label: 'Cost of Goods', type: 'currency', defaultValue: 50 },
          { name: 'price', label: 'Selling Price', type: 'currency', defaultValue: 100 }
      ],
      calculate: (v) => {
          const profit = v.price - v.cost;
          const margin = (profit / v.price) * 100;
          const markup = (profit / v.cost) * 100;
          return {
              result: `${margin.toFixed(2)}% Margin`,
              details: [`Profit: ${formatCurrency(profit)}`],
              chart: {
                  type: 'donut',
                  title: 'Price Composition',
                  data: [
                      { label: 'Cost', value: v.cost, color: '#ef4444' },
                      { label: 'Profit', value: profit, color: '#10b981' }
                  ]
              },
              stats: [
                  { label: 'Gross Margin', value: formatPercent(margin) },
                  { label: 'Markup', value: formatPercent(markup) },
                  { label: 'Profit', value: formatCurrency(profit) }
              ]
          };
      }
  },
  'break-even': {
      id: 'break-even',
      title: 'Break-Even Analysis',
      description: 'Determine units to sell to cover costs.',
      category: 'Business',
      icon: Activity,
      inputs: [
          { name: 'fixed', label: 'Fixed Costs', type: 'currency', defaultValue: 10000 },
          { name: 'price', label: 'Price per Unit', type: 'currency', defaultValue: 50 },
          { name: 'variable', label: 'Variable Cost/Unit', type: 'currency', defaultValue: 20 }
      ],
      calculate: (v) => {
          const contribution = v.price - v.variable;
          const units = Math.ceil(v.fixed / contribution);
          const revenue = units * v.price;
          
          return {
              result: `${units} Units`,
              details: [`Revenue Needed: ${formatCurrency(revenue)}`],
              chart: {
                  type: 'bar',
                  title: 'Revenue vs Cost at Break-Even',
                  data: [
                      { label: 'Revenue', value: revenue, color: '#10b981' },
                      { label: 'Total Cost', value: v.fixed + (units*v.variable), color: '#ef4444' }
                  ]
              },
              stats: [
                  { label: 'Break-Even Units', value: units.toString() },
                  { label: 'Break-Even Sales', value: formatCurrency(revenue) },
                  { label: 'Contribution', value: formatCurrency(contribution) }
              ]
          };
      }
  },
  'sales-tax': {
      id: 'sales-tax',
      title: 'Sales Tax Calculator',
      description: 'Calculate final price with tax.',
      category: 'Business',
      icon: Coins,
      inputs: [
          { name: 'amount', label: 'Pre-Tax Amount', type: 'currency', defaultValue: 100 },
          { name: 'tax', label: 'Tax Rate', type: 'percent', defaultValue: 8.25 }
      ],
      calculate: (v) => {
          const taxAmt = v.amount * (v.tax / 100);
          const total = v.amount + taxAmt;
          return {
              result: formatCurrency(total),
              details: [`Tax Amount: ${formatCurrency(taxAmt)}`],
              chart: {
                  type: 'donut',
                  title: 'Cost Breakdown',
                  data: [
                      { label: 'Price', value: v.amount, color: '#3b82f6' },
                      { label: 'Tax', value: taxAmt, color: '#f59e0b' }
                  ]
              },
              stats: [
                  { label: 'Total Price', value: formatCurrency(total) },
                  { label: 'Tax Amount', value: formatCurrency(taxAmt) }
              ]
          };
      }
  },
  'income-tax': {
    id: 'income-tax',
    title: 'Income Tax Estimator',
    description: 'Estimate federal tax liability (Simplified US brackets).',
    category: 'Business',
    icon: Building,
    inputs: [
      { name: 'income', label: 'Taxable Income', type: 'currency', defaultValue: 60000 }
    ],
    calculate: (v) => {
       // Simplified 2024 progressive brackets (Single)
       const brackets = [
         { max: 11600, rate: 0.10 },
         { max: 47150, rate: 0.12 },
         { max: 100525, rate: 0.22 },
         { max: 191950, rate: 0.24 },
         { max: Infinity, rate: 0.32 }
       ];
       let tax = 0;
       let remaining = v.income;
       let prevMax = 0;
       
       for(const b of brackets) {
         if(v.income > prevMax) {
            const taxable = Math.min(b.max - prevMax, remaining);
            tax += taxable * b.rate;
            remaining -= taxable;
            prevMax = b.max;
         }
       }
       const effRate = (tax / v.income) * 100;
       return {
         result: formatCurrency(tax),
         details: [`Effective Rate: ${effRate.toFixed(1)}%`],
         chart: { type: 'donut', data: [{label: 'Net Pay', value: v.income-tax, color: '#10b981'}, {label: 'Tax', value: tax, color: '#ef4444'}]},
         stats: [{label: 'Estimated Tax', value: formatCurrency(tax)}, {label: 'Net Income', value: formatCurrency(v.income - tax)}]
       }
    }
  },
  'capital-gains-tax': {
    id: 'capital-gains-tax',
    title: 'Capital Gains Tax',
    description: 'Estimate tax on investment profits.',
    category: 'Business',
    icon: Coins,
    inputs: [
      { name: 'profit', label: 'Total Profit', type: 'currency', defaultValue: 10000 },
      { name: 'term', label: 'Years Held (1=Short, >1=Long)', type: 'years', defaultValue: 2 },
      { name: 'income', label: 'Annual Income', type: 'currency', defaultValue: 70000 }
    ],
    calculate: (v) => {
      // Long Term: 0%, 15%, 20% based on income
      // Short Term: Ordinary income (simplified to 22%)
      let rate = 0;
      if (v.term < 1) rate = 0.22; // Short term approx
      else {
         if (v.income < 47000) rate = 0;
         else if (v.income < 518000) rate = 0.15;
         else rate = 0.20;
      }
      const tax = v.profit * rate;
      return {
        result: formatCurrency(tax),
        details: [`Rate Applied: ${rate*100}%`],
        chart: { type: 'donut', data: [{label: 'Keep', value: v.profit-tax, color: '#10b981'}, {label: 'Tax', value: tax, color: '#ef4444'}]},
        stats: [{label: 'Tax Liability', value: formatCurrency(tax)}, {label: 'Net Profit', value: formatCurrency(v.profit - tax)}]
      }
    }
  },
  'business-valuation': {
    id: 'business-valuation',
    title: 'Business Valuation',
    description: 'Estimate business value using earnings multiplier.',
    category: 'Business',
    icon: Building,
    inputs: [
      { name: 'revenue', label: 'Annual Revenue', type: 'currency', defaultValue: 500000 },
      { name: 'profit', label: 'Annual Profit (EBITDA)', type: 'currency', defaultValue: 100000 },
      { name: 'multiple', label: 'Industry Multiplier', type: 'number', defaultValue: 3.5 }
    ],
    calculate: (v) => {
       const val = v.profit * v.multiple;
       return {
         result: formatCurrency(val),
         details: [`Based on ${v.multiple}x EBITDA`],
         chart: { type: 'bar', data: [{label: 'Revenue', value: v.revenue, color: '#94a3b8'}, {label: 'Valuation', value: val, color: '#3b82f6'}]},
         stats: [{label: 'Est. Value', value: formatCurrency(val)}, {label: 'Profit Margin', value: ((v.profit/v.revenue)*100).toFixed(1)+'%'}]
       }
    }
  },
  'cac': {
    id: 'cac',
    title: 'Customer Acquisition Cost',
    description: 'Cost to acquire a new customer.',
    category: 'Business',
    icon: Briefcase,
    inputs: [
      { name: 'marketing', label: 'Marketing Spend', type: 'currency', defaultValue: 5000 },
      { name: 'sales', label: 'Sales Spend', type: 'currency', defaultValue: 3000 },
      { name: 'customers', label: 'New Customers', type: 'number', defaultValue: 50 }
    ],
    calculate: (v) => {
       const cost = (v.marketing + v.sales) / v.customers;
       return {
         result: formatCurrency(cost),
         details: [`Total Spend: ${formatCurrency(v.marketing+v.sales)}`],
         chart: { type: 'donut', data: [{label: 'Marketing', value: v.marketing, color: '#f472b6'}, {label: 'Sales', value: v.sales, color: '#60a5fa'}]},
         stats: [{label: 'CAC per User', value: formatCurrency(cost)}, {label: 'Total Customers', value: v.customers.toString()}]
       }
    }
  },
  'clv': {
    id: 'clv',
    title: 'Customer Lifetime Value',
    description: 'Total revenue expected from a customer.',
    category: 'Business',
    icon: Briefcase,
    inputs: [
      { name: 'value', label: 'Avg Purchase Value', type: 'currency', defaultValue: 100 },
      { name: 'freq', label: 'Purchases per Year', type: 'number', defaultValue: 4 },
      { name: 'years', label: 'Customer Lifespan', type: 'years', defaultValue: 3 }
    ],
    calculate: (v) => {
       const ltv = v.value * v.freq * v.years;
       return {
         result: formatCurrency(ltv),
         details: [`Annual Value: ${formatCurrency(v.value * v.freq)}`],
         chart: { type: 'bar', data: [{label: '1 Purchase', value: v.value, color: '#94a3b8'}, {label: 'Lifetime', value: ltv, color: '#10b981'}]},
         stats: [{label: 'LTV', value: formatCurrency(ltv)}, {label: 'Annual Revenue', value: formatCurrency(v.value * v.freq)}]
       }
    }
  },
  'depreciation': {
    id: 'depreciation',
    title: 'Asset Depreciation',
    description: 'Straight-line depreciation of an asset.',
    category: 'Business',
    icon: Activity,
    inputs: [
      { name: 'cost', label: 'Asset Cost', type: 'currency', defaultValue: 20000 },
      { name: 'salvage', label: 'Salvage Value', type: 'currency', defaultValue: 2000 },
      { name: 'life', label: 'Useful Life (Years)', type: 'years', defaultValue: 5 }
    ],
    calculate: (v) => {
       const annual = (v.cost - v.salvage) / v.life;
       return {
         result: `${formatCurrency(annual)} / yr`,
         details: [`Total Depreciable: ${formatCurrency(v.cost - v.salvage)}`],
         chart: { type: 'bar', data: [{label: 'Cost', value: v.cost, color: '#3b82f6'}, {label: 'Salvage', value: v.salvage, color: '#10b981'}]},
         stats: [{label: 'Annual Expense', value: formatCurrency(annual)}, {label: 'Total Depreciation', value: formatCurrency(v.cost - v.salvage)}]
       }
    }
  },
  'payroll': {
    id: 'payroll',
    title: 'Payroll Calculator',
    description: 'Estimate employer cost for an employee.',
    category: 'Business',
    icon: Building,
    inputs: [
      { name: 'salary', label: 'Gross Salary', type: 'currency', defaultValue: 60000 },
      { name: 'tax', label: 'Employer Tax %', type: 'percent', defaultValue: 7.65 },
      { name: 'benefits', label: 'Benefits (Annual)', type: 'currency', defaultValue: 5000 }
    ],
    calculate: (v) => {
       const taxes = v.salary * (v.tax/100);
       const total = v.salary + taxes + v.benefits;
       return {
         result: formatCurrency(total),
         details: [`Taxes: ${formatCurrency(taxes)}`, `Benefits: ${formatCurrency(v.benefits)}`],
         chart: { type: 'donut', data: [{label: 'Salary', value: v.salary, color: '#3b82f6'}, {label: 'Tax/Benefits', value: taxes+v.benefits, color: '#f59e0b'}]},
         stats: [{label: 'Total Cost', value: formatCurrency(total)}, {label: 'Overhead %', value: (((total-v.salary)/v.salary)*100).toFixed(1)+'%'}]
       }
    }
  },

  // ==========================================
  // REAL ESTATE
  // ==========================================
  'cap-rate': {
      id: 'cap-rate',
      title: 'Cap Rate Calculator',
      description: 'Capitalization Rate for rental properties.',
      category: 'Real Estate',
      icon: Home,
      inputs: [
          { name: 'price', label: 'Property Price', type: 'currency', defaultValue: 250000 },
          { name: 'income', label: 'Annual Gross Income', type: 'currency', defaultValue: 30000 },
          { name: 'expenses', label: 'Annual Expenses', type: 'currency', defaultValue: 10000 }
      ],
      calculate: (v) => {
          const noi = v.income - v.expenses;
          const capRate = (noi / v.price) * 100;
          return {
              result: formatPercent(capRate),
              details: [`NOI: ${formatCurrency(noi)}`],
              chart: {
                  type: 'bar',
                  title: 'Income vs Expense',
                  data: [
                      { label: 'Income', value: v.income, color: '#10b981' },
                      { label: 'Expenses', value: v.expenses, color: '#ef4444' }
                  ]
              },
              stats: [
                  { label: 'Cap Rate', value: formatPercent(capRate) },
                  { label: 'NOI', value: formatCurrency(noi) }
              ]
          };
      }
  },
  'rental-property-roi': {
      id: 'rental-property-roi',
      title: 'Rental Property ROI',
      description: 'Detailed return analysis for rentals.',
      category: 'Real Estate',
      icon: Home,
      inputs: [
          { name: 'purchase', label: 'Purchase Price', type: 'currency', defaultValue: 200000 },
          { name: 'rent', label: 'Monthly Rent', type: 'currency', defaultValue: 2000 },
          { name: 'expenses', label: 'Monthly Expenses', type: 'currency', defaultValue: 800 }
      ],
      calculate: (v) => {
          const annualCashFlow = (v.rent - v.expenses) * 12;
          const cashOnCash = (annualCashFlow / (v.purchase * 0.2)) * 100; // Assume 20% down standard
          return {
              result: `${formatCurrency(annualCashFlow)} / yr`,
              details: [`Est. Cash on Cash: ${cashOnCash.toFixed(1)}% (assuming 20% down)`],
              chart: {
                  type: 'bar',
                  title: 'Annual Cash Flow',
                  data: [
                      { label: 'Rent Income', value: v.rent * 12, color: '#10b981' },
                      { label: 'Expenses', value: v.expenses * 12, color: '#ef4444' }
                  ]
              },
              stats: [
                  { label: 'Annual Cash Flow', value: formatCurrency(annualCashFlow) },
                  { label: 'Monthly Cash Flow', value: formatCurrency(v.rent - v.expenses) }
              ]
          };
      }
  },
  'brrrr': {
    id: 'brrrr',
    title: 'BRRRR Calculator',
    description: 'Buy, Rehab, Rent, Refinance, Repeat strategy.',
    category: 'Real Estate',
    icon: Home,
    inputs: [
      { name: 'purchase', label: 'Purchase Price', type: 'currency', defaultValue: 100000 },
      { name: 'rehab', label: 'Rehab Costs', type: 'currency', defaultValue: 30000 },
      { name: 'arv', label: 'After Repair Value', type: 'currency', defaultValue: 180000 },
      { name: 'refi', label: 'Refinance % of ARV', type: 'percent', defaultValue: 75 }
    ],
    calculate: (v) => {
       const totalCost = v.purchase + v.rehab;
       const newLoan = v.arv * (v.refi/100);
       const cashOut = newLoan - totalCost;
       const equity = v.arv - newLoan;
       return {
         result: cashOut > 0 ? `${formatCurrency(cashOut)} Cash Out` : `${formatCurrency(Math.abs(cashOut))} Left In`,
         details: [`Total Project Cost: ${formatCurrency(totalCost)}`],
         chart: { type: 'bar', data: [{label: 'Total Cost', value: totalCost, color: '#94a3b8'}, {label: 'New Loan', value: newLoan, color: '#10b981'}]},
         stats: [{label: 'Created Equity', value: formatCurrency(equity)}, {label: 'New Loan', value: formatCurrency(newLoan)}]
       }
    }
  },
  'cash-on-cash': {
    id: 'cash-on-cash',
    title: 'Cash on Cash Return',
    description: 'Return on actual cash invested.',
    category: 'Real Estate',
    icon: Home,
    inputs: [
      { name: 'cashflow', label: 'Annual Cash Flow', type: 'currency', defaultValue: 6000 },
      { name: 'invested', label: 'Total Cash Invested', type: 'currency', defaultValue: 40000 }
    ],
    calculate: (v) => {
       const coc = (v.cashflow / v.invested) * 100;
       return {
         result: formatPercent(coc),
         details: [`Recoup Investment in: ${(v.invested/v.cashflow).toFixed(1)} years`],
         chart: { type: 'bar', data: [{label: 'Invested', value: v.invested, color: '#94a3b8'}, {label: 'Cash Flow', value: v.cashflow, color: '#10b981'}]},
         stats: [{label: 'CoC Return', value: formatPercent(coc)}, {label: 'Monthly Income', value: formatCurrency(v.cashflow/12)}]
       }
    }
  },

  // ==========================================
  // CRYPTO & TRADING
  // ==========================================
  'crypto-profit': {
      id: 'crypto-profit',
      title: 'Crypto Profit Calculator',
      description: 'Calculate profit from buying and selling crypto.',
      category: 'Crypto',
      icon: Coins,
      inputs: [
          { name: 'invested', label: 'Amount Invested', type: 'currency', defaultValue: 1000 },
          { name: 'buyPrice', label: 'Buy Price (Coin)', type: 'currency', defaultValue: 50000 },
          { name: 'sellPrice', label: 'Sell Price (Coin)', type: 'currency', defaultValue: 65000 },
          { name: 'fees', label: 'Fees (%)', type: 'percent', defaultValue: 0.1 }
      ],
      calculate: (v) => {
          const coins = v.invested / v.buyPrice;
          const gross = coins * v.sellPrice;
          const feeAmt = (v.invested + gross) * (v.fees/100);
          const net = gross - v.invested - feeAmt;
          const roi = (net / v.invested) * 100;
          return {
              result: formatCurrency(net),
              details: [`ROI: ${roi.toFixed(2)}%`],
              chart: {
                  type: 'bar',
                  title: 'Trade Result',
                  data: [
                      { label: 'Invested', value: v.invested, color: '#94a3b8' },
                      { label: 'Final Value', value: gross - feeAmt, color: net > 0 ? '#10b981' : '#ef4444' }
                  ]
              },
              stats: [
                  { label: 'Net Profit', value: formatCurrency(net) },
                  { label: 'Total Fees', value: formatCurrency(feeAmt) }
              ]
          };
      }
  },
  'crypto-staking': {
    id: 'crypto-staking',
    title: 'Crypto Staking Rewards',
    description: 'Calculate staking rewards over time.',
    category: 'Crypto',
    icon: Coins,
    inputs: [
      { name: 'amount', label: 'Amount Staked', type: 'number', defaultValue: 10 },
      { name: 'price', label: 'Coin Price', type: 'currency', defaultValue: 2000 },
      { name: 'apy', label: 'APY %', type: 'percent', defaultValue: 5 },
      { name: 'days', label: 'Duration (Days)', type: 'number', defaultValue: 30 }
    ],
    calculate: (v) => {
       const dailyRate = v.apy / 100 / 365;
       const rewards = v.amount * dailyRate * v.days;
       const value = rewards * v.price;
       return {
         result: `${rewards.toFixed(4)} Coins`,
         details: [`Value: ${formatCurrency(value)}`],
         chart: { type: 'bar', data: [{label: 'Principal', value: v.amount*v.price, color: '#3b82f6'}, {label: 'Rewards', value: value, color: '#10b981'}]},
         stats: [{label: 'Rewards Value', value: formatCurrency(value)}, {label: 'Daily Earnings', value: formatCurrency(value/v.days)}]
       }
    }
  },
  'mining-profitability': {
    id: 'mining-profitability',
    title: 'Mining Profitability',
    description: 'Est. profit based on revenue vs power cost.',
    category: 'Crypto',
    icon: Activity,
    inputs: [
      { name: 'hashrate', label: 'Daily Revenue', type: 'currency', defaultValue: 15 },
      { name: 'power', label: 'Power (Watts)', type: 'number', defaultValue: 1200 },
      { name: 'cost', label: 'Cost per kWh', type: 'currency', defaultValue: 0.12 }
    ],
    calculate: (v) => {
       const dailyPowerCost = (v.power / 1000) * 24 * v.cost;
       const dailyProfit = v.hashrate - dailyPowerCost;
       return {
         result: `${formatCurrency(dailyProfit)} / day`,
         details: [`Monthly: ${formatCurrency(dailyProfit*30)}`],
         chart: { type: 'donut', data: [{label: 'Power Cost', value: dailyPowerCost, color: '#ef4444'}, {label: 'Profit', value: dailyProfit, color: '#10b981'}]},
         stats: [{label: 'Monthly Profit', value: formatCurrency(dailyProfit*30)}, {label: 'Power Cost', value: formatCurrency(dailyPowerCost)}]
       }
    }
  },
  'options-profit': {
    id: 'options-profit',
    title: 'Options Profit Calculator',
    description: 'Simple Call/Put profit estimator.',
    category: 'Trading',
    icon: TrendingUp,
    inputs: [
      { name: 'contracts', label: 'Contracts (100x)', type: 'number', defaultValue: 1 },
      { name: 'premium', label: 'Premium Paid', type: 'currency', defaultValue: 2.50 },
      { name: 'strike', label: 'Strike Price', type: 'currency', defaultValue: 150 },
      { name: 'price', label: 'Exit Stock Price', type: 'currency', defaultValue: 160 }
    ],
    calculate: (v) => {
       const cost = v.contracts * 100 * v.premium;
       const gross = Math.max(0, (v.price - v.strike)) * v.contracts * 100;
       const profit = gross - cost;
       return {
         result: formatCurrency(profit),
         details: [`Cost Basis: ${formatCurrency(cost)}`],
         chart: { type: 'bar', data: [{label: 'Premium Cost', value: cost, color: '#ef4444'}, {label: 'Exit Value', value: gross, color: '#10b981'}]},
         stats: [{label: 'Net Profit', value: formatCurrency(profit)}, {label: 'Break Even', value: formatCurrency(v.strike + v.premium)}]
       }
    }
  },
  'margin-trading': {
    id: 'margin-trading',
    title: 'Margin Trading',
    description: 'Calculate leverage position and liquidation.',
    category: 'Trading',
    icon: Activity,
    inputs: [
      { name: 'collateral', label: 'Collateral', type: 'currency', defaultValue: 1000 },
      { name: 'leverage', label: 'Leverage (x)', type: 'number', defaultValue: 5 },
      { name: 'entry', label: 'Entry Price', type: 'currency', defaultValue: 50000 }
    ],
    calculate: (v) => {
       const totalPos = v.collateral * v.leverage;
       // Approx liquidation for long: Entry * (1 - 1/Lev)
       const liqPrice = v.entry * (1 - (1/v.leverage) + 0.01); // Buffer 1%
       return {
         result: formatCurrency(totalPos),
         details: [`Buying Power: ${v.leverage}x`],
         chart: { type: 'donut', data: [{label: 'Your Money', value: v.collateral, color: '#10b981'}, {label: 'Borrowed', value: totalPos - v.collateral, color: '#f59e0b'}]},
         stats: [{label: 'Total Position', value: formatCurrency(totalPos)}, {label: 'Est. Liquidation', value: formatCurrency(liqPrice)}]
       }
    }
  },

  // ==========================================
  // BANKING & MISC
  // ==========================================
  'currency-converter': {
    id: 'currency-converter',
    title: 'Simple Currency Converter',
    description: 'Convert amount using a custom rate.',
    category: 'Banking',
    icon: Coins,
    inputs: [
      { name: 'amount', label: 'Amount', type: 'number', defaultValue: 100 },
      { name: 'rate', label: 'Exchange Rate', type: 'number', defaultValue: 0.92, placeholder: 'e.g., 1 USD = 0.92 EUR' }
    ],
    calculate: (v) => {
       const converted = v.amount * v.rate;
       return {
         result: converted.toFixed(2),
         details: [`Rate: ${v.rate}`],
         chart: { type: 'bar', data: [{label: 'Original', value: v.amount, color: '#94a3b8'}, {label: 'Converted', value: converted, color: '#3b82f6'}]},
         stats: [{label: 'Converted Value', value: converted.toFixed(2)}, {label: 'Rate Used', value: v.rate.toString()}]
       }
    }
  },
  'apy-vs-apr': {
    id: 'apy-vs-apr',
    title: 'APY vs APR',
    description: 'Convert Interest Rate (APR) to Yield (APY).',
    category: 'Banking',
    icon: Percent,
    inputs: [
      { name: 'apr', label: 'APR %', type: 'percent', defaultValue: 5 },
      { name: 'compound', label: 'Compounds/Year', type: 'number', defaultValue: 12, placeholder: '12=Monthly, 365=Daily' }
    ],
    calculate: (v) => {
       const r = v.apr / 100;
       const n = v.compound;
       const apy = (Math.pow(1 + r/n, n) - 1) * 100;
       return {
         result: `${apy.toFixed(2)}% APY`,
         details: [`Difference: ${(apy - v.apr).toFixed(2)}%`],
         chart: { type: 'bar', data: [{label: 'APR', value: v.apr, color: '#94a3b8'}, {label: 'APY', value: apy, color: '#10b981'}]},
         stats: [{label: 'Effective Yield', value: formatPercent(apy)}, {label: 'Nominal Rate', value: formatPercent(v.apr)}]
       }
    }
  },
  'cd-calculator': {
    id: 'cd-calculator',
    title: 'CD Calculator',
    description: 'Certificate of Deposit returns.',
    category: 'Banking',
    icon: Landmark,
    inputs: [
      { name: 'deposit', label: 'Deposit Amount', type: 'currency', defaultValue: 10000 },
      { name: 'rate', label: 'APY %', type: 'percent', defaultValue: 4.5 },
      { name: 'months', label: 'Term (Months)', type: 'number', defaultValue: 12 }
    ],
    calculate: (v) => {
       const r = v.rate / 100 / 12;
       const fv = v.deposit * Math.pow(1 + r, v.months);
       return {
         result: formatCurrency(fv),
         details: [`Interest Earned: ${formatCurrency(fv - v.deposit)}`],
         chart: { type: 'donut', data: [{label: 'Principal', value: v.deposit, color: '#3b82f6'}, {label: 'Interest', value: fv-v.deposit, color: '#10b981'}]},
         stats: [{label: 'Maturity Value', value: formatCurrency(fv)}, {label: 'Total Interest', value: formatCurrency(fv-v.deposit)}]
       }
    }
  },
  'bank-fee': {
    id: 'bank-fee',
    title: 'Bank Fee Analyzer',
    description: 'See how much fees cost you over time.',
    category: 'Banking',
    icon: Coins,
    inputs: [
      { name: 'monthly', label: 'Monthly Fee', type: 'currency', defaultValue: 12 },
      { name: 'atm', label: 'ATM Fees/Mo', type: 'currency', defaultValue: 5 },
      { name: 'years', label: 'Years', type: 'years', defaultValue: 5 }
    ],
    calculate: (v) => {
       const annual = (v.monthly + v.atm) * 12;
       const total = annual * v.years;
       return {
         result: formatCurrency(total),
         details: [`Annual Cost: ${formatCurrency(annual)}`],
         chart: { type: 'bar', data: [{label: 'Monthly Fee', value: v.monthly*12*v.years, color: '#ef4444'}, {label: 'ATM Fees', value: v.atm*12*v.years, color: '#f59e0b'}]},
         stats: [{label: 'Total Wasted', value: formatCurrency(total)}, {label: 'Annual Cost', value: formatCurrency(annual)}]
       }
    }
  }
};

export const getCalculator = (id: string): CalculatorConfig => {
  if (calculators[id]) return calculators[id];
  
  // Fallback for any unknown IDs
  return {
    id,
    title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: 'This specific calculator logic is being updated. Please try "Loan Payment", "Mortgage", or "Investment Growth" for fully featured demos.',
    category: 'General',
    icon: Calculator,
    inputs: [{ name: 'val', label: 'Input Value', type: 'number', defaultValue: 100 }],
    calculate: (v) => ({ 
        result: 'Coming Soon', 
        details: ['This specific module is under development.'], 
        stats: [{ label: 'Status', value: 'Pending Update' }] 
    })
  };
};
