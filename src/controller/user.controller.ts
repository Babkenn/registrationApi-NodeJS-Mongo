import {Request, Response} from 'express';
import { createUserHandler , searchUser, sendFriendRequest,
    getUpdatedCurrentUser, acceptFriendRequest, declineFriendRequest} from '../service/user.service';
import { omit } from "lodash";

export async function createUser(req: Request, res: Response){
    try {
        const user = await createUserHandler(req.body);
        return res.send(omit(user.toJSON(), "password"))
    } catch (e) {
        return res.status(409).send(e.message);
    }
}

export async function logedIn(req: Request, res: Response){
    try {
        const user = await createUserHandler(req.body);
        return res.send(omit(user.toJSON(), "password"))
    } catch (e) {
        return res.status(409).send(e.message);
    }
}

export async function findUser(req: Request, res: Response) {
    try {
        const user = await searchUser(req.body);
        return res.send({"user" : user});
    } catch (e) {
        return res.status(409).send(e.message);
    }
}

export async function friendRequest(req: Request, res: Response){
    try {
        const user = await sendFriendRequest(req.body.email, req.body.user.email);
        return res.send({status : "Request successfully sent"});
    } catch (e) {
        return res.status(409).send(e.message);
    }
}

export async function acceptFriendsRequest(req: Request, res: Response){
    try {
        const user = await acceptFriendRequest(req.body.email, req.body.user.email);
        return res.send({status : "Friend Request successfully accepted"});
    } catch (e) {
        return res.status(409).send(e.message);
    }
}

export async function declineFriendsRequest(req: Request, res: Response){
    try {
        const user = await declineFriendRequest(req.body.email, req.body.user.email);
        return res.send({status : "Friend Request successfully declined"});
    } catch (e) {
        return res.status(409).send(e.message);
    }
}

export async function allfriendRequests(req: Request, res: Response){
    try {
        const loginUser: any = await getUpdatedCurrentUser(req.body.user.email);
        return res.send({"friendRequests" : loginUser[0].friendsRequest});
    } catch (e) {
        return res.status(409).send(e.message);
    }
}