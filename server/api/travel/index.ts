import express, {Request, Response} from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Place } from './place.entity'
import { validation_errors } from './validation-errors'
import { myDataSource } from "../../app-data-source"
import { DeleteResult } from 'typeorm';
import { User } from './user.entity';

const router = express.Router();

router.get("/alive", async (req : Request, res : Response) => {
    return res.send(true);
});

// Whitelist only selected keys ignore the rest
function whitelist<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const copy = {} as Pick<T, K>;
    keys.forEach(key => copy[key] = obj[key]);
    return copy;
}

// ADD
router.post("/",
    body('title', validation_errors.title).isString().isAlphanumeric(undefined, {ignore: " "}).isLength({min:1, max: 20}),
    body('title').trim().escape(),
    body('description', validation_errors.description).isString().isAlphanumeric(undefined, {ignore: " "}).isLength({min:1, max: 60}),
    body('description').trim().escape(),
    body('localisation', validation_errors.localisation).isString().isAlphanumeric(undefined, {ignore: " "}).isLength({min:1, max: 60}),
    body('localisation').trim().escape(),
    body('score', validation_errors.score).isInt(),
    body('score').toInt(),
    body('favorite', validation_errors.favorite).isBoolean().optional(),
    body('favorite').toBoolean(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const place: Place = myDataSource.getRepository(Place).create(whitelist(req.body, "title", "description", "localisation", "score", "favorite"));
        const results: Place = await myDataSource.getRepository(Place).save(place);
        return res.status(201).json(results);
    }
);

// UPDATE
router.put("/",
    body('id', validation_errors.id).isInt(),
    body('id').toInt(),
    body('title', validation_errors.title).isString().isAlphanumeric(undefined, {ignore: " "}).isLength({min:1, max: 20}),
    body('title').trim().escape(),
    body('description', validation_errors.description).isString().isAlphanumeric(undefined, {ignore: " "}).isLength({min:1, max: 60}),
    body('description').trim().escape(),
    body('localisation', validation_errors.localisation).isString().isAlphanumeric(undefined, {ignore: " "}).isLength({min:1, max: 60}),
    body('localisation').trim().escape(),
    body('score', validation_errors.score).isInt(),
    body('score').toInt(),
    body('favorite', validation_errors.favorite).isBoolean().optional(),
    body('favorite').toBoolean(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const place_received: Place = myDataSource.getRepository(Place).create(whitelist(req.body, "id", "title", "description", "localisation", "score", "favorite"));
        const place_to_modify: Place | null = await myDataSource.getRepository(Place).findOneBy({
            id: place_received.id
        });
        if (place_to_modify) {
            myDataSource.getRepository(Place).merge(place_to_modify, place_received);
            const results: Place = await myDataSource.getRepository(Place).save(place_to_modify);
            return res.status(200).json(results);
        }
        return res.status(400).send({error: "Resource doesnt exist"});
});

// DELETE
// the status returns from this needs to be changed
router.delete("/:id",
    param('id', validation_errors.id).isInt(),
    param('id').toInt(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const id: number = Number(req.params.id);
        const result: DeleteResult = await myDataSource.getRepository(Place).delete(id);
        if (result.affected)
            return res.status(200).send({status : 'Place deleted'});
        return res.status(404).send({status : 'Place was not deleted because it was not found'});
});

// GET ALL OR GET ALL FAVORITES
// add more info if no elems? like no elems in db?
router.get("/",
    query('favorite', validation_errors.favorite).isBoolean().optional(),
    query('favorite').toBoolean(),
    async (req : Request, res : Response) => {
        const favorite: boolean = Boolean(req.query.favorite);
        let places: Place[] = await myDataSource.getRepository(Place).find();
        // let test = myDataSource.getRepository(User).create({email: 'lola', password: 'haha'});
        // await myDataSource.getRepository(User).save(test);
        // console.log(await myDataSource.getRepository(User).find({relations: ['places']})); --> this is how u get relations
        if (places.length === 0)
            return res.status(404).send();
        if (favorite === true)
            places = places.filter(elem => elem.favorite === true);
        return res.status(200).json(places);
});

// SEARCH WITH A STRING IN TITLE, DESCRIPTION OR LOCALISATION AND RETURN AN ARRAY OR 404 NOT FOUND
// add more info if no elems? like no elems in db?
router.get("/search",
    query('keyword', validation_errors.keyword).isString().isAlphanumeric(undefined, {ignore: " "}).isLength({min:1, max: 60}),
    query('keyword').trim().escape(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array({onlyFirstError: true}) });
        const searchQuery: string | undefined = req.query.keyword?.toString();
        const places: Place[] = await myDataSource.getRepository(Place).createQueryBuilder().select()
        .where('title ILIKE :searchQuery', {searchQuery: `%${searchQuery}%`})
        .orWhere('description ILIKE :searchQuery', {searchQuery: `%${searchQuery}%`})
        .orWhere('localisation ILIKE :searchQuery', {searchQuery: `%${searchQuery}%`})
        .getMany();
        if (places.length > 0)
            return res.status(200).json(places);
        return res.status(404).send();
});

// GET ALL PLACES WITH SCORE EQUAL OR LARGER THAN THE PARAMETER SCORE
router.get("/score",
    query('score', validation_errors.score).isInt(),
    query('score').toInt(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const score: number = Number(req.query.score);
        const places: Place[] = await myDataSource.getRepository(Place).find();
        if (places.length > 0) {
            const returned_places: Place[] = [];
            places.forEach(place => {
                if (place.score >= score)
                    returned_places.push(place);
                }
            );
            if (returned_places.length > 0)
                return res.status(200).json(returned_places);
        }
        return res.status(404).send();
});

// SEARCH WITH ID
router.get("/:id",
    param('id', validation_errors.id).isInt(),
    param('id').toInt(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});
        const id: number = Number(req.params.id);
        const place: Place | null = await myDataSource.getRepository(Place).findOneBy({
            id: id
        });
        if (place)
            return res.status(200).json(place);
        return res.status(404).send();
});

/*
Authentication
2fa??
Lieu favoris, route to add and to delete
*/

export default router;