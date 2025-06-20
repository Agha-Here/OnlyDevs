import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { CreatorsSection } from './components/sections/CreatorsSection';
import { CategoriesSection } from './components/sections/CategoriesSection';
import { PricingSection } from './components/sections/PricingSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { CTASection } from './components/sections/CTASection';
import { CreatorsPage } from './pages/CreatorsPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { initializeSampleData } from './data/seedData';

const HomePage = () => (
  <>
    <HeroSection />
    <CreatorsSection />
    <CategoriesSection />
    <PricingSection />
    <TestimonialsSection />
    <CTASection />
  </>
);

function App() {
  useEffect(() => {
    // Initialize sample data on app load
    initializeSampleData();
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-900">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/creators" element={<CreatorsPage />} />
            <Route path="/creator/:username" element={<CreatorProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#fff',
              border: '1px solid rgba(107, 70, 193, 0.3)',
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;