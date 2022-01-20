import AuthenticatedApp from "./authenticated-app";
import { useAuth } from "./context/auth-context";
import UnauthenticatedApp from "./unauthenticated-app";

const AuthChecker: React.FC = ({ children }) => {
  const { userData } = useAuth();
  return (
    <>
      {userData?.user ? (
        <AuthenticatedApp>{children}</AuthenticatedApp>
      ) : (
        <UnauthenticatedApp> {children} </UnauthenticatedApp>
      )}
    </>
  );
};

export default AuthChecker;
