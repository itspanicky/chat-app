import React from "react";
import ChatListComponent from "../chatList";

const firebase = require("firebase");

class DashboardComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      chats: []
    }
  }

  render() {
    const { email, chats, selectedChat} = this.state; 

    return (
      <>
        <div>Dashboard Component</div>
        <ChatListComponent 
          history={this.props.history} 
          newChatBtnFn={this.newChatBtnClicked}
          selectChatFn={this.selectChat}
          chats={chats}
          userEmail={email}
          selectedChatIndex={selectedChat}
        />
      </>
    )
  }

  selectChat = (chatIndex) => {
    console.log("Selected a chat", chatIndex)
  }

  newChatBtnClicked = () => this.setState({ newChatFormVisible: true, selectedChat: null })

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (!_usr) {
        this.props.history.push("/login")
      } else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .onSnapshot(async res => {
            const chats = res.docs.map(_doc => _doc.data());
            await this.setState({
              email: _usr.email,
              chats
            });
            console.log(this.state);
          })
      }
    })
  }
};

export default DashboardComponent;