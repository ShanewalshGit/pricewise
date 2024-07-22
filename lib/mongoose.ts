import mongoose from 'mongoose';

let isConnected = false; // variable to tract connection status

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URI) {
        return console.log('MongoDB_URI not found');
    }

    if(isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (error) {
        console.log(error);
    }
}