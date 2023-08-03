const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { getUsers, getThoughts, getReactions } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }

  let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection('thoughts');
  }

  await User.collection.insertMany(getUsers);
  await Thought.collection.insertMany(getThoughts);

  // const users = await User.find();
  // const id = users[1]._id
  // let user = await User.find({
  //   _id: id
  // })
  // user = {...user}
  // console.log(user.email)



  // Log out the seed data to indicate what should appear in the database
  console.table(getUsers)
  // console.table(getThoughts)
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
