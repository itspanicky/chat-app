import React from "react";
import { Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import styles from "./styles";

const firebase = require("firebase");

class SignupComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      passwordConfirmation: null,
      signupError: ""
    }
  }

  render() {
    const { classes } = this.props;
    const { signupError } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline>

        </CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">Sign Up!</Typography>
          <form onSubmit={(e) => this.submitSignUp(e)} className={classes.form}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-email-input">
                Enter Your Email
              </InputLabel>
              <Input 
                autoComplete="email" 
                onChange={(e) => this.userTyping("email", e)} 
                autoFocus 
                id="signup-email-input"
              />
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-input">
                Enter Your Password
              </InputLabel>
              <Input 
                type="password" 
                onChange={(e) => this.userTyping("password", e)} 
                id="signup-password-input"
              />
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-confirmation-input">
                Confirm Your Password
              </InputLabel>
              <Input 
                type="password" 
                onChange={(e) => this.userTyping("passwordConfirmation", e)} 
                id="signup-password-confirmation-input"
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Submit
            </Button>
          </form>

          {signupError ? 
            <Typography compoent="h5" variant="h6" className={classes.errorText}>
              {signupError}
            </Typography> :
            null
          }
          <br></br>
          <Typography component="h5" variant="h6" className={classes.hasAccountHeader}>
            Already Have An Account?
          </Typography>
          <Link to="/login" className={classes.logInLink}>Log In!</Link>
        </Paper>
      </main>
    )
  }

  userTyping = (type, e) => {
    console.log(type, e);
    switch (type) {
      case "email":
        this.setState({ email: e.target.value  });
        break;

      case "password":
        this.setState({ password: e.target.value });
        break;

      case "passwordConfirmation":
        this.setState({ passwordConfirmation: e.target.value });
        break;

      default:
        break;
    }
  }

  formIsValid = () => this.state.password === this.state.passwordConfirmation;

  submitSignUp = (e) => {
    e.preventDefault();
    console.log("Submitting", this.state);

    if (!this.formIsValid()) {
      this.setState({ signupError: "Passwords do not match! "});
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(authRes => {
        const userObj = {
          email: authRes.user.email
        };
        firebase
          .firestore()
          .collection("users")
          .doc(this.state.email)
          .set(userObj)
          .then(() => {
            this.props.history.push("/dashboard");
          }, dbError => {
            console.log(dbError);
            this.setState({ signupError: dbError.message });
          })
      }, authError => {
        console.log(authError);
        this.setState({ signupError: authError.message });
      })
  }
};

export default withStyles(styles)(SignupComponent);