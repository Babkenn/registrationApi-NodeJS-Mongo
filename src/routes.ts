import { Express } from "express";
import { createUser, findUser, friendRequest, allfriendRequests, acceptFriendsRequest, declineFriendsRequest} from "./controller/user.controller";
import { createUserSessionHandler, isAuthenticated} from "./controller/session.controller";
import { createUserSchema, createUserSessionSchema, searchUserSchema, friendRequestSchema } from "./schema/user.schema"
import validateRequest from "./middleware/valiadateRequest"
export default function (app: Express) {

    /* Register new user */
    app.post("/api/users", validateRequest(createUserSchema), createUser)

    /* Logged in */
    app.post("/api/login", validateRequest(createUserSessionSchema), createUserSessionHandler);
    app.post("/api/findUser", validateRequest(searchUserSchema), isAuthenticated, findUser);

    /* Send Friend Request */
    app.post("/api/friendRequest", validateRequest(friendRequestSchema), isAuthenticated, friendRequest);

    /* Accept Request */
    app.post("/api/acceptFriendRequest", validateRequest(friendRequestSchema), isAuthenticated, acceptFriendsRequest);

    /* Decline Request */
    app.post("/api/declineFriendRequest", validateRequest(friendRequestSchema), isAuthenticated, declineFriendsRequest);


    /* Get Friend Request List */
    app.get("/api/allFriendsRequests", isAuthenticated, allfriendRequests);

}