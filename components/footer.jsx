export default function Footer() {
  return (
    <footer>
      <div className="flex justify-center pt-6 pb-2">
        <p className="text-sm text-muted-foreground">
          Built by{" "}
          <a
            className="underline text-foreground hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/karl-alexander-meier-mattern-16a3b919a/"
            aria-label="Karl-Alexander on LinkedIn (opens in new tab)"
          >
            Karl-Alexander
          </a>
        </p>
      </div>
    </footer>
  );
}
