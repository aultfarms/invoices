import * as React from 'react';
import { observer } from 'mobx-react-lite';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { filterLabels, formatTons, groupsForFilter, type InvoiceFilter } from './filters';
import { context } from './state';

export const LoadTable = observer(function LoadTable() {
  const { state, actions } = React.useContext(context);
  const records = state.feedBoard?.delivered.records ?? [];
  const errors = state.feedBoard?.errors ?? [];
  const groups = groupsForFilter(records, state.filter);
  const count = groups.reduce((sum, group) => sum + group.rows.length, 0);
  const bySource = state.filter === 'not-paid' || state.filter === 'trucking-not-paid';
  const showInvoiceStatus = state.filter === 'all-customers';
  const showMark = state.filter === 'not-invoiced' || state.filter === 'all-customers';

  return (
    <>
      <ToggleButtonGroup
        exclusive
        value={state.filter}
        aria-label="Which loads to show"
        onChange={(_, value: InvoiceFilter | null) => {
          if (value) actions.setFilter(value);
        }}
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
      >
        {filterLabels.map(item => (
          <ToggleButton key={item.value} value={item.value} aria-label={item.label} sx={{ textTransform: 'none' }}>
            {item.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Typography component="p" role="status">
        {count} {count === 1 ? 'load' : 'loads'}
        {' · '}
        <Link component="button" type="button" onClick={() => actions.loadFeedBoard(true)}>Refresh</Link>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Home deliveries are left out of every filter.
      </Typography>

      {errors.map((error, index) => (
        <Alert key={`parse-error-${index}`} severity="warning">{error}</Alert>
      ))}

      {count === 0 ? <Typography>No loads match this filter.</Typography> : null}

      {groups.map(group => (
        <Card key={group.name} variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>{group.name}</Typography>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>{bySource ? 'Destination' : 'Source'}</TableCell>
                    <TableCell align="right">Tons</TableCell>
                    {showInvoiceStatus ? <TableCell>Invoiced</TableCell> : null}
                    {showMark ? <TableCell /> : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.rows.map(record => (
                    <TableRow key={record.id || `${record.date}-${record.source}-${record.loadNumber}`}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{bySource ? record.dest : record.source}</TableCell>
                      <TableCell align="right">{formatTons(record.weight)}</TableCell>
                      {showInvoiceStatus ? <TableCell>{record.invoiced ? 'Yes' : 'No'}</TableCell> : null}
                      {showMark ? (
                        <TableCell>
                          {!record.invoiced && record.id ? (
                            <Button
                              type="button"
                              size="small"
                              variant="outlined"
                              disabled={state.markingId !== ''}
                              onClick={() => actions.markInvoiced(record)}
                            >
                              Mark Invoiced
                            </Button>
                          ) : null}
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </>
  );
});
