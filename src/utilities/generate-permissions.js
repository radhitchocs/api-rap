/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const mongoose = require('mongoose');
const permissionsData = require('./permissions.json');

const MONGODB_URI = process.env.MONGODB_URI;

const start = async () => {
  console.log('Connecting to MongoDB...', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const Permission = mongoose.model(
    'Permission',
    new mongoose.Schema(
      {
        name: String,
        label: String,
        description: String,
        createdAt: Date,
        updatedAt: Date,
      },
      { timestamps: true },
    ),
  );

  const roleCollection = mongoose.connection.db.collection('roles');

  let counter = 0;
  const allPermissions = [];
  for (const [moduleName, actions] of Object.entries(permissionsData)) {
    for (const action of actions) {
      const permissionName = `${moduleName}.${action}`;
      const permissionLabel = `${action.charAt(0).toUpperCase() + action.slice(1)} ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;

      await Permission.findOneAndUpdate(
        { name: permissionName },
        {
          $set: {
            name: permissionName,
            label: permissionLabel,
            description: `Permission to ${action} ${moduleName}`,
          },
        },
        { upsert: true },
      );
      allPermissions.push(permissionName);
      counter++;
    }
  }

  const DEFAULT_ROLES = ['ADMIN', 'KASIR'];

  for (const role of DEFAULT_ROLES) {
    await roleCollection.findOneAndUpdate(
      {
        name: role,
      },
      {
        $set: {
          name: role,
          permissions: allPermissions,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
      },
    );
  }

  console.log(`Generated ${counter} permissions!`);
  process.exit(0);
};

start();
