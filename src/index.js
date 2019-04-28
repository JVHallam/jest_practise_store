
/**
 * This is a typedef, idk how to use it.
 * This would be considered an Enum.
 */
export const types = Object.freeze({
    [typeof("")] : [typeof("")],
    [typeof([])] : [typeof([])],
    [typeof(1)] : [typeof(1)],
    [typeof(true)] : [typeof(true)],
});

/**
 * This is an Enum, or a typedef?
 */
export const uniqueness = Object.freeze({
   [typeof("")]     : true,
   [typeof([])]     : true,
   [typeof(1)]      : true,
   [typeof(true)]   : false
});

//Where index is an int => map( (_, index) ) => {}
const defaultValuesStore = Object.freeze({
    [typeof("")]    : ( index ) => `${index}`,
    [typeof(1)]     : ( index ) => index,
    [typeof([])]    : ( index ) => [index],
    [typeof(true)]  : ( index ) => true
}); 

/**
 * Create a store, 
 * That stores an array of a single type.
 * @param valuesType - [The type of the value, based on the typedef]
 * @return {object} [{
 *      type : valuesType,
 *      hasBeenChanged : false,
 *      initialValueCount : valuesCount,
 *      values : [ ... array of values... ]
 * }]
 */
export function createStore( valuesType="string", valuesCount=10 ){
    return {
        type                : valuesType,
        hasBeenChanged      : false,
        initialValueCount   : valuesCount,
        values              : generateValues( valuesType, valuesCount )
    };
};

/**
 * Generate an array of values, of a given length and type.
 * @param valuesType - The wanted type
 * @param valuesCount - The wanted number
 * @return {Array} [ The array of the given length ]
 * @throws {TypeError} [Throws an error when given an unrecognised type.]
 */
export function generateValues(valuesType=typeof(""), valuesCount=10){
    if(!(valuesType in types)){
        throw TypeError(`'${valuesType}' is not a recognised type, found in the exported types object.`);
    }

    return [...Array(valuesCount)].map( ( _, index) => (defaultValuesStore[valuesType])( index ) );
};


/**
 * Return whether or not the values match.
 * Recursively compares lists.
 * @param {*} a 
 * @param {*} b 
 * @return bool whether or not they matched
 */
const recursivelyCompareValue = ( a, b ) => {
    if( typeof(a) != typeof([]) ){
        return a === b;
    }
    else{
        const match = a
            .map( (value, index) => recursivelyCompareValue(value, b[index]) )
            .reduce( (accumulator, x) => accumulator && x );

        return match;
    }
}

const wereValuesAltered = ( store ) => {
    try{
        const expectedValues = generateValues( store.type, store.initialValueCount );
        
        const doAllMatch = recursivelyCompareValue( expectedValues, store.values );

        const wasOneAltered = ( doAllMatch != true );
        
        return wasOneAltered;
    }
    catch(err){
        return true;
    }
}

/**
 * Check if a store has been altered since it's creation.
 * @param store - the given store from createStore
 * @returns whether or not the store was altered
 */
export function hasBeenChanged( store ){
    const wasHasBeenChangedChanged = ( store.hasBeenChanged == true );

    const wasTypeChanged = ( !(store.type in types) );

    const wasLengthChanged = ( store.values.length != store.initialValueCount );

    const doesValuesMatchExpected = wereValuesAltered( store );

    return wasHasBeenChangedChanged || wasTypeChanged || wasLengthChanged || doesValuesMatchExpected;
}

/**
 * If the store has been altered, returns a "clean" (un-altered) version of the original store.
 * @param store 
 * @returns store - A new version of the store. Never a reference to the old one.
 */
export function createCleanedStore( store ){
    
    //Check if we actually new a new store
    const hasStoreBeenChanged = store.hasBeenChanged || hasBeenChanged(store);

    //Lol, this actually turned out to be all i needed!
    const cleanedStore = ( hasStoreBeenChanged ) ? createStore( store.type, store.initialValueCount ) : {...store};

    return cleanedStore;
}