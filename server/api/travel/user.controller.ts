import express, {NextFunction, Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
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

export const authGuard = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
        const accessToken: string = req.cookies.access_token;
        try {
            const decoded = jwt.verify(accessToken, accessTokenSecret);
            if (!decoded || !decoded.sub)
                throw new Error('Cant get user with user id of NaN');
            res.locals.user = await userRepository.findOne({ where: {id: Number(decoded.sub)}, relations: ['places']});
            if (!res.locals.user)
                return res.status(401).send(validation_errors.not_logged);
        } catch (error) {
            return res.status(401).send(validation_errors.not_logged);
        }
        next();
}

router.get("/me",
    authGuard,
    async (req : Request, res : Response) => {
        const user: User = res.locals.user;
        return res.status(200).json({
            user
    });
});

// for now doesnt log in the user, just registers it
router.post("/signup",
    body('email', validation_errors.email).isString().isEmail(),
    body('password', validation_errors.password).isString().isLength({min:6, max: 30}),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        errors.array().forEach(error => error.value = undefined);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});
        try {
        const { email, password } = req.body;
        const user: User = userRepository.create({email: email.toLowerCase(), password});
        await userRepository.save(user);
        return res.status(201).json({
            status: 'success',
            data: {
              user,
            },
        });
        } catch (error : any) {
            if (error.code === '23505') {
                return res.status(409).json({
                  status: 'fail',
                  message: 'User with that email already exist',
                });
            }
        }
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

router.get("/logout", authGuard,
    async (req : Request, res : Response) => {
        res.cookie('access_token', '', { maxAge: -1, httpOnly: true,});
        return res.status(200).json({
            status: 'success',
    });
});

export default router;