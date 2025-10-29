/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const start = async () => {
  console.log('Connecting to MongoDB...', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const CUSTOMERS = [
    {
      name: 'Umum',
      address: 'N/A',
      phone: '0000000000',
      email: 'umum@example.com',
      is_active: true,
    },
    {
      name: 'John Doe',
      address: 'Jl. Contoh No. 123',
      phone: '081234567890',
      email: 'john.doe@example.com',
      is_active: true,
    },
  ];

  const customerCollection = mongoose.connection.db.collection('customers');

  let counter = 0;
  for (const customer of CUSTOMERS) {
    console.log('Upserting customer', customer.email);

    await customerCollection.findOneAndUpdate(
      { email: customer.email },
      {
        $set: {
          ...customer,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
    counter++;
  }

  console.log(`Generated ${counter} customers!`);
  process.exit(0);
};

start();
