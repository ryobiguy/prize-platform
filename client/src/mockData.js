// Mock data for testing without MongoDB

export const mockPrizes = [
  {
    _id: '1',
    title: '£500 Cash Prize',
    description: 'Win £500 in cash! Complete simple tasks to earn entries and increase your chances of winning this amazing cash prize. Winner will be contacted via email. Draw date: Friday, 17th October 2025.',
    type: 'cash',
    value: 500,
    currency: 'GBP',
    imageUrl: '',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 100,
    startDate: new Date().toISOString(),
    endDate: new Date('2025-10-17T23:59:59').toISOString(),
    status: 'active',
    featured: true,
    totalEntries: 245,
    participants: []
  },
  {
    _id: '2',
    title: 'iPhone 15 Pro',
    description: 'Win the latest iPhone 15 Pro! This premium smartphone features cutting-edge technology and an amazing camera system. Enter now for your chance to win!',
    type: 'electronics',
    value: 999,
    currency: 'GBP',
    imageUrl: '',
    totalWinners: 1,
    entryCost: 2,
    maxEntriesPerUser: 50,
    startDate: new Date().toISOString(),
    endDate: new Date('2025-10-25T23:59:59').toISOString(),
    status: 'active',
    featured: true,
    totalEntries: 512,
    participants: []
  },
  {
    _id: '3',
    title: 'Amazon Gift Card £100',
    description: 'Win a £100 Amazon gift card! Shop for anything you want on Amazon with this versatile prize. Perfect for treating yourself or buying gifts.',
    type: 'gift_card',
    value: 100,
    currency: 'GBP',
    imageUrl: '',
    totalWinners: 3,
    entryCost: 1,
    maxEntriesPerUser: 75,
    startDate: new Date().toISOString(),
    endDate: new Date('2025-10-20T23:59:59').toISOString(),
    status: 'active',
    featured: true,
    totalEntries: 892,
    participants: []
  },
  {
    _id: '4',
    title: 'PlayStation 5',
    description: 'Win a brand new PlayStation 5 console! Experience next-gen gaming with incredible graphics and exclusive titles. Includes one controller.',
    type: 'electronics',
    value: 479,
    currency: 'GBP',
    imageUrl: '',
    totalWinners: 1,
    entryCost: 2,
    maxEntriesPerUser: 100,
    startDate: new Date().toISOString(),
    endDate: new Date('2025-10-30T23:59:59').toISOString(),
    status: 'active',
    featured: false,
    totalEntries: 678,
    participants: []
  },
  {
    _id: '5',
    title: '£1000 Cash Prize',
    description: 'Our biggest cash prize yet! Win £1000 to spend however you like. Complete tasks to earn entries and increase your chances of winning big!',
    type: 'cash',
    value: 1000,
    currency: 'GBP',
    imageUrl: '',
    totalWinners: 1,
    entryCost: 3,
    maxEntriesPerUser: 150,
    startDate: new Date().toISOString(),
    endDate: new Date('2025-11-01T23:59:59').toISOString(),
    status: 'active',
    featured: false,
    totalEntries: 1234,
    participants: []
  },
  {
    _id: '6',
    title: 'Apple AirPods Pro',
    description: 'Win Apple AirPods Pro with active noise cancellation! Premium wireless earbuds with exceptional sound quality and comfort.',
    type: 'electronics',
    value: 249,
    currency: 'GBP',
    imageUrl: '',
    totalWinners: 2,
    entryCost: 1,
    maxEntriesPerUser: 50,
    startDate: new Date().toISOString(),
    endDate: new Date('2025-10-22T23:59:59').toISOString(),
    status: 'active',
    featured: false,
    totalEntries: 456,
    participants: []
  }
];

export const mockTasks = [
  {
    _id: '1',
    title: 'Follow us on Twitter',
    description: 'Follow @TotalRaffle on Twitter to earn 5 entries',
    type: 'twitter_follow',
    platform: 'twitter',
    entriesReward: 5,
    verificationData: {
      accountToFollow: 'TotalRaffle'
    },
    isActive: true,
    isRepeatable: false,
    completed: false,
    canComplete: true
  },
  {
    _id: '2',
    title: 'Daily Login Bonus',
    description: 'Login every day to earn 2 free entries',
    type: 'daily_login',
    platform: 'internal',
    entriesReward: 2,
    verificationData: {},
    isActive: true,
    isRepeatable: true,
    completed: false,
    canComplete: true
  },
  {
    _id: '3',
    title: 'Watch a Short Ad',
    description: 'Watch a 30-second advertisement to earn 3 entries',
    type: 'watch_ad',
    platform: 'internal',
    entriesReward: 3,
    verificationData: {
      adProvider: 'google',
      adDuration: 30
    },
    isActive: true,
    isRepeatable: true,
    completed: false,
    canComplete: true
  }
];
