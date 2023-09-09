import UnauthenticatedApp from "./UnauthenticatedApp"

const AppRouter: React.FC = () => {
    // always return unauthenticated app as there is no authentication set up yet
    // to change this (and handle logic between rendering authenticated
    // and unauthenticated routes once user authentication has been set up)
    return <UnauthenticatedApp />;
};

export default AppRouter;
