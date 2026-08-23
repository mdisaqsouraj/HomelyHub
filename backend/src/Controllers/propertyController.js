import { Property } from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js";

const getProperties = async(req,res) =>{
    try{
        const feature = new APIFeatures(Property.find(),req.query)
        .filter()
        .search()
        .paginate();

        const allProperties = await Property.find();

        const doc = await feature.query;
        res.status(200).json({
            status:"Success",
            no_of_responses : doc.length,
            data:doc
        })
    }catch(error){
        console.error("Error in searching Property", error)
        res.status(500).json({error:"Internal Server Error"})
        
    }
}

const getProperty = async(req,res) =>{
    try{
        const property = await Property.findById(req.params.id)
        res.status(200).json({
                status:"Success",
                data:property


        })
        
    }catch(error){
        res.status(404).json({
            status:"Fail",
            message:error.message
        })

    }
}
export { getProperties , getProperty}