export default function SortableTh({ label, field, sortBy, order, onSort }) {
  const active = sortBy === field;
  const icon = active ? (order === 'ASC' ? ' ↑' : ' ↓') : ' ↕';
  return (
    <th className="table-th" onClick={() => onSort(field)}>
      {label}
      <span className={active ? 'text-blue-500' : 'text-gray-300'}>{icon}</span>
    </th>
  );
}
