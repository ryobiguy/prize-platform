import React from 'react';
import { FileText } from 'lucide-react';
import './Legal.css';

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="container">
          <FileText size={48} />
          <h1>Terms & Conditions</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="container">
        <div className="legal-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Total Raffle ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to these Terms & Conditions, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>You must be at least 18 years old to use this Platform. By using the Platform, you represent and warrant that:</p>
            <ul>
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>You are not prohibited from using the Platform under UK law</li>
              <li>All information you provide is accurate and truthful</li>
            </ul>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <p>To participate in prize draws, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h3>3.2 Account Restrictions</h3>
            <p>You may only create one account. Multiple accounts per person are prohibited and may result in account termination.</p>
          </section>

          <section>
            <h2>4. How the Platform Works</h2>
            <h3>4.1 Earning Entries</h3>
            <p>Users earn entries by:</p>
            <ul>
              <li>Completing tasks (social media follows, surveys, etc.)</li>
              <li>Watching video advertisements</li>
              <li>Completing offers from third-party providers</li>
              <li>Receiving promotional bonuses</li>
            </ul>

            <h3>4.2 Using Entries</h3>
            <p>Entries can be used to enter prize draws. Once entries are used for a draw, they cannot be refunded or transferred.</p>

            <h3>4.3 Entry Validity</h3>
            <p>Entries do not expire but can only be used for active prize draws.</p>
          </section>

          <section>
            <h2>5. Prize Draws</h2>
            <h3>5.1 Draw Schedule</h3>
            <p>Prize draws are conducted weekly, typically on Fridays at 8:00 PM GMT, unless otherwise stated.</p>

            <h3>5.2 Minimum Entry Requirements</h3>
            <p>
              Each prize draw has a minimum entry requirement. If the minimum is not met by the draw date, 
              the draw may be postponed or cancelled, and entries will be refunded to participants.
            </p>

            <h3>5.3 Winner Selection</h3>
            <p>
              Winners are selected randomly using a provably fair algorithm. More entries increase your chances 
              of winning but do not guarantee a win.
            </p>

            <h3>5.4 Winner Notification</h3>
            <p>
              Winners will be notified via email within 48 hours of the draw. Winners must respond within 7 days 
              to claim their prize, or the prize may be forfeited.
            </p>
          </section>

          <section>
            <h2>6. Prizes</h2>
            <h3>6.1 Prize Fulfillment</h3>
            <p>Prizes will be delivered within 30 days of winner confirmation. Physical prizes are shipped to UK addresses only unless otherwise stated.</p>

            <h3>6.2 Prize Substitution</h3>
            <p>We reserve the right to substitute prizes of equal or greater value if the advertised prize becomes unavailable.</p>

            <h3>6.3 Taxes</h3>
            <p>Winners are responsible for any taxes associated with prize winnings as required by law.</p>
          </section>

          <section>
            <h2>7. Prohibited Activities</h2>
            <p>You agree NOT to:</p>
            <ul>
              <li>Create multiple accounts or use fake identities</li>
              <li>Use bots, scripts, or automated tools to earn entries</li>
              <li>Manipulate or attempt to manipulate the draw system</li>
              <li>Engage in fraudulent activity</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Reverse engineer or attempt to access our systems</li>
              <li>Share or sell your account</li>
            </ul>
          </section>

          <section>
            <h2>8. Account Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for:</p>
            <ul>
              <li>Violation of these Terms & Conditions</li>
              <li>Fraudulent or suspicious activity</li>
              <li>Providing false information</li>
              <li>Any other reason at our sole discretion</li>
            </ul>
            <p>Upon termination, you forfeit all entries and any unclaimed prizes.</p>
          </section>

          <section>
            <h2>9. Intellectual Property</h2>
            <p>
              All content on the Platform, including text, graphics, logos, images, and software, is the property of 
              Total Raffle or its licensors and is protected by copyright and trademark laws.
            </p>
            <p>You may not reproduce, distribute, or create derivative works without our express written permission.</p>
          </section>

          <section>
            <h2>10. Third-Party Services</h2>
            <p>
              The Platform integrates with third-party services (advertising networks, offer walls, payment processors). 
              We are not responsible for the actions, content, or privacy practices of these third parties.
            </p>
          </section>

          <section>
            <h2>11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Total Raffle shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, or any loss of profits or revenues.
            </p>
            <p>Our total liability shall not exceed the value of entries in your account or £100, whichever is less.</p>
          </section>

          <section>
            <h2>12. Disclaimers</h2>
            <p>The Platform is provided "as is" without warranties of any kind. We do not guarantee:</p>
            <ul>
              <li>Uninterrupted or error-free operation</li>
              <li>That defects will be corrected</li>
              <li>That the Platform is free from viruses or harmful components</li>
              <li>The accuracy or reliability of any information</li>
            </ul>
          </section>

          <section>
            <h2>13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Total Raffle from any claims, damages, losses, liabilities, 
              and expenses arising from your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section>
            <h2>14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of the Platform constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2>15. Governing Law</h2>
            <p>
              These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the 
              exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2>16. Contact Information</h2>
            <p>For questions about these Terms & Conditions, please contact us at:</p>
            <p>
              <strong>Email:</strong> legal@totalraffle.com<br />
              <strong>Address:</strong> [Your Business Address]
            </p>
          </section>

          <section>
            <h2>17. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section>
            <h2>18. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and Total Raffle regarding the use of the Platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
