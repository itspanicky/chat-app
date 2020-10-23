import React from "react";
import ChatListComponent from "../chatList";
import ChatViewComponent from "../chatView";
import ChatTextBoxComponent from "../chatTextBox";
import NewChatComponent from "../newChat";
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

        {
          selectedChat !== null && !newChatFormVisible ? 
            <ChatTextBoxComponent messageReadFn={this.messageRead} submitMessageFn={this.submitMessage} /> :
            null
        }

        {newChatFormVisible ? <NewChatComponent goToChatFn={this.goToChat} newChatSubmitFn={this.newChatSubmit} /> : null}

        <Button onClick={this.signOut} className={classes.signOutBtn}>
          Sign Out
        </Button>
      </>
    )
  }

  signOut = () => firebase.auth().signOut();

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
  }

  submitMessage = (msg) => {
    const { chats, selectedChat, email } = this.state;
    const docKey = this.buildDocKey(chats[selectedChat].users.filter(_usr => _usr !== email)[0]);
    // ie. docKey = abe@email.com:bob@email.com

    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        // append to messages array
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: email,
          message: msg,
          timestamp: Date.now()
        }),
        receiverHasRead: false
      });
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  newChatBtnClicked = () => this.setState({ newChatFormVisible: true, selectedChat: null });

  messageRead = () => {
    const { chats, selectedChat, email } = this.state;
    const docKey = this.buildDocKey(chats[selectedChat].users.filter(_usr => _usr !== email)[0]);
    if (this.clickedChatWhereNotSender(selectedChat)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true })
    } else {
      console.log("Clicked message where the user was the sender");
    }
  }

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
    this.setState({ newChatFormVisible: false });
    await this.selectChat( this.state.chats.indexOf(chat));
    this.submitMessage(msg);
  }

  newChatSubmit = async (chatObj) => {
    const docKey = this.buildDocKey(chatObj.sendTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        messages: [{
          message: chatObj.message,
          sender: this.state.email
        }],
        receiverHasRead: false,
        users: [this.state.email, chatObj.sendTo]
      })

    this.setState({ newChatFormVisible: false });
    console.log("this.state.chats");
    this.selectChat(this.state.chats.length - 1);
  }

  clickedChatWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;

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