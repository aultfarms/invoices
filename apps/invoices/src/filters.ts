import { feed, type FeedRecord } from '@aultfarms/trucking';

export type InvoiceFilter = 'not-invoiced' | 'all-customers' | 'not-paid' | 'trucking-not-paid';

export const filterLabels: { value: InvoiceFilter, label: string }[] = [
  { value: 'not-invoiced', label: 'Not invoiced' },
  { value: 'all-customers', label: 'All customer loads' },
  { value: 'not-paid', label: 'Not paid' },
  { value: 'trucking-not-paid', label: 'Trucking not paid' },
];

export function loadsForFilter(records: FeedRecord[], filter: InvoiceFilter): FeedRecord[] {
  return records.filter(record => {
    if (!feed.isCustomerLoad(record)) return false;
    switch (filter) {
      case 'not-invoiced':
        return feed.isNotInvoicedCustomerLoad(record);
      case 'all-customers':
        return true;
      case 'not-paid':
        return record.paidFor !== true;
      case 'trucking-not-paid':
        return record.driver.trim().toUpperCase() === 'BRAD' && record.truckingPaid !== true;
    }
  });
}

export function groupsForFilter(records: FeedRecord[], filter: InvoiceFilter): { name: string, rows: FeedRecord[] }[] {
  const bySource = filter === 'not-paid' || filter === 'trucking-not-paid';
  const groups = new Map<string, FeedRecord[]>();
  for (const record of loadsForFilter(records, filter)) {
    const key = (bySource ? record.source : record.dest) || '(none)';
    const list = groups.get(key);
    if (list) list.push(record);
    else groups.set(key, [record]);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, rows]) => ({
      name,
      rows: rows.slice().sort((a, b) => a.date.localeCompare(b.date) || a.loadNumber.localeCompare(b.loadNumber)),
    }));
}

export function formatTons(weight: number): string {
  return (weight / 2000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
