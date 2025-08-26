import React, { useState } from 'react';
import {
  SpinningDotsLoader,
  WaveLoader,
  PulseRingLoader,
  BouncingBallsLoader,
  MorphingSquaresLoader,
  BikeRentalLoader,
  PGBuildingLoader,
  CircularSpinnerLoader,
  DNAHelixLoader,
  NeonGlowLoader,
  MatrixRainLoader,
  LiquidBubbleLoader,
  GeometricTrianglesLoader,
  ParticleSystemLoader,
  GlassmorphismLoader,
  PaymentSecurityLoader,
  BankingTransactionLoader,
  BookingProcessLoader,
  AvailabilityCheckLoader
} from './LoaderComponents';
import {
  HomePageLoader,
  PGListingLoader,
  BikeListingLoader,
  AuthLoader,
  DashboardLoader,
  DataLoader,
  GeneralLoader,
  SimpleSpinnerLoader,
  ScienceLoader,
  FuturisticLoader,
  TechLoader,
  OrganicLoader,
  ModernLoader,
  PhysicsLoader,
  GlassLoader,
  PaymentLoader,
  BankingLoader,
  BookingLoader,
  AvailabilityLoader,
  CustomLoader,
  MultiStageLoader
} from './LoaderExamples';

const LoaderDemo = () => {
  const [selectedLoader, setSelectedLoader] = useState('home');
  const [customMessage, setCustomMessage] = useState('Custom Loading Message...');

  const loaderOptions = [
    // Themed Loaders
    { id: 'home', name: 'Home Page Loader', component: <HomePageLoader /> },
    { id: 'pg', name: 'PG Building Loader', component: <PGListingLoader /> },
    { id: 'bike', name: 'Bike Rental Loader', component: <BikeListingLoader /> },
    { id: 'auth', name: 'Authentication Loader', component: <AuthLoader /> },
    { id: 'dashboard', name: 'Dashboard Loader', component: <DashboardLoader /> },
    { id: 'data', name: 'Data Processing Loader', component: <DataLoader /> },
    
    // Payment & Security
    { id: 'payment', name: 'Payment Security Loader', component: <PaymentLoader /> },
    { id: 'banking', name: 'Banking Transaction Loader', component: <BankingLoader /> },
    
    // Booking & Availability
    { id: 'booking', name: 'Booking Process Loader', component: <BookingLoader /> },
    { id: 'availability', name: 'Availability Check Loader', component: <AvailabilityLoader /> },
    
    // Basic & Simple
    { id: 'simple', name: 'Simple Circular Spinner', component: <SimpleSpinnerLoader /> },
    { id: 'general', name: 'General Bouncing Loader', component: <GeneralLoader /> },
    
    // Modern & Trendy UI
    { id: 'glass', name: 'Glassmorphism Loader', component: <GlassLoader /> },
    { id: 'neon', name: 'Futuristic Neon Loader', component: <FuturisticLoader /> },
    { id: 'geometric', name: 'Modern Geometric Loader', component: <ModernLoader /> },
    { id: 'liquid', name: 'Organic Liquid Loader', component: <OrganicLoader /> },
    
    // Science & Tech
    { id: 'dna', name: 'DNA Science Loader', component: <ScienceLoader /> },
    { id: 'particle', name: 'Physics Particle Loader', component: <PhysicsLoader /> },
    { id: 'matrix', name: 'Tech Matrix Loader', component: <TechLoader /> },
    
    // Raw Components
    { id: 'spinning', name: 'Spinning Dots', component: <SpinningDotsLoader message="Spinning Dots Animation" /> },
    { id: 'wave', name: 'Wave Animation', component: <WaveLoader message="Wave Animation Loading" /> },
    { id: 'pulse', name: 'Pulse Ring', component: <PulseRingLoader message="Pulse Ring Animation" /> },
    { id: 'bouncing', name: 'Bouncing Balls', component: <BouncingBallsLoader message="Bouncing Balls Fun!" /> },
    { id: 'morphing', name: 'Morphing Squares', component: <MorphingSquaresLoader message="Morphing Squares" /> },
    { id: 'circular', name: 'Basic Circular Spinner', component: <CircularSpinnerLoader message="Basic Loading..." /> },
    { id: 'paymentraw', name: 'Payment Security (Raw)', component: <PaymentSecurityLoader message="Securing Payment..." /> },
    { id: 'bankingraw', name: 'Banking Transaction (Raw)', component: <BankingTransactionLoader message="Processing Transaction..." /> },
    { id: 'bookingraw', name: 'Booking Process (Raw)', component: <BookingProcessLoader message="Processing Booking..." /> },
    { id: 'availabilityraw', name: 'Availability Check (Raw)', component: <AvailabilityCheckLoader message="Checking Slots..." /> },
    
    // Advanced
    { id: 'custom', name: 'Custom Loader', component: <CustomLoader type="spinning" message={customMessage} /> },
    { id: 'multistage', name: 'Multi-Stage Loader', component: <MultiStageLoader stage={2} total={3} /> }
  ];

  const currentLoader = loaderOptions.find(loader => loader.id === selectedLoader);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🎯 Amazing Loaders Collection
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Choose a Loader Type:</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {loaderOptions.map((loader) => (
              <button
                key={loader.id}
                onClick={() => setSelectedLoader(loader.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium ${
                  selectedLoader === loader.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {loader.name}
              </button>
            ))}
          </div>

          {selectedLoader === 'custom' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message:
              </label>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your custom loading message..."
              />
            </div>
          )}

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Preview: {currentLoader?.name}
            </h3>
          </div>
        </div>

        {/* Loader Preview Area */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            <p className="text-blue-100">This is how the loader will appear on your page</p>
          </div>
          
          <div className="min-h-[400px]">
            {currentLoader?.component}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">📚 How to Use These Loaders</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">1. Import the Loader</h4>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                <code>{`import { ${currentLoader?.name.replace(' ', '')}Loader } from '../components/loaders/LoaderExamples';`}</code>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">2. Use in Your Component</h4>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                <code>{`{loading && <${currentLoader?.name.replace(' ', '')}Loader />}`}</code>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-700 mb-3">🎨 Recommended Usage by Page Type:</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800">🏠 Home Page</h5>
                <p className="text-blue-600 text-sm">SpinningDotsLoader - Welcoming & Engaging</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-800">🏢 PG Listings</h5>
                <p className="text-green-600 text-sm">PGBuildingLoader - Theme-specific</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-semibold text-purple-800">🏍️ Bike Listings</h5>
                <p className="text-purple-600 text-sm">BikeRentalLoader - Fun & Relevant</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-800">🔐 Authentication</h5>
                <p className="text-yellow-600 text-sm">PulseRingLoader - Secure Feeling</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h5 className="font-semibold text-indigo-800">📊 Dashboard</h5>
                <p className="text-indigo-600 text-sm">MorphingSquaresLoader - Professional</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-semibold text-red-800">📈 Data Processing</h5>
                <p className="text-red-600 text-sm">WaveLoader - Shows Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo;
