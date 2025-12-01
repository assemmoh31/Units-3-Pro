import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  DollarSign, 
  Landmark, 
  TrendingUp, 
  CreditCard, 
  PieChart, 
  Home, 
  Briefcase, 
  Coins, 
  Percent,
  Wallet,
  Building,
  Activity,
  Shield,
  FileText
} from 'lucide-react';

// Categorized List of Calculators for easier navigation
const categories = [
  {
    title: "Loans & Debt",
    icon: CreditCard,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    tools: [
      { id: 'loan-payment', label: 'Loan Payment' },
      { id: 'mortgage', label: 'Mortgage' },
      { id: 'car-loan', label: 'Car Loan' },
      { id: 'credit-card-payoff', label: 'Credit Card Payoff' },
      { id: 'refinance', label: 'Refinance' },
      { id: 'debt-snowball', label: 'Debt Snowball' },
      { id: 'debt-to-income', label: 'Debt-to-Income Ratio' },
      { id: 'home-equity', label: 'Home Equity' },
      { id: 'house-affordability', label: 'House Affordability' },
    ]
  },
  {
    title: "Investments & Returns",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    tools: [
      { id: 'compound-interest', label: 'Compound Interest' },
      { id: 'investment-growth', label: 'Investment Growth' },
      { id: 'roi', label: 'Return on Investment (ROI)' },
      { id: 'dividend', label: 'Dividend Yield' },
      { id: 'stock-profit', label: 'Stock Profit' },
      { id: 'dollar-cost-averaging', label: 'Dollar Cost Averaging' },
      { id: 'cagr', label: 'CAGR Calculator' },
      { id: 'irr', label: 'Internal Rate of Return (IRR)' },
      { id: 'risk-reward', label: 'Risk/Reward Ratio' },
    ]
  },
  {
    title: "Retirement & Planning",
    icon: UmbrellaIcon,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    tools: [
      { id: 'retirement-savings', label: 'Retirement Savings' },
      { id: '401k', label: '401(k) Planner' },
      { id: 'fire-calculator', label: 'FIRE Calculator' },
      { id: 'pension', label: 'Pension Estimator' },
      { id: 'net-worth', label: 'Net Worth' },
      { id: 'emergency-fund', label: 'Emergency Fund' },
      { id: 'savings-goal', label: 'Savings Goal' },
      { id: 'monthly-budget', label: 'Monthly Budget' },
    ]
  },
  {
    title: "Trading & Crypto",
    icon: Coins,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    tools: [
      { id: 'crypto-profit', label: 'Crypto Profit' },
      { id: 'crypto-staking', label: 'Crypto Staking' },
      { id: 'mining-profitability', label: 'Mining Profitability' },
      { id: 'options-profit', label: 'Options Profit' },
      { id: 'margin-trading', label: 'Margin Trading' },
      { id: 'break-even', label: 'Break-Even Point' },
    ]
  },
  {
    title: "Business & Taxes",
    icon: Briefcase,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    tools: [
      { id: 'income-tax', label: 'Income Tax Estimator' },
      { id: 'capital-gains-tax', label: 'Capital Gains Tax' },
      { id: 'sales-tax', label: 'Sales Tax' },
      { id: 'profit-margin', label: 'Profit Margin' },
      { id: 'business-valuation', label: 'Business Valuation' },
      { id: 'cac', label: 'Customer Acquisition Cost' },
      { id: 'clv', label: 'Customer Lifetime Value' },
      { id: 'depreciation', label: 'Asset Depreciation' },
      { id: 'payroll', label: 'Payroll' },
    ]
  },
  {
    title: "Real Estate",
    icon: Home,
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    tools: [
      { id: 'rental-property-roi', label: 'Rental Property ROI' },
      { id: 'brrrr', label: 'BRRRR Strategy' },
      { id: 'cap-rate', label: 'Cap Rate' },
      { id: 'cash-on-cash', label: 'Cash on Cash Return' },
    ]
  },
  {
    title: "Banking & Misc",
    icon: Landmark,
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    tools: [
      { id: 'currency-converter', label: 'Currency Converter' },
      { id: 'apy-vs-apr', label: 'APY vs APR' },
      { id: 'cd-calculator', label: 'CD Calculator' },
      { id: 'bank-fee', label: 'Bank Fee Analyzer' },
    ]
  }
];

// Helper component for icon
function UmbrellaIcon(props: any) {
  return <Shield {...props} />;
}

const FinancialInvestment: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center gap-12 animate-fade-in mb-12">
      <SEO 
        title="Financial & Investment Calculators"
        description="Master your money with our suite of financial tools. Mortgage, Loan Payment, ROI, Compound Interest, and Retirement calculators."
        keywords={['loan calculator', 'mortgage calculator', 'roi calculator', 'investment calculator', 'retirement planner', '401k calculator', 'crypto profit']}
      />

      <div className="text-center max-w-4xl px-4">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-50 dark:ring-emerald-900/20">
           <DollarSign className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
          Financial & Investment Tools
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Plan your future with precision. Calculators for investors, homeowners, traders, and business owners.
        </p>
      </div>

      <div className="w-full max-w-7xl px-4 space-y-12">
        {categories.map((category, idx) => (
          <div key={idx} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <category.icon className={`w-6 h-6 ${category.color}`} />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{category.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {category.tools.map((tool) => (
                <Link 
                  key={tool.id} 
                  to={`/financial-investment/${tool.id}`}
                  className="group relative bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${category.bg.replace('/20', '')}`}></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 pr-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {tool.label}
                    </h3>
                    <div className={`p-2 rounded-lg ${category.bg} ${category.color} group-hover:scale-110 transition-transform`}>
                       <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center text-xs font-medium text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    <span>Calculate Now</span>
                    <TrendingUp className="w-3 h-3 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialInvestment;