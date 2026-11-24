import { LinkRow } from './LinkRow.jsx';

export function LinkList({ links, className = '' }) {
  if (!links?.length) return null;

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {links.map((link) => (
        <LinkRow key={link.id} link={link} />
      ))}
    </div>
  );
}
