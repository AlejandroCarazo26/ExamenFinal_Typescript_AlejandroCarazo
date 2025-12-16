import { IResolvers } from "@graphql-tools/utils";
import { getDb } from "../db/mongo";
import { Collection, ObjectId } from "mongodb";
import { signToken } from "../auth";
import { validate } from "graphql";
import { buyRopita, createUser, validateUser } from "../collections/users";
import { createRopita, getRopasFromIDs, getRopita, getRopitaPorID } from "../collections/ropita";


export const resolvers: IResolvers = {
    Query: {

        clothes: async(_, {page, size}) => {
            return await getRopita(page, size);
        },

        clothing: async(_, {id}) => {
            return await getRopitaPorID(id);
        },

        me: async(_, __, { user }) => {
            if(!user) throw new Error ("Logeate o na de na");
            
            return {
                _id: user._id.toString(),
                ...user
            }
        }
        
    },

    Mutation: {
        
        register: async(_, {email, password}: {email: string, password: string}) => {
            const idDelClienteCreado = await createUser(email, password);
            return signToken(idDelClienteCreado);
        },

        login: async(_, {email, password}: {email: string, password: string}) => {
            const user = await validateUser(email, password);

            if(!user) throw new Error("Esos credenciales son incorrectos");
            return signToken(user._id.toString());
        },

        addClothing: async (_, {name, size, color, price}, { user }) =>{
            if(!user) throw new Error("Tienes que estar logueado para añadir ropa")

            const db = getDb();
            const result  = await createRopita(name, size, color, price);

            return result;
            
        },

        buyClothing: async (_, {clothingId}, {user}) => {
            if(!user) throw new Error("Tienes que estar logueado para comprar ropa")

            return await buyRopita(clothingId, user._id);
        }
    },


    User: {
        clothes: async (parent) => {
            return await getRopasFromIDs(parent.clothes);

        }
    }
}