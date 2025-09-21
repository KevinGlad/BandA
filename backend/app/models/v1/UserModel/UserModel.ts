import mongoose, { Schema, Types } from "mongoose"

interface UserDocument {
    fname: string
    lname: string
    userName: string
    password: string,
    caricatureName: string,
    phone: string,
    email: string,
    dob: Date,
    userType: string,
    userRole: string,
    language: string,
    country: string,
    timeZone: string,
    circle: Array<Types.ObjectId>
    createdAt: Date,
    deletedAt: Date,
    active: boolean,
}

const UserSchema = new Schema<UserDocument>(
    {
        fname: {type: String, required: true},
        lname: {type: String, required: true},
        userName: {type: String, required: true},
        password: {type: String, required: true},
        caricatureName: {type: String, required: true},
        phone: {type: String, required: true},
        email: {type: String, required: true},
        dob: {type: Date, required: true},
        userType: {type: String, required: true},
        userRole: {type: String, required: true},
        language: {type: String, required: true},
        country: {type: String, required: true},
        timeZone: {type: String, required: true},
        circle: {type: [Schema.Types.ObjectId], required: true},
        createdAt: {type: Date, required: true},
        deletedAt: {type: Date, required: true},
        active: {type: Boolean, required: true},
    }
)

export const UserModel = mongoose.model<UserDocument>('User',UserSchema)