import React from 'react';
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

// Usage Examples for Different Pages

// 1. Home Page Loader
export const HomePageLoader = () => {
  return <SpinningDotsLoader message="Welcome! Loading Home..." />;
};

// 2. PG Listing Page Loader
export const PGListingLoader = () => {
  return <PGBuildingLoader message="Finding Perfect PGs for You..." />;
};

// 3. Bike Listing Page Loader
export const BikeListingLoader = () => {
  return <BikeRentalLoader message="Finding Your Perfect Ride..." />;
};

// 4. Login/Authentication Page Loader
export const AuthLoader = () => {
  return <PulseRingLoader message="Authenticating..." />;
};

// 5. Dashboard/Admin Page Loader
export const DashboardLoader = () => {
  return <MorphingSquaresLoader message="Loading Dashboard..." />;
};

// 6. Data Processing/Analytics Page Loader
export const DataLoader = () => {
  return <WaveLoader message="Processing Data..." />;
};

// 7. General/Fun Page Loader
export const GeneralLoader = () => {
  return <BouncingBallsLoader message="Almost Ready..." />;
};

// 8. Simple Circular Spinner Loader
export const SimpleSpinnerLoader = () => {
  return <CircularSpinnerLoader message="Loading..." />;
};

// 9. DNA Science Loader
export const ScienceLoader = () => {
  return <DNAHelixLoader message="Analyzing Data..." />;
};

// 10. Futuristic Neon Loader
export const FuturisticLoader = () => {
  return <NeonGlowLoader message="Initializing System..." />;
};

// 11. Tech/Hacker Style Loader
export const TechLoader = () => {
  return <MatrixRainLoader message="Connecting to Server..." />;
};

// 12. Organic Liquid Loader
export const OrganicLoader = () => {
  return <LiquidBubbleLoader message="Processing..." />;
};

// 13. Modern Geometric Loader
export const ModernLoader = () => {
  return <GeometricTrianglesLoader message="Rendering..." />;
};

// 14. Physics/Science Loader
export const PhysicsLoader = () => {
  return <ParticleSystemLoader message="Calculating..." />;
};

// 15. Glassmorphism UI Loader
export const GlassLoader = () => {
  return <GlassmorphismLoader message="Loading Interface..." />;
};

// 16. Payment/Security Loader
export const PaymentLoader = () => {
  return <PaymentSecurityLoader message="Securing Payment..." />;
};

// 17. Banking Transaction Loader
export const BankingLoader = () => {
  return <BankingTransactionLoader message="Processing Transaction..." />;
};

// 18. Booking Process Loader
export const BookingLoader = () => {
  return <BookingProcessLoader message="Confirming Your Booking..." />;
};

// 19. Availability Check Loader
export const AvailabilityLoader = () => {
  return <AvailabilityCheckLoader message="Checking Room Availability..." />;
};

// 20. Custom Loader with Dynamic Message
export const CustomLoader = ({ type = 'spinning', message = 'Loading...' }) => {
  const loaderComponents = {
    spinning: SpinningDotsLoader,
    wave: WaveLoader,
    pulse: PulseRingLoader,
    bouncing: BouncingBallsLoader,
    morphing: MorphingSquaresLoader,
    bike: BikeRentalLoader,
    building: PGBuildingLoader,
    circular: CircularSpinnerLoader,
    dna: DNAHelixLoader,
    neon: NeonGlowLoader,
    matrix: MatrixRainLoader,
    liquid: LiquidBubbleLoader,
    geometric: GeometricTrianglesLoader,
    particle: ParticleSystemLoader,
    glass: GlassmorphismLoader,
    payment: PaymentSecurityLoader,
    banking: BankingTransactionLoader,
    booking: BookingProcessLoader,
    availability: AvailabilityCheckLoader
  };

  const LoaderComponent = loaderComponents[type] || SpinningDotsLoader;
  return <LoaderComponent message={message} />;
};

// 9. Multi-Stage Loader (for complex operations)
export const MultiStageLoader = ({ stage = 1, total = 3 }) => {
  const stages = [
    { component: PulseRingLoader, message: "Initializing..." },
    { component: WaveLoader, message: "Processing Data..." },
    { component: SpinningDotsLoader, message: "Almost Ready..." }
  ];

  const currentStage = stages[stage - 1] || stages[0];
  const LoaderComponent = currentStage.component;
  
  return (
    <div>
      <LoaderComponent message={`${currentStage.message} (${stage}/${total})`} />
      <div className="stage-progress" style={{ 
        width: '200px', 
        height: '4px', 
        background: '#e2e8f0', 
        borderRadius: '2px',
        margin: '20px auto',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${(stage / total) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
          transition: 'width 0.5s ease'
        }}></div>
      </div>
    </div>
  );
};

export default {
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
};
