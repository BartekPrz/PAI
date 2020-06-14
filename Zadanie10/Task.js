import React from "react"

class Task extends React.Component {
    
    constructor() {
        super();
        this.state = {
            done: false
        }
        this.onChangeTodo = this.onChangeTodo.bind(this);
    }
    
    onChangeTodo() {
        this.setState(prevState => {
            if (prevState.done) {
                return {
                    done: false
                }
            } else {
                return {
                    done: true
                }
            }
        })
        this.props.handleChange(this.props.id)
    }
    
    render() {
        if(this.props.hide && this.props.done) {
            return (
                <div></div>
            )
        } else {
            return (
                <div>
                    
                    <input type="checkbox" checked={this.props.done} onChange={this.onChangeTodo} />&nbsp;
                    <span style={this.props.done ? {textDecoration: "line-through"} : null}>{this.props.name}</span>
                </div>
            )
        }
    }
}

export default Task
