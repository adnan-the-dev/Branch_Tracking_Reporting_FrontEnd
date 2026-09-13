import React from 'react';

const GOOD = ['Ok', 'Working', 'Sent'];
const WARN = ['Issue', 'Duplicate', 'Not Sent'];
const BAD = ['Off', 'Down', 'Missing', 'Failed'];

export default function StatusBadge({ status }) {
  let cls = 'bg-slate-100 text-slate-600';
  if (GOOD.includes(status)) cls = 'status-ok';
  else if (WARN.includes(status)) cls = 'status-issue';
  else if (BAD.includes(status)) cls = 'status-down';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
