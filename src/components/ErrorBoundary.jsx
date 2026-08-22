import React from "react";

/**
 * App-level error boundary.
 *
 * A single render error must never white-screen the whole application —
 * especially not on a clinical/compliance tool used at the chairside. This
 * catches render/lifecycle errors below it, shows a recoverable fallback, and
 * logs the error. Wire `componentDidCatch` to Sentry (or your monitor) in prod.
 *
 * Use one at the app root (catch-all) and one around the routed page (so the
 * shell/navigation survives a single page's crash).
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info?.componentStack);
    // TODO(prod): report(error, info) to Sentry / monitoring here.
  }

  handleReset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div role="alert" style={wrap}>
        <div style={{ fontSize: "2.4rem", lineHeight: 1 }} aria-hidden="true">⚠️</div>
        <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 650 }}>
          {this.props.label ? `Something went wrong in ${this.props.label}` : "Something went wrong on this screen"}
        </h1>
        <p style={msg}>
          The rest of Verbilo is unaffected. You can retry this view, or reload the app if the problem persists.
        </p>
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button type="button" onClick={this.handleReset} style={btn(true)}>Try again</button>
          <button type="button" onClick={() => window.location.reload()} style={btn(false)}>Reload app</button>
        </div>
      </div>
    );
  }
}

const wrap = {
  minHeight: "50vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  padding: "2.5rem 1.5rem",
  textAlign: "center",
  fontFamily: "system-ui, -apple-system, sans-serif",
  color: "var(--on-surface, #1a2b2b)",
};

const msg = { margin: 0, maxWidth: "46ch", color: "var(--on-surface-variant, #46595a)", lineHeight: 1.5 };

const btn = (primary) => ({
  padding: "10px 18px",
  borderRadius: "8px",
  fontSize: ".9rem",
  fontWeight: 600,
  cursor: "pointer",
  border: primary ? "none" : "1px solid var(--outline, #cdd9d9)",
  background: primary ? "var(--primary, #006974)" : "transparent",
  color: primary ? "var(--on-primary, #ffffff)" : "var(--on-surface, #1a2b2b)",
});
