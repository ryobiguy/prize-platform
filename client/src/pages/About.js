import React from 'react';
import { Trophy, Users, Target, Heart } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>About Total Raffle</h1>
          <p>Your trusted platform for winning amazing prizes</p>
        </div>
      </div>

      <div className="container">
        <div className="story-section">
          <h2>Our Story</h2>
          <p>
            Total Raffle was founded with a simple mission: to give everyone a fair chance to win amazing prizes 
            without spending money. We believe that winning should be accessible to all, which is why we created 
            a platform where you can earn entries by completing simple tasks.
          </p>
          <p>
            Since our launch, we've given away over £50,000 in prizes to hundreds of lucky winners across the UK. 
            Our community continues to grow every day, and we're committed to making the prize-winning experience 
            fair, transparent, and exciting for everyone.
          </p>
        </div>

        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Trophy size={40} />
              </div>
              <h3>Fair & Transparent</h3>
              <p>Every draw is conducted fairly using random selection. We believe in complete transparency in how winners are chosen.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Users size={40} />
              </div>
              <h3>Community First</h3>
              <p>Our users are at the heart of everything we do. We listen to feedback and constantly improve the platform.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Target size={40} />
              </div>
              <h3>Always Free</h3>
              <p>We're committed to keeping our platform free. You'll never be asked to pay to participate in prize draws.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Heart size={40} />
              </div>
              <h3>Trust & Security</h3>
              <p>Your data is safe with us. We use industry-standard security and never share your information with third parties.</p>
            </div>
          </div>
        </div>

        <div className="stats-showcase">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Winners</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">£50K+</div>
              <div className="stat-label">Prizes Given</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Prizes Available</div>
            </div>
          </div>
        </div>

        <div className="mission-section">
          <h2>Our Mission</h2>
          <p>
            To create the most trusted and exciting prize platform in the UK, where everyone has a fair chance 
            to win amazing prizes through simple, engaging tasks. We're building a community of winners, and 
            we want you to be part of it.
          </p>
          <div className="cta-box">
            <h3>Ready to Start Winning?</h3>
            <a href="/register" className="cta-btn">Join Total Raffle Today</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
