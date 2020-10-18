import React from "react";
import ChatListComponent from "../chatList";

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

  selectChat = () => {
    console.log("Selected a chat")
  }

  newChatBtnClicked = () => {
    console.log("New chat button clicked")
  }
};

export default DashboardComponent;