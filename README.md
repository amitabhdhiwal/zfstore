
# Zustand + Feathers Store Factory

A factory function to create a Zustand store with Feathers.js integration for API calls.

## Installation
```bash
npm install zustand feathers axios zustand-feathers
```

## Usage

```js
//lib/stores.js
import { storeFactory } from 'zustand-feathers';

// Create store with default Feathers app and URL
export const useApiStore = storeFactory();

// Or with custom configuration
export const useCustomStore = storeFactory(myFeathersApp, 'https://api.example.com');
```
In some react component:
```js
// components/MyComponent.jsx
import { useApiStore } from './lib/stores.js';

export default function MyComponent() {
  const { loading, error, todos } = useApiStore();
  
  const fetchData = async () => {
    await useApiStore().api('todos', 'find', { query: { completed: false } });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={fetchData}>Reload Todos</button>
      <ul>
        {todos.map(todo => (
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