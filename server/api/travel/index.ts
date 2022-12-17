import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { Place } from './place.entity'
import * as entity from './entity.d';

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
    (req : Request, res : Response) => {
        // add better errors? more verbose?
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});
        
        //add database stuff here later
        const id :number = TravelList.length + 1;
        const place : entity.ITravelItemId = {id : id, ...(whitelist(req.body, "title", "description", "localisation", "score"))};
        TravelList.push(place);
        // console.log(TravelList);
        return res.status(201).send(place);
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
    (req : Request, res : Response) => {
        // add better errors? more verbose?
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array()});

        //add database stuff here later
        const id : number = req.body.id;
        if (TravelList.length === 0 || id - 1 > TravelList.length)
            return res.status(400).send({error: "Resource doesnt exist"});
            
        TravelList[id - 1] = {id: id, ...(whitelist(req.body, "title", "description", "localisation", "score"))};
        // console.log(TravelList);
        return res.status(200).send(TravelList[id - 1]); // not necessary to return object, should return 204
});

// DELETE
router.delete("/:id", (req : Request, res : Response) => {

});

// GET ALL
router.get("/", (req : Request, res : Response) => {
    console.log(TravelList);
    res.status(200).json("hey");
});

// SEARCH WITH ID 
router.get("/:id", (req : Request, res : Response) => {

});

// 2fa??

// SEARCH WITH STRING? TITLE, DESCRIPTION, LOCALISATION

// SEARCH BETTER THAN > SCORE


/*
Authentication
Lieu favoris
*/

export default router;