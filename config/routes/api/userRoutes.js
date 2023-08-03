const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateSingleUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/')
  .get(getUsers)
  .post(createUser);

// /api/users/:userId
router.route('/:userId')
  .get(getSingleUser)
  .delete(deleteUser)
  .put(updateSingleUser);

// /api/users/:userId/friend/:friendId
router.route('/:userId/friends/:friendId')
  .put(addFriend)
  .delete(deleteFriend)

module.exports = router;
