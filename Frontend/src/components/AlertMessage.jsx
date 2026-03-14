function AlertMessage({ variant = "danger", children }) {
  if (!children) {
    return null;
  }

  return <div className={`alert alert-${variant}`}>{children}</div>;
}

export default AlertMessage;
