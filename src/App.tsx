import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import MainDashboard from "./components/MainDashboard";

const client = generateClient<Schema>();

function App() {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    // client.models.Todo.observeQuery().subscribe({
    //   next: (data) => setTodos([...data.items]),
    // });
  }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  const { user, signOut } = useAuthenticator();
    
  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({ id })
  // }

  return (
<>
      {user?.signInDetails ? <MainDashboard></MainDashboard> : 
            <button onClick={signOut}>Sign out</button>}
            </>
  );
}

export default App;
