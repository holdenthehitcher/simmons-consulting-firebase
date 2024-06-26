import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase-config";

const Dashboard = ({verifiedUser}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    useEffect(() => {
        console.log(verifiedUser);

        // Fetch user data from Firestore
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            // console.log(currentUser);
            if (currentUser) {
                const collection_ref = collection(firestore, "users");
                const q = query(collection_ref, where("uid", "==", currentUser.uid));
                const doc_refs = await getDocs(q);

                if (doc_refs.size === 1) {
                    let verifiedUser = {};

                    doc_refs.forEach((item) => {
                        setUser({ ...item.data() });
                        verifiedUser = { ...item.data() };
                    });
                    return verifiedUser;
                } else {
                    // add message displaying issue with credentials and to contact admin
                    // uncomment this out later
                    // handleSignOut();
                }
            } else {
                // If user is not logged in, navigate to sign-in page
                navigate("/signin");
            }
        });
        return unsubscribe;
    }, [navigate]);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            // After signing out, redirect user to sign-in page
            navigate("/signin");
        } catch (error) {
            console.error("Error signing out:", error.message);
            // Handle sign-out error
        }
    };

    return (
        <div>
            <h2>Welcome to the Dashboard, {user && user.firstName}!</h2>
            <p>User Info:</p>
            {user && (
                <ul>
                    <li>First Name: {user.firstName}</li>
                    <li>Last Name: {user.lastName}</li>
                    <li>Email: {user.email}</li>
                    <li>Permissions: {user.permissions}</li>
                    <li>Company: {user.company || "N/A"}</li>
                </ul>
            )}
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export default Dashboard;
