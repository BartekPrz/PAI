import React from "react"
import Task from "./Task"

class ToDoList extends React.Component {
    
    
    
    render() {
        let number = 0;
        this.props.todos.map(todo => {
           if(!todo.done) number += 1
        });
        
        if(number > 0) 
            return (
                <div>
                    {this.props.todos.map(todo => (
                       <Task key={todo.id} name={todo.name} done={todo.done} handleChange={this.props.handleChange} id={todo.id} hide={this.props.hide}/> 
                    ))}
                </div>
            )
        else if (number == 0 && !this.props.hide && this.props.todos.length > 0)
            return (
                <div>
                    {this.props.todos.map(todo => (
                       <Task key={todo.id} name={todo.name} done={todo.done} handleChange={this.props.handleChange} id={todo.id} hide={this.props.hide}/> 
                    ))}
                </div>
            )
        else
            return (
                <div>
                    Nothing to do...
                </div>
            ) 
    }
}

export default ToDoList
