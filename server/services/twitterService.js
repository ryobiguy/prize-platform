const axios = require('axios');

// Twitter API v2 verification functions
// Note: You'll need to set up Twitter API credentials in .env

const verifyTwitterFollow = async (user, accountToFollow) => {
  try {
    // Check if user has connected Twitter account
    if (!user.socialAccounts?.twitter?.username) {
      return false;
    }

    // In production, use Twitter API to verify follow
    // For now, return true for testing
    // const response = await axios.get(
    //   `https://api.twitter.com/2/users/${user.socialAccounts.twitter.username}/following`,
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    //     }
    //   }
    // );
    
    // Check if accountToFollow is in the following list
    // return response.data.data.some(account => account.username === accountToFollow);
    
    // For testing purposes
    console.log(`Verifying Twitter follow: ${user.socialAccounts.twitter.username} -> ${accountToFollow}`);
    return true;
  } catch (error) {
    console.error('Twitter follow verification error:', error);
    return false;
  }
};

const verifyTwitterRetweet = async (user, postUrl) => {
  try {
    if (!user.socialAccounts?.twitter?.username) {
      return false;
    }

    // Extract tweet ID from URL
    const tweetId = postUrl.split('/').pop();
    
    // In production, use Twitter API to verify retweet
    // const response = await axios.get(
    //   `https://api.twitter.com/2/tweets/${tweetId}/retweeted_by`,
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    //     }
    //   }
    // );
    
    // return response.data.data.some(account => account.username === user.socialAccounts.twitter.username);
    
    console.log(`Verifying Twitter retweet: ${user.socialAccounts.twitter.username} -> ${tweetId}`);
    return true;
  } catch (error) {
    console.error('Twitter retweet verification error:', error);
    return false;
  }
};

const verifyTwitterLike = async (user, postUrl) => {
  try {
    if (!user.socialAccounts?.twitter?.username) {
      return false;
    }

    const tweetId = postUrl.split('/').pop();
    
    // In production, use Twitter API to verify like
    console.log(`Verifying Twitter like: ${user.socialAccounts.twitter.username} -> ${tweetId}`);
    return true;
  } catch (error) {
    console.error('Twitter like verification error:', error);
    return false;
  }
};

module.exports = {
  verifyTwitterFollow,
  verifyTwitterRetweet,
  verifyTwitterLike
};
