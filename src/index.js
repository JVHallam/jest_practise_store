
/**
 * Enum for the store types
 * @readonly
 * @enum {string}
 */
export const types = Object.freeze({
    [typeof("")] : [typeof("")],
    [typeof([])] : [typeof([])],
    [typeof(1)] : [typeof(1)],
    [typeof(true)] : [typeof(true)],
});

/**
 * Represents whether or not the values for a type are unique within a store.
 * @readonly
 * @enum {string}
 */
export const uniqueness = Object.freeze({
   [typeof("")]     : true,
   [typeof([])]     : true,
   [typeof(1)]      : true,
   [typeof(true)]   : false
});

/**
 * Returns a function, based on the type given.
 * The function is used to generate the default unique values.
 * Index is expected to be the integer from : [].map( (value, index) => {});
 * @private
 */
const defaultValuesStore = Object.freeze({
    [typeof("")]    : ( index ) => `${index}`,
    [typeof(1)]     : ( index ) => index,
    [typeof([])]    : ( index ) => [index],
    [typeof(true)]  : ( index ) => true
}); 

/**
 * The values store, for use with the rest of the functions.
 * @typedef {Object} store
 * @property {string} type - The string from typeof() that represents the types
 *                           stored in values
 * @property {bool} hasBeenChanged - have the values been changed?
 * @property {int} initialValueCount - How many values were in the array at the start?
 * @property {Array} values - The array of values, of type, type.
 */

/**
 * Create a store, 
 * That stores an array of a single type.
 * @param {types} valuesType - [The type of the value, based on the typedef]
 * @return {store} 
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
 * @param {types} valuesType - The wanted type
 * @param {number} valuesCount - The wanted number
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
 * @param {*} a - Anything
 * @param {*} b - To be compared to first
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

/**
 * Check if a stores values (the array) have been changed, since it was created.
 * @private
 * @param {store} store 
 * @returns {bool}
 */
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
 * @param {store} store - the given store from createStore
 * @returns {bool} whether or not the store was altered
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
 * @param {store} store - To have a "clean" copy made from.
 * @returns {store} - A new version of the store. Never a reference to the old one.
 */
export function createCleanedStore( store ){
    
    const hasStoreBeenChanged = store.hasBeenChanged || hasBeenChanged(store);

    const cleanedStore = ( hasStoreBeenChanged ) ? createStore( store.type, store.initialValueCount ) : {...store};

    return cleanedStore;
}