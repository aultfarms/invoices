import assert from 'node:assert/strict';
import test from 'node:test';
import {
  feedDeliveredCardToRecord,
  isCustomerLoad,
  isNotInvoicedCustomerLoad,
} from '../dist/feed.js';

function card(name, labels) {
  return {
    id: 'card',
    idList: 'list',
    idBoard: 'board',
    name,
    closed: false,
    dateLastActivity: '2026-05-01T00:00:00.000Z',
    desc: '',
    labels,
    pos: 1,
  };
}

const customerName = '2026-05-01: CIE 12.  4,000 lbs - Devon Zimmerman - Brock';
const homeName = '2026-05-01: CIE 12.  4,000 lbs - Home - Brock';

test('a card with no labels is an uninvoiced customer load', () => {
  const record = feedDeliveredCardToRecord(card(customerName, []));
  assert.equal(record.error, undefined);
  assert.equal(record.invoiced, false);
  assert.equal(record.paidFor, false);
  assert.equal(record.truckingPaid, false);
  assert.equal(record.dest, 'DEVON ZIMMERMAN');
  assert.equal(isCustomerLoad(record), true);
  assert.equal(isNotInvoicedCustomerLoad(record), true);
});

test('an orange label object means the customer load is invoiced', () => {
  const record = feedDeliveredCardToRecord(card(customerName, [
    { id: 'label-orange', color: 'orange', name: 'Invoiced customer' },
  ]));
  assert.equal(record.invoiced, true);
  assert.equal(record.paidFor, false);
  assert.equal(isCustomerLoad(record), true);
  assert.equal(isNotInvoicedCustomerLoad(record), false);
});

test('a green label object means the vendor was paid', () => {
  const record = feedDeliveredCardToRecord(card(customerName, [
    { id: 'label-green', color: 'green', name: 'Paid vendor' },
  ]));
  assert.equal(record.invoiced, false);
  assert.equal(record.paidFor, true);
  assert.equal(record.truckingPaid, false);
  assert.equal(isNotInvoicedCustomerLoad(record), true);
});

test('a blue label object means trucking was paid', () => {
  const record = feedDeliveredCardToRecord(card(customerName, [
    { color: 'blue', name: 'Brad Invoiced' },
  ]));
  assert.equal(record.truckingPaid, true);
  assert.equal(record.invoiced, false);
  assert.equal(record.paidFor, false);
});

test('a bare orange color string still counts as invoiced', () => {
  const record = feedDeliveredCardToRecord(card(customerName, ['orange']));
  assert.equal(record.invoiced, true);
  assert.equal(isNotInvoicedCustomerLoad(record), false);
});

test('an unrelated label object does not count as invoiced, paid, or trucking paid', () => {
  const record = feedDeliveredCardToRecord(card(customerName, [
    { color: 'red', name: 'something else' },
    { name: 'no color' },
  ]));
  assert.equal(record.invoiced, false);
  assert.equal(record.paidFor, false);
  assert.equal(record.truckingPaid, false);
  assert.equal(isNotInvoicedCustomerLoad(record), true);
});

test('Home deliveries are not customer loads, invoiced or not', () => {
  const record = feedDeliveredCardToRecord(card(homeName, []));
  assert.equal(record.dest, 'HOME');
  assert.equal(record.invoiced, false);
  assert.equal(isCustomerLoad(record), false);
  assert.equal(isNotInvoicedCustomerLoad(record), false);
  assert.equal(isCustomerLoad({ dest: ' home ' }), false);
  assert.equal(isNotInvoicedCustomerLoad({ dest: 'Home', invoiced: false }), false);
  assert.equal(isCustomerLoad({ dest: 'Devon Zimmerman' }), true);
});
