import {
    createStore,
    types,
    generateValues,
    uniqueness,
    hasBeenChanged,
    createCleanedStore
} from "../src/index.js"

describe("A function to generate values for the object", () => {
    test("Check that the array adheres to the uniqueness object", () => {
        const typesArray = Object.keys(types);

        typesArray.forEach( type => {
            const store = createStore( type );

            const givenUniqueness = uniqueness[type];

            if(givenUniqueness){
                store.values.forEach( value => {
                    //Expect to find the given value, and no more.
                    const matchingValues = store.values.filter( findValue => findValue == value );
                    expect(matchingValues.length).toBe(1);
                });
            }
        });
    });

    test("Check that the expected number of items are in the array", () => {
        const count = [...Array(50)].map( (_, index) => index );

        count.forEach( length => {
            const store = createStore(typeof("string"), length);

            expect(store.initialCount).toBe(length);
            expect(store.values.length).toBe(length);
        });
    });

    test("Check that the values are of the expected type", () => {
        const typesArray = Object.keys(types);

        typesArray.forEach( type => {
            const store = createStore( type );

            store.values.forEach( value => {
                expect(typeof(value)).toBe(type);
            });
        });
    });
});