import mongoose from "mongoose";
 

const bookingSchema = new mongoose.Schema({
    property:{
        type: mongoose.Schema.ObjectId,
        ref :"Property",
        req :[true,"Booking must belong to a property"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        req:[true,"Booking must belong to the user"]
    },
    price:{
        type:Number,
        req:[true,"Booking must have a price"]

    },
    createdAt:{
        type:Date,
        default:Date.now();

    },
    paid:{
        type:Boolean,
        default:true
    },
    fromDate:{
        type:Date
    },
    toDate:{
        type:Date
    },
    guests:{
        type:Number,
        default:1

    },
    numberOfnights:{
        type:Number,
        default:1
    }
},
{timestamps:true}

);


bookingSchema.pre(/^find/, function(next){
    this.populate("user".populate({
        path:property,
        select: " maximumGuest propertyName roomType images address"

    }));

    next();
});
const Booking = mongoose.model("Booking", bookingSchema);

export{Booking};

