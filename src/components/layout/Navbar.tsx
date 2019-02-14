import React, { Component, Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { AppState } from '../../reducers';
import { logout } from '../../actions/auth';
import { AuthState } from '../../reducers/auth';

interface NavbarProps {
  logout: () => Promise<void>;
  auth: AuthState;
}

class Navbar extends Component<NavbarProps> {
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <Fragment>
        {user ? (
          <Link className="nav-item nav-link" to="/dashboard">
            <i className="fas fa-user inline-icon" />
            {user.displayName}
          </Link>
        ) : (
          ''
        )}
        <a
          className="nav-item nav-link pointer"
          style={{ cursor: 'pointer' }}
          onClick={async () => await this.props.logout()}
        >
          Logout
        </a>
      </Fragment>
    );

    const authRoutes = (
      <Fragment>
        <NavLink className="nav-item nav-link" to="/dashboard">
          Dashboard
        </NavLink>
        <NavLink className="nav-item nav-link" to="/add">
          Add Image
        </NavLink>
      </Fragment>
    );

    const guestLinks = (
      <NavLink className="nav-item nav-link" to="/login">
        Login
      </NavLink>
    );

    return (
      <div className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Photo Share
          </Link>
          <button
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle nagivation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <div className="navbar-nav">
              {isAuthenticated ? authRoutes : ''}
            </div>
            <div className="ml-auto d-lg-flex d-md-block">
              <div className="navbar-nav">
                {isAuthenticated ? authLinks : guestLinks}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout },
  null,
  {
    pure: false
  }
)(Navbar);
