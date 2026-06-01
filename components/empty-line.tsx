export function EmptyLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] italic text-text-faint">
      {children}
    </p>
  );
}
