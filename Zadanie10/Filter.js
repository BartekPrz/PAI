import React from "react"

class Filter extends React.Component {
    
    constructor() {
        super()
        this.filter = this.filter.bind(this)
    }
    
    filter() {
        this.props.filter()
    }
    
    render() {
        return (
            <div>
                <input type="checkbox" onChange={this.filter}/>&nbsp;
                hide completed
            </div>
        )
    }
}

export default Filter
