import { useRouter } from "next/router";
import { useEffect } from "react";
import { Spiral } from "./components/Spiral";
import { useAuth } from "./context/auth-context";

const UnauthenticatedApp: React.FC = ({ children }) => {
  const router = useRouter();
  const { userData } = useAuth();
  useEffect(() => {
    if (
      !["/", "/login", "/register", "/forgot-password"].includes(
        router.pathname
      )
    ) {
      router.push("/");
    }
  }, [userData]);
  return ["/", "/login", "/register", "/forgot-password"].includes(
    router.pathname
  ) ? (
    <>{children}</>
  ) : (
    <div className="dark:bg-gray-900 h-screen w-screen flex items-center justify-center">
      <Spiral />
    </div>
  );
};

export default UnauthenticatedApp;
