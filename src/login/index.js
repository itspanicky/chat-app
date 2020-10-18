import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const firebase = require("firebase");

class LoginComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      loginError: ""
    }
  }

  render() {
    const { classes } = this.props;
    const { loginError } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">Log In!</Typography>
          <form onSubmit={(e) => this.submitLogIn(e)} className={classes.form}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="login-email-input">
                Enter Your Email
              </InputLabel>
              <Input
                autoComplete="email"
                onChange={(e) => this.userTyping("email", e)}
                autoFocus
                id="login=email-input"
              />
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="login-password-input">
                Enter Your Password
              </InputLabel>
              <Input 
                type="password" 
                onChange={(e) => this.userTyping("password", e)} 
                id="login-password-input"
              />
            </FormControl>
             <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Log In
            </Button>
          </form>

          {loginError ? 
            <Typography compoent="h5" variant="h6" className={classes.errorText}>
              {loginError}
            </Typography> :
            null
          }

          <br></br>
          <Typography component="h5" variant="h6" className={classes.noAccountHeader}>
            Don't Have An Account?
          </Typography>
          <Link to="/signup" className={classes.signUpLink}>Sign Up!</Link>
        </Paper>
      </main>
    )
  }

  userTyping = (type, e) => {
    console.log(type, e);
    switch (type) {
      case "email":
        this.setState({ email: e.target.value });
        break;

      case "password":
        this.setState({ password: e.target.value });
        break;

      default:
        break;
    }
  }

  submitLogIn = (e) => {
    e.preventDefault();
    console.log("Submitting!")
  }
};

export default withStyles(styles)(LoginComponent);