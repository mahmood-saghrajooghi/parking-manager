import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthenticatedApp: React.FC = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    if (
      ["/", "/login", "/register", "/forgot-password"].includes(
        router.pathname
      )
    ) {
      router.push("/dashboard");
    }
  }, []);
  return <>{children}</>;
};

export default AuthenticatedApp;
