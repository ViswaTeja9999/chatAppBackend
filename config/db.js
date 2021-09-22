import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true,
    });
    console.log(`Database connected host ${con.connection.host}`.cyan.bold);
  } catch (error) {
    console.log(
      `Database not connected Error: ${error.message}`.red.underline.bold
    );
    process.exit(1);
  }
};

export default connectdb;