  
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';

class ChatTextBoxComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      chatText: ""
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField 
          id="chattextbox"
          placeholder="Type your message..." 
          onKeyUp={(e) => this.userTyping(e)}
          onFocus={this.userClickedInput}
          className={classes.chatTextBox}
        />

        <Send onClick={this.submitMessage} className={classes.sendBtn} />
      </div>
    )
  }

  userTyping = (e) => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });

  messageValid = (txt) => txt && txt.replace(/\s/g, "").length

  submitMessage = () => {
    const { chatText } = this.state;
    
    if (this.messageValid(chatText)) {
      this.props.submitMessageFn(chatText);
      document.getElementById("chattextbox").value = "";
    }
  }

  userClickedInput = () => this.props.messageReadFn();
};

export default withStyles(styles)(ChatTextBoxComponent)