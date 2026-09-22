import { observable } from 'mobx';
import type { FeedBoard } from '@aultfarms/trucking';
import type { InvoiceFilter } from '../filters';

export type ActivityMessage = {
  msg: string,
  type: 'good' | 'bad',
};

export type State = {
  msg: { open: boolean, text: string },
  loading: boolean,
  trelloAuthorized: boolean,
  feedBoard: FeedBoard | null,
  filter: InvoiceFilter,
  markingId: string,
};

export const state = observable<State>({
  msg: { open: false, text: '' },
  loading: true,
  trelloAuthorized: false,
  feedBoard: null,
  filter: 'not-invoiced',
  markingId: '',
});
