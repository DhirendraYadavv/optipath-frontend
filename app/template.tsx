// A template re-mounts on every navigation, so each page change plays the fade-and-rise in effects.css.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
