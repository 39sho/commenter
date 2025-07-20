import { Logo } from "@/components/logo";
import { Link, Outlet, href } from "react-router";

export default () => {
  return (
    <div className="bg-brand-secondary min-h-lvh">
      <header className="bg-brand-dark text-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={href("/")} className="flex items-center gap-4">
                <Logo className="h-8 text-brand-primary" />
                <span className="text-3xl font-bold">Commenter</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
};
