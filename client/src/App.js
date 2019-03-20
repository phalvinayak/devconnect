import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser, logoutUser} from './actions/authAction';

import store from './store';

// React components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

import './App.css';

// Check for token
const token = localStorage.jwtToken;
if(token){
    // Set auth token header auth
    setAuthToken(token);
    // Decode token and get user info and exp
    const user = jwt_decode(token);
    // Set current user and isAuthenticated
    store.dispatch(setCurrentUser(user));

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if(user.exp < currentTime){
        // Logout user
        store.dispatch(logoutUser());
        // @TODO: clear current Porfile

        // Redirect to login page
        window.location.href = '/login';
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Navbar />
                        <Route exact path="/" component={Landing} />
                        <div className="container">
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                        </div>
                        <Footer />
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
