
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
 *      types : valuesType,
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


export function hasBeenChanged(){

}

export function createCleanedStore(){
    
}