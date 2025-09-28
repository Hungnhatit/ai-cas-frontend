export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container px-4 md:py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">E</span>
            </div>
            <span className="font-semibold">AI-CAS</span>
            <span className="text-muted-foreground text-sm">© 2024</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
              Support
            </a>
            <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
