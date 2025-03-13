import React from 'react';
import './Home.css';  // Custom CSS file for styling

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Welcome to the Future of Blockchain</h1>
          <p>Empowering decentralized applications with cutting-edge technology.</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Information Sections */}
      <section className="info-sections">
        <div className="info-card">
          <img src="https://ventionteams.com/_next/image?url=https%3A%2F%2Fventionteams.com%2Fmedia%2Foriginal_images%2FBlockchain_for_payments_and_its_advantages_00_hero.jpg&w=1600&q=75" alt="Blockchain" />
          <div className='info-card-details'>
            <h3>What is Blockchain?</h3>
            <p>Blockchain is a decentralized and distributed digital ledger that records transactions across multiple computers.</p>
          </div>
        </div>
        <div className="info-card">
          <div className='info-card-details'>
            <h3>Security and Trust</h3>
            <p style={{marginBottom:'15px'}}>Blockchain security is a comprehensive risk management system for a blockchain network. It uses cybersecurity frameworks, assurance services and best practices to reduce risks against attacks and fraud.</p>
            <p>Blockchain ensures secure and transparent transactions without the need for intermediaries.</p>
          </div>
          <img src="https://www.nokia.com/sites/default/files/2022-01/cybersecurity4_0.jpg?height=600&width=1920&resize=1" alt="Security" />
        </div>
        <div className="info-card">
          <img src="https://cmr.berkeley.edu/assets/images/blog/adobestock_1006833741.jpeg" alt="Decentralized" />
          <div className='info-card-details'>
            <h3>Decentralization</h3>
            <p>Decentralization empowers individuals, reduces risk, and fosters transparency.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-card">
          <h2>10000+ </h2>
          <p>Wallets Created</p>
        </div>
        <div className="stats-card">
          <h2>500/hr</h2>
          <p>Transactions Per Hour</p>
        </div>
        <div className="stats-card">
          <h2>24/7</h2>
          <p>Uptime</p>
        </div>
        <div className="stats-card">
          <h2>100%</h2>
          <p>Blockchain Security</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Blockchain Revolution</p>
      </footer>
    </div>
  );
};

export default HomePage;
