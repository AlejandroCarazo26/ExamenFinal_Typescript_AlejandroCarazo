import { getDb } from "../db/mongo";
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb";
import { CLOTHING_COLLECTION, USER_COLLECTION } from "../utils";
import { getRopitaPorID } from "./ropita";


export const createUser = async (email: string, password: string) => {
    const db = getDb();
    const passwordEncriptada = await bcrypt.hash(password, 10);

    const result = await db.collection(USER_COLLECTION).insertOne({
        email, 
        password: passwordEncriptada,
        clothes: []
    });

    return result.insertedId.toString();
}

export const validateUser = async (email: string, password: string) => {
    const db = getDb();
    const user = await db.collection(USER_COLLECTION).findOne({email});

    if(!user) throw null;

    const comparacion = await bcrypt.compare(password, user.password);

    if(!comparacion) return null;

    return user;
}


export const buyRopita = async (idDeRopa : string, userId: string) => {
    const db = getDb();

    const ropitaAnadir = await getRopitaPorID(idDeRopa);

    if(!ropitaAnadir) throw new Error("Tal ropa no existe");

    await db.collection(USER_COLLECTION).updateOne({_id: new ObjectId(userId)},{
        $addToSet: {clothes: idDeRopa}
    });

    const updatedUser = await db.collection(USER_COLLECTION).findOne({_id: new ObjectId(userId)});
    return updatedUser;

}

