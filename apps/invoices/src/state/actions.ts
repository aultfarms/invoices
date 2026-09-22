import { action, runInAction } from 'mobx';
import debug from 'debug';
import * as trellolib from '@aultfarms/trello';
import { feed, type FeedRecord } from '@aultfarms/trucking';
import type { InvoiceFilter } from '../filters';
import { state } from './state';

const warn = debug('af/invoices:warn');
const info = debug('af/invoices:info');

export const setFilter = action('setFilter', (filter: InvoiceFilter) => {
  state.filter = filter;
});

export const closeMsg = action('closeMsg', () => {
  state.msg.open = false;
});

export const loadFeedBoard = action('loadFeedBoard', async (force?: true) => {
  runInAction(() => { state.loading = true; });
  try {
    const client = await trello();
    const fb = await feed.feedBoard(force ? { client, force } : { client });
    runInAction(() => {
      state.feedBoard = fb;
      state.loading = false;
      state.trelloAuthorized = true;
    });
  } catch (e) {
    warn('Failed to load the Feed board', e);
    runInAction(() => {
      state.loading = false;
      state.msg = { open: true, text: 'Could not load the Feed board.' };
    });
  }
});

export const markInvoiced = action('markInvoiced', async (record: FeedRecord) => {
  if (!record.id || record.invoiced || state.markingId) return;
  const cardId = record.id;
  runInAction(() => { state.markingId = cardId; });
  try {
    info('Marking one delivered card invoiced');
    await feed.markFeedDeliveredInvoiced({ client: await trello(), cardId });
    await loadFeedBoard(true);
    runInAction(() => {
      state.msg = { open: true, text: 'Marked invoiced.' };
    });
  } catch (e) {
    warn('Failed to mark a load invoiced', e);
    runInAction(() => {
      state.msg = { open: true, text: 'Could not mark that load invoiced.' };
    });
  } finally {
    runInAction(() => { state.markingId = ''; });
  }
});

let _trello: trellolib.client.Client | null = null;
export const trello = action('trello', async () => {
  if (!_trello) {
    _trello = trellolib.getClient();
    await _trello.connect({ org: trellolib.defaultOrg });
  }
  return _trello;
});

export const loginWithTrello = action('loginWithTrello', async () => {
  info('LoginWithTrello: connecting to Trello (may redirect for auth)');
  await trello();
});

export const logoutTrello = action('logoutTrello', async () => {
  try {
    const client = trellolib.getClient();
    await client.deauthorize();
  } catch (e) {
    warn('Failed to deauthorize Trello', e);
  } finally {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
});
