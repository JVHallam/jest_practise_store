import {
    createStore,
    types,
    generateValues,
    uniqueness,
    hasBeenChanged,
    createCleanedStore
} from "../src/index.js";

//Returns an identical copy of the object if it's not been changed
describe('A function that creates a "cleaned" version of the store, given to it.', () => {
    //callback = ( store, type ) => {};
    const forEachStoreType = ( callback ) => {
        const storeTypes = Object.keys(types);

        storeTypes.forEach( type => {
            const store = createStore(type);

            callback( store, type );
        });
    }

    test("Returns an identical copy of the object if it's not been changed", () => {
        forEachStoreType( ( store, type ) => {
            const cleanedStore = createCleanedStore(store);
            expect(store).toEqual(cleanedStore);

            //expect it not just to return a refernce to the original store.
            expect(store).not.toBe(cleanedStore);
        });
    });

    test("A store with more values than it's initial count has the values list reset", () => {
        forEachStoreType( ( store, type ) => {
            const storeCopy = {...store};

            const pushedValue = storeCopy.values[0];
            storeCopy.values.push(pushedValue);

            const cleanedStore = createCleanedStore(storeCopy);

            expect(cleanedStore.length).toBe(cleanedStore.initialCount);
            expect(cleanedStore.length).toBe(store.initialCount);
        });
    });

    test("A store where the type doesn't match the types in the array, is reset", () => {
        /* Change the type of the values */
        expect("Test to have been implemented").toBe(true);
    });

    test("A store that has an invalid type has a type error thrown when being cleaned", () => {
        forEachStoreType( ( store, type ) => { 
            store.type = "this is a nonsense type";
            expect(createCleanedStore(store)).toThrow(/type/);
        });
    });

    test("Has been changed is reset to false", () => {
        forEachStoreType( ( store, type ) => { 
            store.hasBeenChanged = true;
            const cleanedStore = createCleanedStore(store);
            expect(cleanedStore.hasBeenChanged).toBe(false);
            expect(store.hasBeenChanged).toBe(true);
        });
    });
});