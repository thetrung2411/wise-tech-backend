import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import Login from './pages/login/login';
import TreeDashboard from './pages/tree-dashboard/treeDashboard';
import TreeEditor from './pages/tree-editor/treeEditor';
import AuthenticationContext, { AuthenticationProvider } from './services/authenticationContextProvider';

import './app.scss';

const client = new ApolloClient({
    uri: '/graphql',
});

function App() {
    const [authenticationData, setAuthenticationData] = useState(AuthenticationContext);

    useEffect(() => {}, [authenticationData]);

    function clearAuthenticationData() {
        setAuthenticationData({ ...authenticationData, isLoggedIn: false });
    }

    async function updateAuthenticationData(user) {
        cogoToast.loading('Loading Authentication Info', {
            hideAfter: 2,
        });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    setAuthenticationData(user);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }, 2000);
        });
    }

    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <AuthenticationProvider
                    value={{ authenticationData, clearAuthenticationData, updateAuthenticationData }}
                >
                    <Switch>
                        <Route path='/login' component={Login} />
                        <Route path='/dashboard'>
                            <TreeDashboard treeStatus='published' />
                        </Route>
                        <Route path='/drafts'>
                            <TreeDashboard treeStatus='draft' />
                        </Route>
                        <Route path={'/tree/'} component={TreeEditor} />
                        <Redirect path='/' to='login' />
                    </Switch>
                </AuthenticationProvider>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default App;
