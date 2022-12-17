import express, {Request, Response} from 'express';
import { body, param, validationResult } from 'express-validator';
import { Place } from './place.entity'
import { myDataSource } from "../../app-data-source"
import * as entity from './entity.d';
import { type } from 'os';
import { DeleteResult } from 'typeorm';

const router = express.Router();
let TravelList : entity.ITravelItemId[] = [];

router.get("/alive", (req : Request, res : Response) => {
    res.send(true);
});

// Whitelist only selected keys in received data
function whitelist<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const copy = {} as Pick<T, K>;
    keys.forEach(key => copy[key] = obj[key]);
    return copy;
}

// ADD
router.post("/",
    body('title').isString().isLength({min:1, max: 20}),
    body('title').not().isEmpty().trim().escape(),
    body('description').isString().isLength({min:1, max: 60}),
    body('description').not().isEmpty().trim().escape(),
    body('localisation').isString().isLength({min:1, max: 60}),
    body('localisation').not().isEmpty().trim().escape(),
    body('score').isInt(),
    body('score').not().isEmpty().toInt(),
    async (req : Request, res : Response) => {
        // add better errors? more verbose?
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});
        

        //add database stuff here later
        // const id :number = TravelList.length + 1;
        // const place : entity.ITravelItemId = {id : id, ...(whitelist(req.body, "title", "description", "localisation", "score"))};
        // TravelList.push(place);
        // console.log(TravelList);
        console.log(req.body, typeof(req.body.score));

        const place : Place = myDataSource.getRepository(Place).create(whitelist(req.body, "title", "description", "localisation", "score"));
        const results : Place = await myDataSource.getRepository(Place).save(place);
        // console.log(results);

        return res.status(201).json(results);
    }
);

// UPDATE
// for now this only updates doesnt create if id doesnt exist 
router.put("/",
    body('id').isInt(),
    body('id').not().isEmpty().toInt(),
    body('title').isString().isLength({min:1, max: 20}),
    body('title').not().isEmpty().trim().escape(),
    body('description').isString().isLength({min:1, max: 60}),
    body('description').not().isEmpty().trim().escape(),
    body('localisation').isString().isLength({min:1, max: 60}),
    body('localisation').not().isEmpty().trim().escape(),
    body('score').isInt(),
    body('score').not().isEmpty().toInt(),
    async (req : Request, res : Response) => {
        // add better errors? more verbose?
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});

        const place_received : entity.ITravelItemId = (whitelist(req.body, "id", "title", "description", "localisation", "score"));
        const place_to_modify : Place | null = await myDataSource.getRepository(Place).findOneBy({
            id : place_received.id
        });
        if (place_to_modify) {
            myDataSource.getRepository(Place).merge(place_to_modify, place_received);
            const results : Place = await myDataSource.getRepository(Place).save(place_to_modify);
            console.log(results);
            return res.status(200).json(results);
        }
        return res.status(400).send({error: "Resource doesnt exist"});

        // //add database stuff here later
        // const id : number = req.body.id;
        // if (TravelList.length === 0 || id - 1 > TravelList.length)
        //     return res.status(400).send({error: "Resource doesnt exist"});
            
        // TravelList[id - 1] = {id: id, ...(whitelist(req.body, "title", "description", "localisation", "score"))};
        // // console.log(TravelList);
        // return res.status(200).send(TravelList[id - 1]); // not necessary to return object, should return 204
});

// DELETE
// the status returns from this needs to be changed
// this is overkill cos i use param.toInt and JSON.parse that do the same!!!
router.delete("/:id",
    param('id').isInt(),
    param('id').not().isEmpty().toInt(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});


        const id: number = JSON.parse(req.params.id);
        const result : DeleteResult = await myDataSource.getRepository(Place).delete(id);
        if (result.affected)
            return res.status(200).send({status : 'Place deleted'});
        return res.status(404).send({status : 'Place was not deleted because it was not found'});
});

// GET ALL
router.get("/", async (req : Request, res : Response) => {
    const places : Place[] = await myDataSource.getRepository(Place).find();
    return res.status(200).json(places);
});

// SEARCH WITH ID
// this is overkill cos i use param.toInt and JSON.parse that do the same!!!
router.get("/:id",
    param('id').isInt(),
    param('id').not().isEmpty().toInt(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});

        const id: number = JSON.parse(req.params.id);
        const place : Place | null = await myDataSource.getRepository(Place).findOneBy({
            id : id
        });
        if (place)
            return res.status(200).json(place);
        return res.status(404).send();
});

// this is overkill cos i use param.toInt and JSON.parse that do the same!!!
// return place.score >= score
router.get("/score/:score",
    param('score').isInt(),
    param('score').not().isEmpty().toInt(),
    async (req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});

        const score: number = JSON.parse(req.params.score);
        const places : Place[] | null = await myDataSource.getRepository(Place).find();
        if (places) {
            (places.forEach(place => place.score >= score));
            // console.log(places.forEach(place => {let arr: any = []; if (place.score >= score) arr.push(place); return arr; console.log(arr)}));
            return res.status(200).json(places);
        }
        return res.status(404).send();
});

// 2fa??

// SEARCH WITH STRING? TITLE, DESCRIPTION, LOCALISATION

// SEARCH BETTER THAN > SCORE


/*
Authentication
Lieu favoris
*/

export default router;