import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }
})
export const Purchase = mongoose.model("Purchase", purchaseSchema);