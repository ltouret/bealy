import express, {Request, Response} from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Place } from './place.entity'
import { validation_errors } from './validation-errors'
import { myDataSource } from "../../app-data-source"
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity'; // erase

const router = express.Router();
const userRepository: Repository<User> = myDataSource.getRepository(User);

router.get("/alive", async (req : Request, res : Response) => {
    return res.send(true);
});

router.get("/users",
    query('favorite', validation_errors.favorite).isBoolean().optional(),
    query('favorite').toBoolean(),
    async (req : Request, res : Response) => {
        const favorite: boolean = Boolean(req.query.favorite);
        let test = userRepository.create({email: 'dem', password: 'haha'});
        await userRepository.save(test);
        let places: any = await userRepository.findOneBy({email : 'dem'});
        // let test = myDataSource.getRepository(User).create({email: 'lola', password: 'haha'});
        // await myDataSource.getRepository(User).save(test);
        console.log(places); //--> this is how u get relations
        if (places.length === 0)
            return res.status(404).send();
        return res.status(200).json(places);
});

export default router;