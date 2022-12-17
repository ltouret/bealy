import express, {Request, Response} from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Place } from './place.entity'
import { validation_errors } from './validation-errors'
import { myDataSource } from "../../app-data-source"
import { DeleteResult } from 'typeorm';

const router = express.Router();

router.get("/alive", (req : Request, res : Response) => {
    res.send(true);
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
    async (req : Request, res : Response) => {
        console.log(req.body.title);
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const place : Place = myDataSource.getRepository(Place).create(whitelist(req.body, "title", "description", "localisation", "score"));
        const results : Place = await myDataSource.getRepository(Place).save(place);
        return res.status(201).json(results);
    }
);

// UPDATE
// for now this only updates doesnt create if id doesnt exist
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
    async (req : Request, res : Response) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const place_received : Place = myDataSource.getRepository(Place).create(whitelist(req.body, "id", "title", "description", "localisation", "score"));
        const place_to_modify : Place | null = await myDataSource.getRepository(Place).findOneBy({
            id : place_received.id
        });
        if (place_to_modify) {
            myDataSource.getRepository(Place).merge(place_to_modify, place_received);
            const results : Place = await myDataSource.getRepository(Place).save(place_to_modify);
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
        const result : DeleteResult = await myDataSource.getRepository(Place).delete(id);
        if (result.affected)
            return res.status(200).send({status : 'Place deleted'});
        return res.status(404).send({status : 'Place was not deleted because it was not found'});
});

// GET ALL
// add more info if no elems? like no elems in db?
router.get("/", async (req : Request, res : Response) => {
    const places : Place[] = await myDataSource.getRepository(Place).find();
    if (places.length === 0)
        return res.status(404).send();
    return res.status(200).json(places);
});


// GET ALL PLACES WITH SCORE EQUAL OR LARGE THAN THE PARAMETER SCORE
router.get("/score",
    query('score', validation_errors.score).isInt(),
    query('score').toInt(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const score: number = Number(req.query.score);
        const places : Place[] = await myDataSource.getRepository(Place).find();
        if (places.length > 0) {
            const returned_places : Place[] = [];
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
        const place : Place | null = await myDataSource.getRepository(Place).findOneBy({
            id : id
        });
        if (place)
            return res.status(200).json(place);
        return res.status(404).send();
});


// 2fa??

// SEARCH WITH STRING? TITLE, DESCRIPTION, LOCALISATION

/*
Authentication
Lieu favoris, route to add and to delete
*/

export default router;