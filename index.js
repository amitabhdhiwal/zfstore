import { feathers } from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import axios from 'axios'
import { create } from 'zustand';

/**
 * Factory function to create a store with Zustand and Feathers
 *
 * @param {object} app - A Feathers.js application instance.
 * @param {string} url - The base URL for the REST API.
 * @returns {function} - A zustand store
 */
export function storeFactory(app, url) {
    // Check if app and url are provided or set defaults if not
    if (!app && !url) {
        // Create a new Feather app if not provided
        app = feathers();
    } else if (app && typeof app === 'string') {
        //app is a url, instead of a feathers app.
        url = app;
        app = feathers();
    }

    // if app, and url are passed but app is undefined. Did the user meant to pass app?
    if (!app) {
        throw new Error("Feathers app is not defined.");
    }

    // Create REST client using fetch
    const restClient = rest(url);
    app.configure(restClient.axios(axios));

    // Return a store with state management and API fetch logic
    return create((set) => ({
        loading: false, // State flag for loading status
        error: null,  // State variable for error message
        api: async (service, method, ...args) => {
            // Set loading state to true
            set({ loading: true });

            try {
                // Make an API call using the service and method
                const data = await app.service(service)[method](...args);
                // Prepare updates object
                const updates = { loading: false, [service]: data };

                // Set state with updates
                set(updates);
            } catch (e) {
                console.log("err", e.message);
                // Set loading state to false and error message
                set({ loading: false, error: e.message });
            }
        },
    }));
}

export default { storeFactory }