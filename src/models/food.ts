import mongoose,{Schema,Document,Model} from "mongoose";

export interface FoodDoc extends Document{
    vandorId: {type: String},
    name: string;
    description: string;
    category: string;
    foodType: string;
    readTime: number;
    price: number;
    rating:number;
    images:[string]
}

const FoodSchema = new Schema({
    vandorId: {type: String},
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String},
    foodType: {type: String, required: true},
    readTime: {type: Number},
    price: {type: Number, required: true},
    rating:{type: Number},
    images:{type: [String]}
},{
        toJSON:{
        transform(doc,ret){
            delete ret.password;
            delete ret.salt,
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
    
        },
    },timestamps: true});

const Food = mongoose.model<FoodDoc>('food',FoodSchema);
export {Food}