import React from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Calculator } from 'lucide-react';

const PlaceholderCalc: React.FC<{ title: string }> = ({ title }) => {
  return (
    <CalculatorLayout title={title} icon={<Calculator className="w-6 h-6" />}>
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Under Construction</h2>
        <p className="text-slate-500 mt-2">This calculator module is currently being built.</p>
      </div>
    </CalculatorLayout>
  );
};

export default PlaceholderCalc;