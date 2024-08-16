/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const MONGODB_URI = process.env.MONGODB_URI;

const start = async () => {
  console.log('Connecting to MongoDB...', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const USERS = [
    {
      name: 'Admin',
      username: 'admin',
      email: 'admin@example.com',
      roles: ['ADMIN'],
    },
    {
      name: 'Kasir',
      username: 'kasir',
      email: 'kasir@example.com',
      roles: ['KASIR'],
    },
  ];

  const userCollection = mongoose.connection.db.collection('users');
  const secretKey = 10;
  const defaultPassword = await bcrypt.hash('rahasia', secretKey);

  let counter = 0;
  for (const user of USERS) {
    console.log('Generating user for', user);
    user.password = defaultPassword;

    await userCollection.findOneAndUpdate(
      {
        username: user.username,
      },
      {
        $set: {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
      },
    );
    counter++;
  }

  console.log(`Generated ${counter} users!`);
  process.exit(0);
};

start();
