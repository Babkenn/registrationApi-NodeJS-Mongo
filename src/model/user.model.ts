import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserDocument extends mongoose.Document {
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    friendsRequest: Array<String>;
    friendsList: Array<String>;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, lowercase: true, unique: true },
        firstName: { type: String, required: true },
        lastName: {type: String, required: true},
        age: { type: String, require: true},
        password: { type: String, required: true },
        friendsRequest: [String],
        friendsList: [String]
    },
    { timestamps: true}
);

UserSchema.pre("save", async function (next: mongoose.HookNextFunction) {
    let user = this as UserDocument;

    /* hash passoword on change or on new create */
    if (!user.isModified("password")) return next();

    const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));
    const hash = await bcrypt.hashSync(user.password, salt);

    user.password = hash;

    return next();
})

/* Called on loggin */
UserSchema.methods.comparePassword = async function (password: string) {
    const user = this as UserDocument;
    return bcrypt.compare(password, user.password).catch((e) => false)
}

const User = mongoose.model<UserDocument>("User", UserSchema)


export default User;
