import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import classnames from 'classname';
import registerUser from '../../actions/authAction';

class Register extends Component {
    constructor(){
        super();

        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: ''
        }
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit = e =>{
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
        }

        this.props.registerUser(newUser);
    }

    render() {
        const {errors} = this.state;
        const {user} = this.props.auth;
        return(
            <div className="register">
                {user ? user.name : null}
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form noValidate action="create-profile.html" onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <input type="text" placeholder="Name" name="name"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid' : errors.name
                                        })}
                                        value={this.state.name}
                                        onChange={this.onChange}
                                     />
                                     {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                                <div className="form-group">
                                    <input type="email" placeholder="Email Address" name="email" autoComplete="username"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid' : errors.email
                                        })}
                                        value={this.state.email}
                                        onChange={this.onChange}
                                    />
                                    <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                                <div className="form-group">
                                    <input type="password" placeholder="Password" name="password" autoComplete="new-password"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid' : errors.password
                                        })}
                                        value={this.state.password}
                                        onChange={this.onChange}
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>
                                <div className="form-group">
                                    <input type="password" placeholder="Confirm Password" name="password2" autoComplete="new-password"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid' : errors.password2
                                        })}
                                        value={this.state.password2}
                                        onChange={this.onChange}
                                    />
                                    {errors.password2 && <div className="invalid-feedback">{errors.password2}</div>}
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProp = state => ({
    auth: state.auth
});

export default connect(mapStateToProp, {registerUser})(Register);