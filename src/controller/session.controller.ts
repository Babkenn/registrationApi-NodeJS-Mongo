import { Request, Response, NextFunction} from "express";
import { validatePassword } from "../service/user.service";
import {
  createSession,
  createAccessToken,
} from "../service/session.service";
import { decode } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  /* validate the email and password */
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  /* Create a session */
  const session = await createSession(user._id, req.get("user-agent") || "");

  /* create access token */
  const accessToken = createAccessToken({
    user,
    session,
  });

  /* send refresh & access token back */
  return res.send({ accessToken });
}

export async function isAuthenticated (
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    let authToken: string = '';
    if (req.headers.authorization){
        authToken = req.headers.authorization;
    }
    if (!authToken) {
        return res.status(401).send({ 'Error Message': 'No Authorization Token Found' });
    } else {
        let user = decode(authToken);
        if (user.valid && !user.expired){
            req.body.user = user.decoded;
            return next();
        } else {
          return res.status(401).send({ 'Error Message': 'Expired Token' });
        }
    }
}

