import { useEffect, useState } from 'react'
import './App.css'

type ToDoItem = {
createdAt: Date
id: string
isDone: boolean
label: string
updatedAt: Date
}

const App = () => {
  const [toDoList, setToDoList] =  useState([]);
  const [newToDo, setNewToDo] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchToDoList();
  }, []);
  
  const fetchToDoList = async () => {
    try {
      const response = await fetch('https://staging-workshop-cityjs-london-2024-auJTOQ.keelapps.xyz/api/json/listTodos', {method: "POST", body: JSON.stringify({first:100000000000000})});
      const data = await response.json();
      setToDoList(data.results);
    } catch (error) {
      console.error('Error fetching To Do list:', error);
    }
  };

  const updateDoneState = async (id: string) => {
    try {
      const response = await fetch(`https://staging-workshop-cityjs-london-2024-auJTOQ.keelapps.xyz/api/json/updateTodo/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDone: true,
        }),
      });
      await response.json();
      fetchToDoList();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  const submitNewToDo = async (label: string) => {
    try {
      const response = await fetch('https://staging-workshop-cityjs-london-2024-auJTOQ.keelapps.xyz/api/json/createTodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label,
        }),
      });
      await response.json();
      fetchToDoList();
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setNewToDo('');
    }
  }

  return (
    <>
      <div>
      </div>
      <h1>TODO</h1>
      <form onSubmit={(event) => {event.preventDefault(); submitNewToDo(newToDo)}}>
      <input type="text" placeholder="Add a new todo" value={newToDo} onChange={(event) => {setNewToDo(event?.target.value)}} />
      <button >SUBMIT</button>
      </form>
      <input type="text" placeholder="Filter To Do items" value={filter} onChange={(event) => {setFilter(event?.target.value)}} />
      <ul style={{listStyle: "none"}}>
        {toDoList?.filter((toDo: ToDoItem) => toDo.label.includes(filter)).map((toDoItem: ToDoItem) => (
          <li key={toDoItem.id}>
          <input type="checkbox" checked={toDoItem.isDone} onClick={() => {updateDoneState(toDoItem.id)}}/>
            {toDoItem.label}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
