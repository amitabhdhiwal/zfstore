import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { storeFactory } from './index.js';
import { feathers } from '@feathersjs/feathers';

const serviceName = 'testService';

// Define an asynchronous function to test specific API methods
async function methodTest(store, mockMethod) {
    // Get the current state of the store
    let state = store.getState();

    // Expect the loading state to be false, indicating no pending requests
    expect(state.loading).toBe(false);

    //Trigger the API call with mockService and mockMethod
    const res = store.getState().api(serviceName, mockMethod);

    //Check loading state
    const newState = store.getState();
    expect(newState.loading).toBe(true);

    //Resolve the promise
    await res;
    // Retrieve the updated state after the API call
    const finalState = store.getState();
    // Expect the loading state to remain false, confirming no ongoing requests
    expect(finalState.loading).toBe(false);

    // Expect the data from the `serviceName` to be returned correctly
    // in the state object
    expect(finalState[serviceName]).toEqual({ data: mockMethod });
}

// Function to test the storeFactory function
function storeFactoryTest(app, url) {
    // Create a store using the storeFactory function
    const store = storeFactory(app, url);

    // Loop through each mock method and write a test case
    for (const mockMethod of methods) {
        it(`calling ${mockMethod} should return ${mockMethod} data`, async () => {
            // Call the methodTest function with the current store and mock method
            return methodTest(store, mockMethod)
        })
    }
}

//methods to exposed by feathers, including custom method
const methods = ['find', 'get', 'create', 'update', 'patch', 'remove', 'myCustomMethod'];

//for every method return a mocked value
const mockMethods = {};
methods.forEach(method => {
    mockMethods[method] = vi.fn().mockResolvedValue({ data: method })
});

//mock the service function to run mocked values
function getApp() {
    const app = feathers();
    app.service = vi.spyOn(app, 'service').mockReturnValue(mockMethods);
    return app;
}

describe('storeFactory with null app but url is provided', () => {
    it('should throw an error', () => {
        expect(() => storeFactory(null, 'http://testurl.com')).toThrow('Feathers app is not defined.');
    });
});

describe('storeFactory with app, and url both', () => {
    const app = getApp();
    storeFactoryTest(app, 'http://example.tld');
});

describe('storeFactory with app but without url', () => {
    const app = getApp();
    storeFactoryTest(app);
});