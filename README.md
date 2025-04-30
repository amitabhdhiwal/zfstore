
# Zustand + Feathers Store

A tiny factory function to create a Zustand store with Feathers.js integration for API calls.

## Installation
```bash
npm install zustand feathers axios zfstore
```

## Usage

```js
//lib/stores.js
import { storeFactory } from 'zfstore';

// Create store with default Feathers app and URL
export const useApiStore = storeFactory();

// Or with custom configuration
import app from './app.js'
export const useCustomStore = storeFactory(app, 'https://api.example.com'); //make sure CORS is enabled for third party APIs.
```
In your react component:
```js
// components/MyComponent.jsx
import { useApiStore } from './lib/stores.js';

export default function MyComponent() {
  //service name variable is automatically added.
  const { loading, error, api, todos } = useApiStore();
  
  const fetchData = () => {
    //service name, service method, optional args as required by your feathers service API.
    api('todos', 'find', { query: { completed: false } });
  };

  useEffect(() => {
    //no need to add async :')
    api('todos', 'find', { query: { completed: false } });
  }, [])

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={fetchData}>Reload Todos</button>
      <ul>
        {todos?.data.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```
The store's state will contain a variable with the name of the service that you called. So here, `todos` will be available, and updated when new calls are made from the client.

## Store API
```ts
interface StoreState {
  loading: boolean;
  error: string | null;
  [service: string]: any; // Service data
}

const store = useMyStore();

// Example API call
store.api('todos', 'find', { query: { completed: false } });
```

## Notes
- Error messages are stored in state for client-side handling
- Loading state is automatically managed