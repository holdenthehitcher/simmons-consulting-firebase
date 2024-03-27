import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard"; // Your main application content
import { auth } from "./firebase/firebase-config";
import Register from "./pages/Register";

const App = () => {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    return (
        <Router>
            <Routes>
                <Route path='/signin' element={<SignIn />} />
                <Route element={<PrivateRoute user={user} />}>
                    <Route element={<Dashboard />} path='/dashboard' />
                </Route>
                <Route path='/register' element={<Register />} />
            </Routes>
        </Router>
    );
};

const PrivateRoute = ({ user, children }) => {
    return user ? <Outlet /> : <Navigate to='/signin' replace />;
};

export default App;
