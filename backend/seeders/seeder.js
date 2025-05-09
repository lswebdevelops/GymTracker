import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from '../data/users.js';
import trainingTypes from './data/trainingTypes.js';
import User from '../models/userModel.js';
import trainingType from '../models/trainingTypeModel.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await TrainingType.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleTrainingTypes = trainingTypes.map((trainingType) => {
      return { ...trainingType, user: adminUser };
    });

    await TrainingType.insertMany(sampleTrainingTypes);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
   
    await TrainingType.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
