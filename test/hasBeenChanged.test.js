import {
    createStore,
    types,
    generateValues,
    uniqueness,
    hasBeenChanged,
    createCleanedStore
} from "../src/index.js"
import { exportAllDeclaration } from "@babel/types";

describe("A function that checks if the store has been changed", () => {

    //callback = ( store, type ) => {};
    const forEachStoreType = ( callback ) => {
        const storeTypes = Object.keys(types);

        storeTypes.forEach( type => {
            const store = createStore(type);

            callback( store, type );
        });
    }

    const parentTestName = `test that it returns true when ANY of the following are met :`;
    test(`${parentTestName} The store's type has been altered`, () => {
        forEachStoreType( (store, type) => {
            const alteredStore = {...store};
            //Change the stores type
            alteredStore.type = "This is an invalid type";
            expect(hasBeenChanged(alteredStore)).toBe(true);
        });
    });

    test(`${parentTestName} The length of values doesn't match the initialCount`, () => {
        forEachStoreType( (store, type) => {
            const alteredStore = {...store};
            alteredStore.type = "This is an invalid type";

            const firstValue = (alteredStore.values.length) ? alteredStore.values[0] : undefined;
            alteredStore.values.push(firstValue);
            expect(hasBeenChanged(alteredStore)).toBe(true);
        });
    });

    test(`${parentTestName} The values in the values array aren't the default values for the given type`, () => {
        forEachStoreType( (store, type) => {
            const duplicateStore = {...store};
            duplicateStore.values[0] = !!!duplicateStore.values[0];

            //( store.values.length ) ? store.values[0] = 10 : null;
            expect(hasBeenChanged(duplicateStore)).toBe(true);
        });
    });

    test(`${parentTestName} hasBeenChanged is set to true`, () => {
        forEachStoreType( (store, type) => {
            const alteredStore = {...store};
            alteredStore.hasBeenChanged = true;
            expect(hasBeenChanged(alteredStore)).toBe(true);
        });
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    test("returns false when ALL the following are met : ", () => {
        forEachStoreType( (store, type) => {
            //The initialCount matches values length
            expect(store.values.length).toBe(store.initialValueCount);

            //The types in the array match the type in the object
            store.values.forEach(value => {
                expect(typeof(value)).toBe(type);
            });
            
            // hasBeenAltered is set to false
            expect(store.hasBeenChanged).toBe(false);

            // check that it's false:
            expect(hasBeenChanged(store)).toBe(false);     
        });
    });
});