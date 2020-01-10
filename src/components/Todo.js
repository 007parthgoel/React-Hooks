import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';


const todo = props => {

    const [todoName, setTodoName] = useState('');
    // const [todoList, setTodoList] = useState([]);
    const [submittedTodo, setSubmittedTodo] = useState(null);
    // const [todoState, setTodoState] = useState({ userInput: '', todoList: [] });

    const todoListReducer = (state, action) => {
        switch (action.type) {
            case 'ADD':
                return state.concat(action.payload);
            case 'SET':
                return action.payload;
            case 'REMOVE':
                return state.filter((todo) => todo.id !== action.payload);
            default:
                return state;
        }
    };

    useEffect(() => {
        axios.get('https://react-hoks.firebaseio.com/todos.json')
            .then(res => {
                console.log(res);
                const todoData = res.data;
                const todos = [];
                for (const key in todoData) {
                    todos.push({ id: key, name: todoData[key].name })
                }
                // setTodoList(todos);
                dispatch({ type: 'SET', payload: todos });
            });
        return () => {
            console.log('cleanup');
        };
    }, [todoName]);

    // useEffect(() => {
    //     if (submittedTodo) {
    //         // setTodoList(todoList.concat(submittedTodo));
    //         dispatch({ type: 'ADD', payload: submittedTodo });
    //     }
    // }, [submittedTodo]);

    const [todoList, dispatch] = useReducer(todoListReducer, []);

    const inputChangeHandler = event => {
        setTodoName(event.target.value);
        // setTodoState({
        //     userInput: event.target.value,
        //     todoList: todoState.todoList
        // });
    };

    const TodoAddHandler = () => {
        // setTodoState({
        //     userInput: todoState.userInput,
        //     todoList: todoState.todoList.concat(todoState.userInput)
        // })

        axios.post('https://react-hoks.firebaseio.com/todos.json', { 'name': todoName })
            .then(res => {
                // console.log(res);
                setTimeout(() => {
                    const todoItem = { id: res.data.name, name: todoName };
                    dispatch({type:'ADD',payload:todoItem});
                    // setSubmittedTodo(todoItem);
                    // setTodoList(todoList.concat(todoItem));
                }, 3000);
            })
            .catch(err => {
                console.log(err);
            });
    }
    const todoRemoveHandler = todoId => {
        axios.delete(`https://react-hoks.firebaseio.com/todos/${todoId}.json`)
            .then(() => {
                dispatch({ type: 'REMOVE', payload: todoId });
            })
            .catch((err) => console.log(err));
    };

    return (
        <React.Fragment>
            <input
                type="text"
                placeholder="Todo"
                onChange={inputChangeHandler}
                // value={todoState.userInput}
                value={todoName}
            />
            <button
                type="button"
                onClick={TodoAddHandler}>Add</button>
            <ul>
                {todoList.map(todo => (
                    <li key={todo.id} onClick={todoRemoveHandler.bind(this, todo.id)}>{todo.name}</li>
                ))}
            </ul>
        </React.Fragment>
    )

};

export default todo;