# OAuth Setup Guide

## Google Sign-In Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Prize Platform
   - User support email: your email
   - Developer contact: your email
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: Prize Platform Web
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:5000`
   - Authorized redirect URIs:
     - `http://localhost:3000`
     - `http://localhost:3000/login`
     - `http://localhost:3000/register`

### 2. Update Configuration

1. Copy your **Client ID**
2. Update `client/src/App.js`:
   ```javascript
   <GoogleOAuthProvider clientId="YOUR_ACTUAL_CLIENT_ID_HERE">
   ```

3. Update `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   ```

## Apple Sign-In Setup

### 1. Apple Developer Account Required

1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with Apple ID
3. Go to **Certificates, Identifiers & Profiles**
4. Create a new **App ID**:
   - Description: Prize Platform
   - Bundle ID: com.yourcompany.prizeplatform
   - Enable **Sign in with Apple**

### 2. Create Service ID

1. Go to **Identifiers** → **Services IDs**
2. Create new Service ID:
   - Description: Prize Platform Web
   - Identifier: com.yourcompany.prizeplatform.web
   - Enable **Sign in with Apple**
   - Configure domains:
     - Domains: `localhost`
     - Return URLs: `http://localhost:3000/login`

### 3. Add Apple Sign-In Script

Add to `client/public/index.html` before `</head>`:

```html
<script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
<script>
  AppleID.auth.init({
    clientId: 'com.yourcompany.prizeplatform.web',
    scope: 'name email',
    redirectURI: 'http://localhost:3000/login',
    usePopup: true
  });
</script>
```

## Testing OAuth

### Google Sign-In
1. Click "Sign in with Google" button
2. Select your Google account
3. Grant permissions
4. You'll be redirected to dashboard with 10 free entries!

### Apple Sign-In
1. Click "Sign in with Apple" button
2. Enter Apple ID credentials
3. Choose to share or hide email
4. Grant permissions
5. You'll be redirected to dashboard with 10 free entries!

## Production Setup

### For Production Deployment:

1. **Google OAuth**:
   - Add production domain to Authorized JavaScript origins
   - Add production URLs to Authorized redirect URIs
   - Update `GOOGLE_CLIENT_ID` in production environment

2. **Apple Sign-In**:
   - Update Service ID with production domain
   - Update Return URLs with production URLs
   - Configure proper SSL certificates

## Troubleshooting

### Google Sign-In Issues
- **Error: redirect_uri_mismatch**: Add the exact URL to Authorized redirect URIs
- **Error: idpiframe_initialization_failed**: Check if third-party cookies are enabled
- **Error: popup_closed_by_user**: User closed the popup, they can try again

### Apple Sign-In Issues
- **Error: popup_closed_by_user**: User closed the popup
- **Error: invalid_client**: Check Service ID configuration
- **AppleID is not defined**: Ensure Apple script is loaded in index.html

## Security Notes

- Never commit OAuth credentials to version control
- Use environment variables for sensitive data
- Implement HTTPS in production
- Regularly rotate OAuth secrets
- Monitor OAuth usage in respective consoles
