import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <span className="eyebrow">404</span>
      <h1 className="display-title mb-3">Page not found</h1>
      <p className="lead-copy mb-4">The requested page does not exist in this workspace.</p>
      <Link to="/catalog" className="btn btn-warning">
        Go to catalog
      </Link>
    </div>
  );
}

export default NotFoundPage;
