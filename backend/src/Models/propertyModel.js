import slugify from 'slugify';
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({

    propertyName:{
        type:String,
        required: [true,"Please Enter your property Name"]

    },
    description:{
        type:String,
        required:[true,"Please add information about your Property"],
        maxlength:[500,"You can not fill description more than 500 characters"],

    },
    extraInfo:{
        type:String,
        default:"checkin on time. good services available. food facility is available",
    },
    propertyType:{
        type:String,
        enum:["House","Flat","Hotel","Guest House", "Villa"],
        default:"House"
    },
    roomType:{
        type:String,
        enum:["Anytype","Room","Entire Home"],
        default:"Anytype"
    },
    maximumGuest:{
        type:Number,
        required:[true,"Please give the maximum capacity of a room"],


    },
    aminities:[{
        name:{
        type:String,
        required:true,
        enum:["WiFi",
            "Swimming Pool",
            "Kitchen",
            "Restaurant",
            "AC",
            "TV",
            "Washing Machine",
            "Oven" ,
            "Parking",
            "CCTv" ]
    },
        icon:{
        type:String,
        required:true
    },

}],
        images:{
            type:[
                {
                    public_id:{
                        type:String
                    },
                    url:{
                        type:String,
                        required:true
                    }
                }
            ],
            validate:{
                validator:function(arr){
                return length.arr <=6;
                },
                message:"The images must contain atleast 6 picture";
            }
        },
        price:{
            type:Number,
            required:[true,"Please Enter the price per night"],
            default:500
        },
        address:{
            area:String,
            city:String,
            state:String,
            pincode:Number
        },
        currentBookings:[

        ],
        UserId:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"

        },

        slug:String,
        checkInTime:{
            Type:String,
            default:"11:00AM"
        },
        checkOutTime:{
            Type:String,
            default:"01:00PM"
        }

})

propertySchema.pre("Save", function(next){
        this.slug= slugify(this.propertyName,{lower:true})
        next();
})

propertySchema.pre("Save", function(next)
{
    this.address.city = this.address.city.toLowerCase().replaceAll(" ","")
    next();
})

const Property = mongoose.model("Property",propertySchema);

export{Property};