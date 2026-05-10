import styles from "./TenantNotFoundPage.module.css";

export const TenantNotFoundPage = ({ slug }) => (
  <div className={styles.page}>
    <div className={styles.brand}>Verbilo</div>
    <h1 className={styles.title}>This tenant doesn't exist.</h1>
    <p className={styles.body}>
      {slug ? (
        <>
          <span className={styles.code}>{slug}.verbilo.co.uk</span> isn't a
          configured Verbilo tenant.
        </>
      ) : (
        <>That subdomain isn't a configured Verbilo tenant.</>
      )}{" "}
      If you think this is a mistake, contact your company administrator or{" "}
      <a className={styles.inline} href="mailto:hello@verbilo.co.uk">
        hello@verbilo.co.uk
      </a>
      .
    </p>
    <a className={styles.cta} href="https://verbilo.co.uk">
      Go to verbilo.co.uk
    </a>
  </div>
);
