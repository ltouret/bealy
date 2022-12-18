import express, {NextFunction, Request, Response} from 'express';
import { body, param, query, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'
import { validation_errors } from './validation-errors'
import { myDataSource } from "../../app-data-source"
import { Repository } from 'typeorm';
import { User } from './user.entity';

const router = express.Router();
const userRepository: Repository<User> = myDataSource.getRepository(User);
const accessTokenSecret : string =  process.env.JWT_SECRET ? process.env.JWT_SECRET : "dummysecretkey";

router.get("/alive", async (req : Request, res : Response) => {
    return res.send(true);
});

// more just send status no text?
export const authGuard = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
        const accessToken: string = req.cookies.access_token;

        if (accessToken === undefined)
            return res.status(401).send(validation_errors.not_logged);

        // console.log(accessToken);
        try {
            const decoded = jwt.verify(accessToken, accessTokenSecret);
            decoded.sub = undefined;
            console.log(decoded, Number(decoded.sub));
            if (!decoded || !decoded.sub)
                throw new Error();
            // return res.status(401).send(validation_errors.not_logged);
            // if (decoded.)
                // const user: User | null = await userRepository.findOneBy({id: Number(decoded.sub)});
            res.locals.user = await userRepository.findOneBy({id: Number(decoded.sub)});

            // console.log("a",user);
        } catch (error) {
            console.log(error);
            return res.status(401).send(validation_errors.not_logged);
        }
        // const payload = jwt.verify(accessToken, accessTokenSecret, (error, payload) => {
        //     if (error === undefined)
        //         return res.status(401).send(validation_errors.not_logged);
        //         // console.log("1", error);
        //     // console.log(payload, typeof(payload), typeof(payload.sub));
        //     // const id: Number = Number(payload.sub);
        //     // const user: User | null = userRepository.findOneBy({id: Number(payload.sub)})
        //     // res.locals.user = payload;
        //     if (payload === undefined)
        //         return undefined;
        //     return payload?.sub;
        // });
        // console.log(payload);
        // // if (payload && )
        // const id: Number = Number(payload.sub);
        // const user: User | null = await userRepository.findOneBy({id: Number(payload.sub)})
        // // call next only if it works!
        next();
}

// add guard here
router.get("/test", authGuard,
    async (req : Request, res : Response) => {
        // console.log(res.locals.user);
        return res.status(200).json({
            status: 'success',
    });
});

// for now doesnt log in the user, just registers it
router.post("/signup",
    body('email', validation_errors.email).isString().isEmail(),
    body('password', validation_errors.password).isString().isLength({min:6, max: 30}),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        errors.array().forEach(error => error.value = undefined);
        // console.log(errors);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});
        const { email, password } = req.body;
        // console.log(email, password);
        const user: User = userRepository.create({email: email.toLowerCase(), password});
        await userRepository.save(user);
        return res.status(201).json({
            status: 'success',
            data: {
              user,
            },
        });
});

router.post("/login",
    body('email', validation_errors.email).isString().isEmail(),
    body('password', validation_errors.password).isString().isLength({min:6, max: 30}),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        errors.array().forEach(error => error.value = undefined);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});
        const { email, password } = req.body;
        const user : User | null = await userRepository.findOneBy({email});
        // console.log(user);
        if (user === null || await User.comparePasswords(password, user.password) === false)
            return res.status(401).send(validation_errors.login);
        const accessToken : string = jwt.sign({email : user.email, sub: user.id}, accessTokenSecret);
        const accessTokenCookieOptions = {
            expires: new Date(
              Date.now() + 15 * 60 * 1000
            ),
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
        };
        res.cookie('access_token', accessToken, accessTokenCookieOptions);
        // console.log(accessToken);
        return res.status(200).json({
            status: 'success',
            accessToken,
        });
});

// add guard here
router.get("/logout", authGuard,
    async (req : Request, res : Response) => {
        res.cookie('access_token', '', { maxAge: -1, httpOnly: true,});
        // console.log(req.cookies);
        return res.status(200).json({
            status: 'success',
    });
});

export default router;