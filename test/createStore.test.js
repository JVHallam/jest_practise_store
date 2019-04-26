import {
    createStore,
    types,
    generateValues,
    uniqueness,
    hasBeenChanged,
    createCleanedStore
} from "../src/index.js";

describe("A function to create the store", () => {
    test("It returns an object with the expected keys", () => {
        const store = createStore();

        const expectedKeys = [
            "types",
            "hasBeenChanged",
            "initialValueCount",
            "values"
        ];
    
        const objectKeys = Object.keys(store);

        expect(objectKeys).toEqual(
            expect.arrayContaining(expectedKeys)
        );
    });

    test("'types' property matches the given type", () => {
        //Should be the array from the frozen object.
        const givenTypes = Object.keys(types);

        expect(givenTypes.length).not.toBe(0);

        givenTypes.forEach( type => {
            const store = createStore(type);
            expect(store.type).toEqual(type);
        });
    });

    test("'values' property is an array of values, with the type of given", () => {
        //Should be the array from the frozen object.
        const givenTypes = Object.keys(types);

        expect(givenTypes.length).not.toBe(0);

        givenTypes.forEach( type => {
            const store = createStore(type);
            
            store.values.forEach( value => {
                expect(typeof(value)).toBe(type);
            });
        });
    });

    test("'hasBeenChanged' property defaults to false", () => {
        const store = createStore();

        expect(store.hasBeenChanged).toBe(false);
    });

    test("'values' property is the length of the count given", () => {
        const lengths = [...Array(50)].map( (_, index) => index );

        lengths.forEach( length => {
            const store = createStore(typeof(""), length);

            expect(store.values.length).toBe(length);
        });
    });

    test("'values' property has the following uniqueness for the following types", () => {
        const givenTypes = Object.keys(types);
        
        expect(givenTypes.length).not.toBe(0);

        givenTypes.forEach( type => {
            const store = createStore(type);
            const expectedUniqueness = uniqueness[type];

            if(expectedUniqueness){
                store.values.forEach( value => {
                    //Expect to find the given value, and no more.
                    const matchingValues = store.filter( findValue => findValue == value );
                    expect(matchingValues.length).toBe(1);
                });
            }
        });
    });

    test("function throws an exception if given an unrecognised type", () => {
        const nonsenseType = 'this is a failing type';

        expect( createStore(nonsenseType) ).toThrow(/type/);
    });
});