import { useAuth } from "../../auth/AuthContext";
import { useTenant } from "../../auth/TenantContext";
import styles from "./CrossTenantBanner.module.css";

// VER-62: when a Verbilo Admin is operating inside a customer tenant
// (i.e. they navigated to {slug}.verbilo.co.uk via "Open as admin"),
// show a persistent banner so they can never forget they're acting in
// someone else's data. Backend audits every mutation.
//
// Hidden for normal customer users — they only see their own tenant.
export const CrossTenantBanner = () => {
  const { permissions } = useAuth();
  const { tenant } = useTenant();

  if (!permissions?.isPlatformAdmin || !tenant) return null;

  return (
    <div className={styles.banner} role="status">
      <strong>Verbilo Admin mode.</strong>
      <span>
        You're operating inside <strong>{tenant.name}</strong>. All actions are
        audited.
      </span>
    </div>
  );
};
