import User, {UserDocument} from '../model/user.model';
import { DocumentDefinition, FilterQuery } from 'mongoose';
import { omit } from "lodash";

export async function createUserHandler(input: DocumentDefinition<UserDocument>){
    try {
        return await User.create(input)
    } catch (error){
        throw new Error(error)
    }
};

export async function findUser(query: FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
}

/* check password validation */
export async function validatePassword({
    email,
    password,
    }: {
    email: UserDocument["email"];
    password: string;
    }) {
    const user = await User.findOne({ email });

    if (!user) {
        return false;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
        return false;
    }
    return omit(user.toJSON(), "password");
}

/* search friend by age,firstname or lastname */
export async function searchUser({
    firstName, lastName, age
    }: {
        firstName: UserDocument["firstName"],
        lastName: UserDocument["lastName"],
        age: UserDocument["age"]
    }) {
    let match = {}
    if (firstName){
        Object.assign(match, {firstName: firstName});
    }
    if (lastName){
        Object.assign(match, {lastName: lastName});
    }
    if (age){
        Object.assign(match, {age: age});
    }
    const user = User.find(match);
    if (!user) {
        return false;
    }
    return user;
}

/* Send friend request */
export async function sendFriendRequest(
    requestedFriendEmail: UserDocument["email"],
    currentUserEmail: UserDocument["email"]) {

    const user = User.updateOne({email: requestedFriendEmail}, {$push: { "friendsRequest" : currentUserEmail}});
    if (!user) {
        return false;
    }
    return user;
}

/* Add accepted firend email to friendsList and remove it from requested Array */
export async function acceptFriendRequest(
    acceptedFriendEmail: UserDocument["email"],
    currentUserEmail: UserDocument["email"]) {

    const user = User.updateOne(
        {email: currentUserEmail},
        {$push: { "friendsList":  acceptedFriendEmail}, $pull: { "friendsRequest": acceptedFriendEmail}},
        );
    if (!user) {
        return false;
    }
    return user;
}

/* Decline friend request */
export async function declineFriendRequest(
    declineFriendEmail: UserDocument["email"],
    currentUserEmail: UserDocument["email"]) {

    const user = User.updateOne(
        {email: currentUserEmail},
        {$pull: { "friendsRequest": declineFriendEmail}},
        );
    if (!user) {
        return false;
    }
    return user;
}

/* get logged in user updated data */
export async function getUpdatedCurrentUser(
    currentUserEmail: UserDocument["email"]) {
    const user = User.find({email: currentUserEmail});
    if (!user) {
        return false;
    }
    return user;
}
