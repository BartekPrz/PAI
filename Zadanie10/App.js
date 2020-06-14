import React from "react"
import Filter from "./Filter"
import ToDoList from "./ToDoList"
import NewTask from "./NewTask"

class App extends React.Component {
    
    constructor() {
        super();
        this.state = {
            hide: false,
            todos: [],
        }
        this.id = 1;
        this.addTodo = this.addTodo.bind(this)
        this.filter = this.filter.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange(id) {
        this.setState(prevState => {
            const updatedTodos = prevState.todos.map(todo => {
                if(todo.id === id) {
                    return {
                        ...todo,
                        done: !todo.done
                    }
                }
                return todo
            })
            return {
                todos: updatedTodos
            }
        })
    }
    
    filter() {
        this.setState(prevState => {
            if(prevState.hide) return {hide: false};
            else return {hide: true};
        })
    }
    
    addTodo(todo) {
        const todos = this.state.todos;
        todos.push({name: todo, done: false, id: this.id});
        this.setState({todos});
        this.id += 1;
    }
    
    render() {
        return (
            <div className="main">
                <h1>Welcome to my To Do list!</h1>
                <div className="border">
                    <Filter filter={this.filter}/>
                    <hr />
                    <ToDoList hide={this.state.hide} todos={this.state.todos} handleChange={this.handleChange}/>
                    <hr />
                    <NewTask addTodo={this.addTodo} />
                </div>
            </div>
        )
    }
}

export default App
