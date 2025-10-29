/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const start = async () => {
  console.log('Connecting to MongoDB...', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const PAYMENT_METHODS = [
    { name: 'TUNAI' },
    { name: 'TRANSFER' },
    { name: 'QRIS' },
    { name: 'DEBIT' },
    { name: 'KREDIT' },
  ];

  const paymentMethodCollection = mongoose.connection.db.collection('payment_methods');

  let counter = 0;
  for (const method of PAYMENT_METHODS) {
    console.log('Upserting payment method', method);

    await paymentMethodCollection.findOneAndUpdate(
      { name: method.name },
      {
        $set: {
          ...method,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
    counter++;
  }

  console.log(`Generated ${counter} payment methods!`);
  process.exit(0);
};

start();
