import React, { Component } from 'react';
import { auth, githubAuthProvider } from '../../firebase';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { Redirect } from 'react-router';

interface LoginProps {
  isAuthenticated: boolean;
}

export class Login extends Component<LoginProps> {
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title lead">Login</h3>
            <button
              className="btn btn-block btn-dark"
              onClick={() => auth.signInWithPopup(githubAuthProvider)}
            >
              Login With GitHub
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect<LoginProps>(
  mapStateToProps,
  { login }
)(Login);
