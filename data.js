const getUsers = [
  {
    "username": "testuser1",
    "email": "testuser1@test.com",
    "thoughts": [],
    "friends": [],
    "friendCount": 0
  },
  {
    "username": "testuser2",
    "email": "testuser2@test.com",
    "thoughts": [],
    "friends": [],
    "friendCount": 0
  },
  {
    "username": "testuser3",
    "email": "testuser3@test.com",
    "thoughts": [],
    "friends": [],
    "friendCount": 0
  }
]

const getThoughts = [
  {
    "thoughtText": "Test though string 1",
    "username": 1,
    "reactions": []
  },
  {
    "thoughtText": "Test though string 2",
    "username": 1,
    "reactions": []
  },
  {
    "thoughtText": "Test though string 3",
    "username": 1,
    "reactions": []
  },
  {
    "thoughtText": "Test though string 4",
    "username": 2,
    "reactions": []
  },
  {
    "thoughtText": "Test though string 5",
    "username": 3,
    "reactions": []
  }
]

const getReactions = [
  {
    "reactionBody": "Test though string 1",
    "createdAt": 1,
    "username": 1,
  },
  {
    "reactionBody": "Test though string 2",
    "createdAt": 1,
    "username": 1,
  },
  {
    "reactionBody": "Test though string 3",
    "createdAt": 1,
    "username": 1,
  },
  {
    "reactionBody": "Test though string 4",
    "createdAt": 1,
    "username": 1,
  },
  {
    "reactionBody": "Test though string 5",
    "createdAt": 1,
    "username": 1,
  }
]

// Export the functions for use in seed.js
module.exports = { getUsers, getThoughts, getReactions };
