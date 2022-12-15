import express, {Request, Response} from 'express';
import * as entity from './entity.d';

const router = express.Router();
let TravelList : entity.ITravelItemId[] = [];

router.get("/alive", (req : Request, res : Response) => {
    res.send(true);
});

// ADD
router.post("/", (req : Request, res : Response) => {

});

// UPDATE
router.put("/", (req : Request, res : Response) => {

});

// DELETE
router.delete("/", (req : Request, res : Response) => {

});

// GET ALL
router.get("/", (req : Request, res : Response) => {
    let hey : entity.ITravelItemId = {
        id: 1,
        title : "string",
        description : "string",
        localisation : "string",
        score : 5,
    };
    TravelList.push(hey);
    // hey.id = 1;
    console.log(TravelList);
    // res.send("haha");
    res.status(200).json(hey);
});

// SEARCH WITH ID 
router.get("/:id", (req : Request, res : Response) => {

});

// SEARCH WITH STRING? TITLE, DESCRIPTION, LOCALISATION

// SEARCH BETTER THAN > SCORE

/*
Authentication
Lieu favoris
*/

export default router;