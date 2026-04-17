import { Link } from "react-router-dom";
import { BackgroundLayer } from "../components/layout/BackgroundLayer";
import { Button } from "../components/ui";

export const NotFoundPage = () => {
  return (
    <>
      <BackgroundLayer />
      <div className="relative z-10 flex h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-8xl font-bold text-gradient">404</h1>
        <p className="mt-4 text-xl text-foreground-muted">Page not found</p>
        <Button as={Link} to="/" className="mt-8">
          Go Home
        </Button>
      </div>
    </>
  );
};