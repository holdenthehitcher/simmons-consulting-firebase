import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { auth, firestore } from "./firebase/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";

// external pages
import SignIn from "./pages/SignIn";
// user pages
import Dashboard from "./pages/Dashboard";
// admin pages
import Register from "./pages/Register";
import UserDashboard from "./pages/admin/UserDashboard";

const App = () => {
    const [user, setUser] = useState(null);
    async function userVerify() {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const collection_ref = collection(firestore, "users");
                const q = query(collection_ref, where("uid", "==", user.uid));
                const doc_refs = await getDocs(q);

                if (doc_refs.size === 1) {
                    doc_refs.forEach((item) => {
                        setUser({ ...item.data() });
                    });
                }
            }
        });
        return unsubscribe;
    }

    useEffect(() => {
        userVerify();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path='/signin' element={<SignIn />} />
                <Route
                    element={<Dashboard />}
                    path='/dashboard'
                    action={async () => {
                        await userVerify();
                        if (user) {
                            return <Outlet />;
                        } else {
                            return <Navigate to='/signin' replace />;
                        }
                    }}
                />
                <Route
                    element={<UserDashboard />}
                    path='/admin/user-dashboard'
                    action={async () => {
                        await userVerify();
                        if (user) {
                            if (user.permissions === "superadmin") {
                                return <Outlet />;
                            }
                        } else {
                            return <Navigate to='/dashboard' replace />;
                        }
                    }}
                />
                <Route path='/register' element={<Register />} />
            </Routes>
        </Router>
    );
};

const UserRoute = ({ user }) => {
    const verifiedUser = async () => await userVerify(user);
    return verifiedUser ? <Outlet /> : <Navigate to='/signin' replace />;
};

const AdminRoute = ({ user }) => {
    const verifiedUser = async () => await userVerify(user);
    return verifiedUser ? <Outlet /> : <Navigate to='/dashboard' replace verifiedUser={verifiedUser} />;
};

async function userVerify(currentUser) {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            const collection_ref = collection(firestore, "users");
            const q = query(collection_ref, where("uid", "==", user.uid));
            const doc_refs = await getDocs(q);

            if (doc_refs.size === 1) {
                let verifiedUser = {};
                doc_refs.forEach((item) => {
                    verifiedUser = { ...item.data() };
                });
                return verifiedUser;
            } else return null;
        } else return null;
    });
    return unsubscribe(currentUser);
}

export default App;
