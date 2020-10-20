import React from "react";
import ChatListComponent from "../chatList";
import ChatViewComponent from "../chatView";
import { Button, withStyles } from "@material-ui/core";
import styles from "./styles";

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
    const { email, chats, newChatFormVisible, selectedChat} = this.state; 
    const { classes } = this.props

    return (
      <>
        <ChatListComponent 
          history={this.props.history} 
          newChatBtnFn={this.newChatBtnClicked}
          selectChatFn={this.selectChat}
          chats={chats}
          userEmail={email}
          selectedChatIndex={selectedChat}
        />

        {
          newChatFormVisible ? 
            null : 
            <ChatViewComponent
              user={email}
              chat={chats[selectedChat]}
            />
        }

        <Button onClick={this.signOut} className={classes.signOutBtn}>
          Sign Out
        </Button>
      </>
    )
  }

  signOut = () => firebase.auth().signOut();

  selectChat = (chatIndex) => {
    this.setState({ selectedChat: chatIndex })
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

export default withStyles(styles)(DashboardComponent);