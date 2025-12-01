import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdvancedMathScience from './pages/AdvancedMathScience';
import FinancialInvestment from './pages/FinancialInvestment';
import PhysicsDashboard from './pages/PhysicsDashboard';
import ChemistryDashboard from './pages/ChemistryDashboard';
import GeographyDashboard from './pages/GeographyDashboard';
import CurrencyDashboard from './pages/CurrencyDashboard';
import HealthFitnessDashboard from './pages/HealthFitnessDashboard';
import TechDashboard from './pages/TechDashboard';
import EverydayDashboard from './pages/EverydayDashboard';

// Math Calculators
import IntegralDerivative from './pages/calculators/IntegralDerivative';
import PhysicsFormulas from './pages/calculators/PhysicsFormulas';
import UnitCircleTrig from './pages/calculators/UnitCircleTrig';
import DifferentialEquations from './pages/calculators/DifferentialEquations';
import FourierTransform from './pages/calculators/FourierTransform';
import LaplaceTransform from './pages/calculators/LaplaceTransform';
import ProbabilityDistributions from './pages/calculators/ProbabilityDistributions';
import VectorFieldGradient from './pages/calculators/VectorFieldGradient';

// Wrapper Components
import FinancialCalculator from './pages/calculators-finance/FinancialCalculator';
import PhysicsCalculator from './pages/calculators-physics/PhysicsCalculator';
import ChemistryCalculator from './pages/calculators-chemistry/ChemistryCalculator';
import GeographyCalculator from './pages/calculators-geography/GeographyCalculator';
import CurrencyCalculator from './pages/calculators-currency/CurrencyCalculator';
import HealthCalculator from './pages/calculators-health/HealthCalculator';
import TechCalculator from './pages/calculators-tech/TechCalculator';
import EverydayCalculator from './pages/calculators-everyday/EverydayCalculator';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              
              {/* Math Section */}
              <Route path="/advanced-math" element={<AdvancedMathScience />} />
              <Route path="/advanced-math/integral-derivative" element={<IntegralDerivative />} />
              <Route path="/advanced-math/physics-formulas" element={<PhysicsFormulas />} />
              <Route path="/advanced-math/unit-circle-trig" element={<UnitCircleTrig />} />
              <Route path="/advanced-math/differential-equations" element={<DifferentialEquations />} />
              <Route path="/advanced-math/fourier-transform" element={<FourierTransform />} />
              <Route path="/advanced-math/laplace-transform" element={<LaplaceTransform />} />
              <Route path="/advanced-math/probability-distributions" element={<ProbabilityDistributions />} />
              <Route path="/advanced-math/vector-field-gradient" element={<VectorFieldGradient />} />

              {/* Financial Section */}
              <Route path="/financial-investment" element={<FinancialInvestment />} />
              <Route path="/financial-investment/:calculatorId" element={<FinancialCalculator />} />
              
              {/* Physics Section */}
              <Route path="/physics" element={<PhysicsDashboard />} />
              <Route path="/physics/:category/:calculatorId" element={<PhysicsCalculator />} />

              {/* Chemistry Section */}
              <Route path="/chemistry" element={<ChemistryDashboard />} />
              <Route path="/chemistry/:category/:calculatorId" element={<ChemistryCalculator />} />

              {/* Geography Section */}
              <Route path="/geography" element={<GeographyDashboard />} />
              <Route path="/geography/:category/:calculatorId" element={<GeographyCalculator />} />

              {/* Currency Section */}
              <Route path="/currency" element={<CurrencyDashboard />} />
              <Route path="/currency/:toolId" element={<CurrencyCalculator />} />

              {/* Health Section */}
              <Route path="/health" element={<HealthFitnessDashboard />} />
              <Route path="/health/:category/:calculatorId" element={<HealthCalculator />} />

              {/* Tech & Developer Section */}
              <Route path="/tech-developer" element={<TechDashboard />} />
              <Route path="/tech-developer/:category/:calculatorId" element={<TechCalculator />} />

              {/* Everyday Conversions Section */}
              <Route path="/everyday" element={<EverydayDashboard />} />
              <Route path="/everyday/:category/:calculatorId" element={<EverydayCalculator />} />
              
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;