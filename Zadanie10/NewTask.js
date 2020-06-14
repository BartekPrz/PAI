import React from "react"

class NewTask extends React.Component {
    
    constructor() {
        super()
        this.add = this.add.bind(this)
        this.keyDown = this.keyDown.bind(this);
    }
    
    add() {
        this.props.addTodo(document.querySelector("input[type='text']").value)
        document.querySelector("input[type='text']").value = ""
    }
    
    keyDown(event) {
        if (event.keyCode === 13) this.add();
    }
    
    render() {
        return (
            <div>
                <input type="text" onKeyDown={this.keyDown}/>
                <button onClick={this.add}>Add</button>
            </div>
        )
    }
}

export default NewTask
