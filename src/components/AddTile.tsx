import { Link } from 'react-router-dom';

interface Props {
  to: string;
  label: string;
}

export default function AddTile({ to, label }: Props) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center aspect-square bg-white border-2 border-dashed border-delizio-red/40 rounded-2xl text-delizio-red font-semibold active:scale-[0.97] transition hover:bg-delizio-red/5"
    >
      <span className="text-5xl mb-2">＋</span>
      <span className="text-center text-sm px-2 leading-tight">{label}</span>
    </Link>
  );
}
