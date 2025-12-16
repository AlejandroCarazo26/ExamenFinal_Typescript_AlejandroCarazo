import { Collection, ObjectId } from "mongodb";
import { getDb } from "../db/mongo"
import { CLOTHING_COLLECTION } from "../utils";


export const getRopita = async (page?: number, size?: number) => {
    const db = getDb();
    page = page || 1;
    size = size || 10;
    return await db.collection(CLOTHING_COLLECTION).find().skip((page-1) * size).toArray();
}

export const getRopitaPorID = async(id: string) => {
    const db = getDb();
    return await db.collection(CLOTHING_COLLECTION).findOne({_id: new Object(id)})
}

export const createRopita = async( name: string, size: string, color: string, price: number) => {
    const db = getDb();

    const result = await db.collection(CLOTHING_COLLECTION).insertOne({
        name,
        size,
        color,
        price
    });

    const newClothing = await getRopitaPorID(result.insertedId.toString());
    return newClothing;
}


export const getRopasFromIDs = async(ids: Array<string>) => {
    const db = getDb();
    const idsParaMongo = ids.map(x=> new ObjectId(x));

    return await db.collection(CLOTHING_COLLECTION).find({
        _id: {$in: idsParaMongo}
    }).toArray();
}
