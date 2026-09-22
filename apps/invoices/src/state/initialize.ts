import debug from 'debug';
import * as trellolib from '@aultfarms/trello';
import { loadFeedBoard } from './actions';
import { state } from './state';

const info = debug('af/invoices:info');

export const initialize = async () => {
  debug.log = (...args: unknown[]) => {
    console.log(...args);
  };

  info('Checking Trello authorization');
  const authorized = await trellolib.checkAuthorization();
  if (!authorized) {
    info('Trello not authorized; waiting for user to log in');
    state.loading = false;
    state.trelloAuthorized = false;
    return;
  }

  info('Loading feed board');
  await loadFeedBoard();
};
