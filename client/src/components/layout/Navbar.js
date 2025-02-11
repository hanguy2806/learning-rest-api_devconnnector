import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileAction';

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <a
            href='#'
            onClick={this.onLogoutClick.bind(this)}
            className='nav-link'
          >
            <img
              className='rounded-circle'
              src={user.avatar}
              alt={user.name}
              style={{ width: '25px', marginRight: '5px' }}
              title='You must have a Gravatar connected to your email to display image'
            />
            Log Out
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul>
        <li>
          <Link className='nav-link' to='/register'>
            Register
          </Link>
        </li>
        <li>
          <Link className='nav-link' to='/login'>
            Login
          </Link>
        </li>
      </ul>
    );
    return (
      <nav className='navbar bg-dark'>
        <h1>
          <Link className='navbar-brand' to='/'>
            Dev Connector
          </Link>
        </h1>
        <ul>
          <li>
            <Link className='nav-link' to='/profile'>
              Developers
            </Link>
          </li>
        </ul>
        {isAuthenticated ? authLinks : guestLinks}
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(
  Navbar
);
