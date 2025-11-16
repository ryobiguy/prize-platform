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
            <h3>4.1 Purchasing Entries</h3>
            <p>Users purchase entries through our secure payment system. Available entry packages:</p>
            <ul>
              <li>Starter Pack: 100 entries for £0.99</li>
              <li>Popular Pack: 525 entries (500 + 25 bonus) for £3.99</li>
              <li>Mega Pack: 1,100 entries (1,000 + 100 bonus) for £6.99</li>
              <li>Ultimate Pack: 1,500 entries (1,200 + 300 bonus) for £14.99</li>
            </ul>

            <h3>4.2 Payment Processing</h3>
            <p>All payments are processed securely through Square. We do not store payment card details.</p>

            <h3>4.3 Using Entries</h3>
            <p>Entries can be used to enter prize draws. Once entries are used for a draw, they cannot be refunded or transferred.</p>

            <h3>4.4 Entry Validity</h3>
            <p>Purchased entries do not expire and can be used for any active prize draws.</p>

            <h3>4.5 No Refunds</h3>
            <p>Due to the digital nature of entries, all sales are final. Entries cannot be refunded once purchased.</p>
          </section>

          <section>
            <h2>5. Prize Competitions & Draws</h2>
            <h3>5.1 Legal Basis</h3>
            <p>
              Total Raffle operates as a prize competition platform under UK law. This is a commercial venture 
              where participants pay to enter prize draws with predetermined odds.
            </p>

            <h3>5.2 Draw Schedule</h3>
            <p>Prize draws are conducted as advertised on each prize page, typically weekly unless otherwise stated.</p>

            <h3>5.3 Minimum Entry Requirements</h3>
            <p>
              Each prize draw has a minimum entry requirement to proceed. If the minimum is not met by the draw date, 
              the draw will be cancelled and all entries will be refunded to participants' accounts.
            </p>

            <h3>5.4 Winner Selection</h3>
            <p>
              Winners are selected randomly using a cryptographically secure random number generator. 
              More entries increase your chances of winning but do not guarantee a win. 
              The odds of winning depend on the total number of entries in each draw.
            </p>

            <h3>5.5 Winner Notification</h3>
            <p>
              Winners will be notified via email and displayed on our Winners page within 48 hours of the draw. 
              Winners must respond within 14 days to claim their prize, or the prize may be re-drawn.
            </p>

            <h3>5.6 Responsible Gaming</h3>
            <p>
              We promote responsible participation. Please only spend what you can afford. 
              If you feel you have a gambling problem, please seek help from organizations like GamCare.
            </p>
          </section>

          <section>
            <h2>6. Prizes</h2>
            <h3>6.1 Prize Fulfillment</h3>
            <p>Prizes will be delivered within 30 days of winner confirmation. Physical prizes are shipped to UK addresses only unless otherwise stated.</p>

            <h3>6.2 Prize Substitution</h3>
            <p>We reserve the right to substitute prizes of equal or greater value if the advertised prize becomes unavailable.</p>

            <h3>6.3 Tax Obligations</h3>
            <p>Winners are responsible for any tax obligations on prizes valued over £500. We will provide necessary documentation.</p>
          </section>

          <section>
            <h2>7. Age Verification & Restrictions</h2>
            <h3>7.1 Age Requirements</h3>
            <p>You must be 18 years or older to purchase entries or participate in prize draws. We may request age verification documents.</p>

            <h3>7.2 Geographic Restrictions</h3>
            <p>This service is available to UK residents only. Prizes can only be shipped to UK addresses.</p>

            <h3>7.3 Excluded Persons</h3>
            <p>Employees of Total Raffle and their immediate family members are not eligible to participate.</p>
          </section>

          <section>
            <h2>8. Payment Terms</h2>
            <h3>8.1 Accepted Payment Methods</h3>
            <p>We accept major credit/debit cards, Apple Pay, and Google Pay through our secure payment processor.</p>

            <h3>8.2 Payment Security</h3>
            <p>All payment data is processed securely and we do not store your payment card details.</p>

            <h3>8.3 Failed Payments</h3>
            <p>If a payment fails, entries will not be credited to your account until payment is successfully processed.</p>
          </section>

          <section>
            <h2>9. Data Protection & Privacy</h2>
            <p>
              We process your personal data in accordance with UK GDPR and our Privacy Policy. 
              By using our service, you consent to such processing and warrant that all data provided is accurate.
            </p>
          </section>

          <section>
            <h2>10. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Create multiple accounts</li>
              <li>Use automated systems or bots</li>
              <li>Attempt to manipulate or interfere with the platform</li>
              <li>Engage in fraudulent activity</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2>11. Limitation of Liability</h2>
            <p>
              Total Raffle's liability is limited to the amount you have paid for entries. 
              We are not liable for any indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2>13. Contact Information</h2>
            <p>For questions about these Terms & Conditions, please contact us at:</p>
            <p>
              <strong>Email:</strong> legal@totalraffle.com<br />
              <strong>Address:</strong> [Your Business Address]
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
            <h2>15. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and Total Raffle regarding the use of the Platform 
              and supersede all prior agreements and understandings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
