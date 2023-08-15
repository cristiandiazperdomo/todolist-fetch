import React, { useState, useEffect, useRef } from "react";

import "./Home.css";
const USERNAME = "cristian";
const URL_API = "https://playground.4geeks.com/apis/fake/todos/user/" + USERNAME;

const Home = () => {
	const [todos, setTodos] = useState([]);
	const [taskCounter, setTaksCounter] = useState(0);
	const [inputValue, setInputValue] = useState("");

	// CALL PREV USERS TASKS

	const input = useRef();

	const handleNewTodo = (e) => {
		e.preventDefault();

		const newTask = {
			done: false,
			id: todos.length + 1,
			label: inputValue,
		}

		// ADD
		setTodos([...todos, newTask]);
		putUserNewTask([...todos, newTask]);
		setTaksCounter([...todos, newTask].length);

		// CLEAN
		setInputValue("");
		cleanInput();
	}

	const cleanInput = () => input.current.value = "";

	const handleDeleteTask = (id) => {
		console.log(id);
		const setTodosList = todos.filter((todo, index) => index + 1 !== id);
		deleteOneSingleTask(setTodosList);
		setTodos(setTodosList);
		setTaksCounter(setTodosList.length);
	}

	const createUser = async () => {
		try {
			let response  = await fetch(URL_API, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify([]),
			});
			const data = await response.json();
			console.log(data.msg);
			return data.msg;
		} catch (error) {
			console.log(error);
		}
	}

	const putUserNewTask = async (todos) => {
		await fetch(URL_API, {
			method: "PUT",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(todos),
		})
	}


	const getUserPrevTasks = async () => {
		const getTodos = await (await fetch(URL_API)).json();
		setTodos(getTodos); 
		setTaksCounter(getTodos.length);
	}


	const deleteOneSingleTask = async (todos) => {
		await fetch(URL_API, {
			method: "PUT",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(todos),
		})
	}

	const deleteEveryTasks = async () => {
		try {
			await fetch(URL_API, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			}).then(response => {
				if (response.ok) {
					console.log("user deleted");
					setTodos([]);
					setTaksCounter(0);
				} else {
					console.log("No funciono : )");
				}
			})
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		createUser()
			.then(msg => {
				if (msg !== "The user " + USERNAME + " dosen't exists") {
					getUserPrevTasks();
				}
			})
	}, []);


	return (
		<div className="bg-info h-100 d-flex flex-column pt-5 align-items-center">
			<p className="text-white fw-light fs-1">todos</p>
			<div className="w-50 d-flex flex-column">
				<form onSubmit={handleNewTodo} className="w-100" >
					<input ref={input} className="w-100 form-control rounded-0" type="text" name="todo" id="input" onChange={(e) => setInputValue(e.target.value)}/>
					<input type="submit" className="d-none" value=""/>
				</form>
				<ul className="list-group w-100">
					{todos.length > 0 && todos.map( (todo) => 
						<li 
							className="list-group-item lista d-flex justify-content-between border-left-0 border-right-0 rounded-0" 
							key={todo.id} 
						>
							<p id="lista" className="w-100 h-100">
								{todo.label}
							</p>
							<span type="button" id="trash" className="" onClick={() => handleDeleteTask(todo.id)}>
								X
							</span>
						</li>
					)}
				</ul>
				{ taskCounter > 0 
					&& 	<ul className="list-group w-100 border-top-0 rounded-0">
							<li className="list-group-item border-top-0 rounded-0">{taskCounter} items left <button onClick={() => deleteEveryTasks()} className="btn btn-primary">Eliminar todas las tareas</button></li>
						</ul>}
			</div>
		</div>
	);
};

export default Home;
