import React from 'react'

class MessagesContainer extends React.Component {
    constructor(props) {
        super(props)
        this.allMessages = props.allMessages
        this.myRef = React.createRef()
    }

    componentDidMount() {
        this.myRef.current.scrollTop = this.myRef.current.scrollHeight
    }

    render() {
        return (
            <div ref={this.myRef} style={{ height: "320px", display: "block", overflow: "auto" }}>
                {this.allMessages.map(message => {
                    if (message.messageAuthorFirstName === "Me") {
                        return <h5
                            style={{ textAlign: "right" }}
                            key={message._id}>{message.messageContent} :{message.messageAuthorFirstName}</h5>
                    } else {
                        return <h5
                            style={{ textAlign: "left" }}
                            key={message._id}>{message.messageAuthorFirstName}: {message.messageContent}</h5>
                    }
                })}
            </div>
        )
    }
}

export default MessagesContainer