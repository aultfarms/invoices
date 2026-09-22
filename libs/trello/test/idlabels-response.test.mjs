import assert from 'node:assert/strict';
import test from 'node:test';
import { idLabelsWriteSucceeded } from '../dist/response.js';

const path = '/cards/card1/idLabels';

test('an idLabels response that is a list of label ids counts as success', () => {
  assert.equal(idLabelsWriteSucceeded(path, ['orange-label', 'green-label']), true);
  assert.equal(idLabelsWriteSucceeded(path, []), true);
});

test('an idLabels response that is a label object counts as success', () => {
  assert.equal(idLabelsWriteSucceeded(path, { id: 'orange-label', name: 'Invoiced customer', color: 'orange' }), true);
  assert.equal(idLabelsWriteSucceeded(path, [{ id: 'orange-label', color: 'orange' }]), true);
});

test('an idLabels response that is a card still counts as success', () => {
  assert.equal(idLabelsWriteSucceeded(path, {
    id: 'card1',
    name: '2026-09-15: AGRICOR 1.  50,340 lbs - DEVON ZIMMERMAN - Brock',
    labels: ['orange-label'],
    idList: 'list1',
  }), true);
});

test('other endpoints do not treat a label id list as a successful write', () => {
  assert.equal(idLabelsWriteSucceeded('/boards/board1/labels', ['orange-label']), false);
  assert.equal(idLabelsWriteSucceeded('/cards/card1', ['orange-label']), false);
});
