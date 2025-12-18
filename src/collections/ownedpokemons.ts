import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo"
import { OWNEDPOKEMON_COLLECTION, POKEMON_COLLECTION, TRAINER_COLLECTION } from "../utils";




export const catchPokemonParaTrainer = async (trainerId: string, pokemonId: string, nickname?: string) => {

    const db = getDb();

    const mipokemon = await db.collection(POKEMON_COLLECTION).findOne({_id: new ObjectId(pokemonId)});
    if(!mipokemon) throw new Error ("No se ha encontrado dichon pokemon");

    const result = await db.collection(OWNEDPOKEMON_COLLECTION).insertOne({

        trainerId, 
        pokemonId, 
        nickname: nickname || mipokemon.name,
        level: 1,
    });

    const ownedId = result.insertedId.toString();

    await db.collection(TRAINER_COLLECTION).updateOne(
        {_id: new ObjectId(trainerId)}, {$addToSet: {pokemons: ownedId}}
    );

    return await db.collection(OWNEDPOKEMON_COLLECTION).findOne({_id: new ObjectId(ownedId)});
}


export const freeOwnedPokemons = async(trainerId: string, OwnedPokemonId: string) => {
    const db = getDb();

    await db.collection(OWNEDPOKEMON_COLLECTION).deleteOne({_id: new ObjectId(OwnedPokemonId)});

    await db.collection(TRAINER_COLLECTION).updateOne({_id: new ObjectId(trainerId)}, {$pull: {pokemons: OwnedPokemonId } as any});

    return await db.collection(TRAINER_COLLECTION).findOne({
        _id: new ObjectId(trainerId)
    })

}