import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { GithubProvider } from './context/context'
import { Auth0Provider } from '@auth0/auth0-react'
// dev-mhyzeg1ti4u6wr0i.us.auth0.com
// g2RfYbZ4qpE2z6USvkyKgGOZt6whhOq4
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain='dev-mhyzeg1ti4u6wr0i.us.auth0.com'
      clientId='g2RfYbZ4qpE2z6USvkyKgGOZt6whhOq4'
      redirectUri={window.location.origin}
      cacheLocation='localstorage'
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
