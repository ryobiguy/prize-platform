import React from 'react';
import { Shield } from 'lucide-react';
import './Legal.css';

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="container">
          <Shield size={48} />
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="container">
        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Total Raffle ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our Platform.
            </p>
            <p>
              By using the Platform, you consent to the data practices described in this policy.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <p>We collect information that you voluntarily provide when you:</p>
            <ul>
              <li><strong>Create an Account:</strong> Name, email address, username, password</li>
              <li><strong>Complete Your Profile:</strong> Date of birth, location, preferences</li>
              <li><strong>Claim Prizes:</strong> Shipping address, phone number</li>
              <li><strong>Contact Us:</strong> Any information in your communications</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <p>When you use the Platform, we automatically collect:</p>
            <ul>
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, features used</li>
              <li><strong>Cookies:</strong> Session data, preferences, authentication tokens</li>
              <li><strong>Location Data:</strong> General geographic location based on IP address</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <p>We may receive information from:</p>
            <ul>
              <li><strong>Advertising Partners:</strong> Offer completion data, engagement metrics</li>
              <li><strong>Analytics Providers:</strong> Usage statistics, demographics</li>
              <li><strong>Social Media:</strong> If you connect social accounts for tasks</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Process prize entries and conduct draws</li>
              <li>Award and deliver prizes</li>
              <li>Track task completions and credit entries</li>
              <li>Send important notifications (winner announcements, account updates)</li>
              <li>Improve and personalize the Platform</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns and trends</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2>4. Legal Basis for Processing (GDPR)</h2>
            <p>We process your personal data under the following legal bases:</p>
            <ul>
              <li><strong>Contract Performance:</strong> To provide our services and fulfill prize draws</li>
              <li><strong>Legitimate Interests:</strong> To improve our Platform, prevent fraud, and ensure security</li>
              <li><strong>Consent:</strong> For marketing communications and optional features</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2>5. How We Share Your Information</h2>
            
            <h3>5.1 Third-Party Service Providers</h3>
            <p>We share information with trusted partners who help us operate the Platform:</p>
            <ul>
              <li><strong>Advertising Networks:</strong> To serve ads and track offer completions</li>
              <li><strong>Analytics Providers:</strong> To understand usage and improve services</li>
              <li><strong>Email Services:</strong> To send notifications and communications</li>
              <li><strong>Payment Processors:</strong> To handle prize fulfillment</li>
              <li><strong>Hosting Providers:</strong> To store data and run the Platform</li>
            </ul>

            <h3>5.2 Legal Requirements</h3>
            <p>We may disclose your information if required by law or to:</p>
            <ul>
              <li>Comply with legal processes or government requests</li>
              <li>Enforce our Terms & Conditions</li>
              <li>Protect our rights, property, or safety</li>
              <li>Prevent fraud or illegal activity</li>
            </ul>

            <h3>5.3 Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, or sale of assets, your information may be transferred. 
              We will notify you before your information becomes subject to a different privacy policy.
            </p>

            <h3>5.4 Public Information</h3>
            <p>
              Winner information (first name and last initial) may be displayed publicly on our Winners page. 
              Full names are never disclosed without consent.
            </p>
          </section>

          <section>
            <h2>6. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
              <li>Serve relevant advertisements</li>
              <li>Prevent fraud</li>
            </ul>
            <p>
              You can control cookies through your browser settings. However, disabling cookies may limit 
              your ability to use certain features of the Platform.
            </p>
          </section>

          <section>
            <h2>7. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your data:</p>
            <ul>
              <li>Encryption of data in transit (HTTPS/SSL)</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>8. Data Retention</h2>
            <p>We retain your information for as long as:</p>
            <ul>
              <li>Your account is active</li>
              <li>Needed to provide services</li>
              <li>Required by law</li>
              <li>Necessary for legitimate business purposes</li>
            </ul>
            <p>
              After account deletion, we may retain certain information for legal compliance, fraud prevention, 
              and dispute resolution.
            </p>
          </section>

          <section>
            <h2>9. Your Rights (GDPR & UK GDPR)</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing or optional processing</li>
              <li><strong>Complain:</strong> Lodge a complaint with the ICO (UK) or your local data protection authority</li>
            </ul>
            <p>To exercise these rights, contact us at privacy@totalraffle.com</p>
          </section>

          <section>
            <h2>10. Children's Privacy</h2>
            <p>
              The Platform is not intended for users under 18 years of age. We do not knowingly collect information 
              from children. If we discover that we have collected data from a child, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries outside the UK/EU. We ensure 
              appropriate safeguards are in place, such as:
            </p>
            <ul>
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions by the European Commission</li>
              <li>Privacy Shield certification (where applicable)</li>
            </ul>
          </section>

          <section>
            <h2>12. Marketing Communications</h2>
            <p>
              With your consent, we may send you promotional emails about new prizes, features, and special offers. 
              You can unsubscribe at any time by:
            </p>
            <ul>
              <li>Clicking the "unsubscribe" link in emails</li>
              <li>Updating your account preferences</li>
              <li>Contacting us at privacy@totalraffle.com</li>
            </ul>
            <p>Note: You cannot opt out of essential service emails (e.g., winner notifications, account security).</p>
          </section>

          <section>
            <h2>13. Third-Party Links</h2>
            <p>
              The Platform may contain links to third-party websites or services. We are not responsible for 
              their privacy practices. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2>14. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by:
            </p>
            <ul>
              <li>Posting the new policy on the Platform</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending an email notification (for material changes)</li>
            </ul>
            <p>Your continued use after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2>15. Contact Us</h2>
            <p>For questions, concerns, or to exercise your rights, contact us at:</p>
            <p>
              <strong>Email:</strong> privacy@totalraffle.com<br />
              <strong>Data Protection Officer:</strong> dpo@totalraffle.com<br />
              <strong>Address:</strong> [Your Business Address]
            </p>
          </section>

          <section>
            <h2>16. Supervisory Authority</h2>
            <p>
              If you are in the UK/EU and have concerns about how we handle your data, you can contact the 
              Information Commissioner's Office (ICO):
            </p>
            <p>
              <strong>Website:</strong> https://ico.org.uk/<br />
              <strong>Phone:</strong> 0303 123 1113
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
