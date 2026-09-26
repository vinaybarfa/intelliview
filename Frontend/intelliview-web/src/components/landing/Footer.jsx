function Footer() {
  return (
    <footer className="footer">
      <div className="page-width footer__top">
        <div>
          <a
            className="wordmark"
            href="#top"
          >
            <span
              className="wordmark__mark"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
            </span>
            IntelliView<span>AI</span>
          </a>

          <p>Career intelligence for what comes next.</p>
        </div>

        <div className="footer__links">
          <a href="#product">Product</a>
          <a href="#features">Features</a>
          <a href="#resources">Resources</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>

      <div className="page-width footer__bottom">
        <span>© {new Date().getFullYear()} IntelliView AI</span>
        <span>Built for ambitious careers.</span>
      </div>
    </footer>
  )
}

export default Footer