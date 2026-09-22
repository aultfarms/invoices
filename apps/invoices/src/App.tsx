import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import pkg from '../package.json';
import { LoadTable } from './LoadTable';
import { NavBar } from './NavBar';
import { context } from './state';
import './App.css';

export const App = observer(function App() {
  const { state, actions } = React.useContext(context);

  return (
    <HelmetProvider>
      <Helmet>
        <title>AF/Invoices - v{pkg.version}</title>
      </Helmet>
      <NavBar />
      <div className="main">
        {state.loading
          ? <div>Loading the Feed board...</div>
          : !state.trelloAuthorized
            ? <div>
                <p>You must log in with Trello to use this app.</p>
                <Button variant="contained" onClick={() => actions.loginWithTrello()}>
                  Login with Trello
                </Button>
              </div>
            : !state.feedBoard
              ? <div>The Feed board did not load.</div>
              : <LoadTable />
        }
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={state.msg.open}
        message={state.msg.text}
        autoHideDuration={9000}
        onClose={() => actions.closeMsg()}
      />
    </HelmetProvider>
  );
});
