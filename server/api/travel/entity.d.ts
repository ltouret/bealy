interface ITravelItem {
    title : string;
    description : string;
    localisation : string;
    score : number;
}

interface ITravelItemId extends ITravelItem {
    id : number;
}

export {
    ITravelItem,
    ITravelItemId
}