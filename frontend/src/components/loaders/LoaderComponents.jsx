import React from 'react';
import './loaders.css';

// 1. Spinning Dots Loader - Good for Home Page
export const SpinningDotsLoader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="spinning-dots-loader">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        <div className="dot dot4"></div>
        <div className="dot dot5"></div>
        <div className="dot dot6"></div>
        <div className="dot dot7"></div>
        <div className="dot dot8"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 2. Wave Loader - Good for Data Loading Pages
export const WaveLoader = ({ message = "Loading Data..." }) => {
  return (
    <div className="loader-container">
      <div className="wave-loader">
        <div className="wave-bar bar1"></div>
        <div className="wave-bar bar2"></div>
        <div className="wave-bar bar3"></div>
        <div className="wave-bar bar4"></div>
        <div className="wave-bar bar5"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 3. Pulse Ring Loader - Good for Authentication Pages
export const PulseRingLoader = ({ message = "Authenticating..." }) => {
  return (
    <div className="loader-container">
      <div className="pulse-ring-loader">
        <div className="pulse-ring ring1"></div>
        <div className="pulse-ring ring2"></div>
        <div className="pulse-ring ring3"></div>
        <div className="pulse-ring ring4"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 4. Bouncing Balls Loader - Good for Fun/Interactive Pages
export const BouncingBallsLoader = ({ message = "Please Wait..." }) => {
  return (
    <div className="loader-container">
      <div className="bouncing-balls-loader">
        <div className="ball ball1"></div>
        <div className="ball ball2"></div>
        <div className="ball ball3"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 5. Morphing Squares Loader - Good for Dashboard/Admin Pages
export const MorphingSquaresLoader = ({ message = "Loading Dashboard..." }) => {
  return (
    <div className="loader-container">
      <div className="morphing-squares-loader">
        <div className="square square1"></div>
        <div className="square square2"></div>
        <div className="square square3"></div>
        <div className="square square4"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 6. Bike/PG Themed Loader - Specific for Your App
export const BikeRentalLoader = ({ message = "Finding Your Ride..." }) => {
  return (
    <div className="loader-container">
      <div className="bike-rental-loader">
        <div className="bike-wheel wheel1">
          <div className="spoke"></div>
          <div className="spoke"></div>
          <div className="spoke"></div>
          <div className="spoke"></div>
        </div>
        <div className="bike-wheel wheel2">
          <div className="spoke"></div>
          <div className="spoke"></div>
          <div className="spoke"></div>
          <div className="spoke"></div>
        </div>
        <div className="bike-body"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 7. Building Loader - For PG Pages
export const PGBuildingLoader = ({ message = "Finding Your Perfect PG..." }) => {
  return (
    <div className="loader-container">
      <div className="pg-building-loader">
        <div className="building">
          <div className="floor floor1"></div>
          <div className="floor floor2"></div>
          <div className="floor floor3"></div>
          <div className="floor floor4"></div>
        </div>
        <div className="construction-crane">
          <div className="crane-arm"></div>
          <div className="crane-hook"></div>
        </div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 8. Simple Circular Spinner - Basic Default Loader
export const CircularSpinnerLoader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="circular-spinner-loader">
        <div className="spinner-circle"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 9. DNA Helix Loader - Modern Science-inspired
export const DNAHelixLoader = ({ message = "Processing..." }) => {
  return (
    <div className="loader-container">
      <div className="dna-helix-loader">
        <div className="dna-strand strand1"></div>
        <div className="dna-strand strand2"></div>
        <div className="dna-strand strand3"></div>
        <div className="dna-strand strand4"></div>
        <div className="dna-strand strand5"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 10. Neon Glow Loader - Futuristic Style
export const NeonGlowLoader = ({ message = "Initializing..." }) => {
  return (
    <div className="loader-container">
      <div className="neon-glow-loader">
        <div className="neon-ring ring1"></div>
        <div className="neon-ring ring2"></div>
        <div className="neon-ring ring3"></div>
        <div className="neon-core"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 11. Matrix Digital Rain Loader - Tech/Hacker Style
export const MatrixRainLoader = ({ message = "Connecting..." }) => {
  return (
    <div className="loader-container">
      <div className="matrix-rain-loader">
        <div className="matrix-column col1"></div>
        <div className="matrix-column col2"></div>
        <div className="matrix-column col3"></div>
        <div className="matrix-column col4"></div>
        <div className="matrix-column col5"></div>
        <div className="matrix-overlay">
          <div className="matrix-core"></div>
        </div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 12. Liquid Bubble Loader - Organic/Fluid Design
export const LiquidBubbleLoader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="liquid-bubble-loader">
        <div className="liquid-container">
          <div className="bubble bubble1"></div>
          <div className="bubble bubble2"></div>
          <div className="bubble bubble3"></div>
          <div className="bubble bubble4"></div>
          <div className="bubble bubble5"></div>
          <div className="liquid-base"></div>
        </div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 13. Geometric Triangles Loader - Modern Angular Design
export const GeometricTrianglesLoader = ({ message = "Processing..." }) => {
  return (
    <div className="loader-container">
      <div className="geometric-triangles-loader">
        <div className="triangle tri1"></div>
        <div className="triangle tri2"></div>
        <div className="triangle tri3"></div>
        <div className="triangle tri4"></div>
        <div className="triangle tri5"></div>
        <div className="triangle tri6"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 14. Particle System Loader - Science/Physics Inspired
export const ParticleSystemLoader = ({ message = "Calculating..." }) => {
  return (
    <div className="loader-container">
      <div className="particle-system-loader">
        <div className="particle-orbit orbit1">
          <div className="particle p1"></div>
          <div className="particle p2"></div>
        </div>
        <div className="particle-orbit orbit2">
          <div className="particle p3"></div>
          <div className="particle p4"></div>
        </div>
        <div className="particle-orbit orbit3">
          <div className="particle p5"></div>
          <div className="particle p6"></div>
        </div>
        <div className="particle-core"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 15. Glassmorphism Loader - Modern UI Trend
export const GlassmorphismLoader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="glassmorphism-loader">
        <div className="glass-card">
          <div className="glass-spinner"></div>
          <div className="glass-dots">
            <div className="glass-dot dot1"></div>
            <div className="glass-dot dot2"></div>
            <div className="glass-dot dot3"></div>
          </div>
        </div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 16. Payment Security Loader - Specialized for Payment Pages
export const PaymentSecurityLoader = ({ message = "Processing Payment..." }) => {
  return (
    <div className="loader-container">
      <div className="payment-security-loader">
        <div className="security-shield">
          <div className="shield-icon">🔒</div>
          <div className="security-scan scan1"></div>
          <div className="security-scan scan2"></div>
          <div className="security-scan scan3"></div>
        </div>
        <div className="payment-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="security-indicators">
            <div className="indicator active">✓</div>
            <div className="indicator loading">⟳</div>
            <div className="indicator pending">○</div>
          </div>
        </div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 17. Banking Transaction Loader - Professional Banking Style
export const BankingTransactionLoader = ({ message = "Securing Transaction..." }) => {
  return (
    <div className="loader-container">
      <div className="banking-transaction-loader">
        <div className="transaction-circle">
          <div className="bank-icon">🏦</div>
          <div className="transaction-ring ring1"></div>
          <div className="transaction-ring ring2"></div>
          <div className="transaction-ring ring3"></div>
        </div>
        <div className="transaction-steps">
          <div className="step completed">
            <div className="step-icon">✓</div>
            <span>Verified</span>
          </div>
          <div className="step processing">
            <div className="step-icon">⟳</div>
            <span>Processing</span>
          </div>
          <div className="step pending">
            <div className="step-icon">○</div>
            <span>Complete</span>
          </div>
        </div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 18. Booking Process Loader - For Reservation Process
export const BookingProcessLoader = ({ message = "Processing Booking..." }) => {
  return (
    <div className="loader-container">
      <div className="booking-process-loader">
        <div className="booking-circle">
          <div className="calendar-icon">📅</div>
          <div className="booking-ring ring1"></div>
          <div className="booking-ring ring2"></div>
          <div className="booking-ring ring3"></div>
        </div>
        <div className="booking-steps">
          <div className="step completed">
            <div className="step-icon">✓</div>
            <span>Select</span>
          </div>
          <div className="step processing">
            <div className="step-icon">⏳</div>
            <span>Book</span>
          </div>
          <div className="step pending">
            <div className="step-icon">📧</div>
            <span>Confirm</span>
          </div>
        </div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

// 19. Availability Check Loader - For Room/Bike Availability
export const AvailabilityCheckLoader = ({ message = "Checking Availability..." }) => {
  return (
    <div className="loader-container">
      <div className="availability-check-loader">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <div className="search-waves">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
        </div>
        <div className="availability-grid">
          <div className="slot available">✓</div>
          <div className="slot checking">⏳</div>
          <div className="slot unavailable">✗</div>
          <div className="slot checking">⏳</div>
          <div className="slot available">✓</div>
          <div className="slot checking">⏳</div>
        </div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};
