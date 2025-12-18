

type OwnedPokemon = {
        _id?: string,
        //En base datos se guardará solo el id, encadenado pokemon.
        pokemon: Pokemon
        nickname: string
        attack: number,
        defense: number
        speed: number
        special: number
        level: number
    }