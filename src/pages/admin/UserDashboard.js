import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase-config";

const UserDashboard = ({ verifiedUser }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        // Fetch user data from Firestore
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const collection_ref = collection(firestore, "users");
                const q = query(collection_ref, where("uid", "==", currentUser.uid));
                const doc_refs = await getDocs(q);

                if (doc_refs.size === 1) {
                    doc_refs.forEach((item) => {
                        setUser({ ...item.data() });
                    });
                } else {
                    // add message displaying issue with credentials and to contact admin
                    // handleSignOut();
                }
            } else {
                // If user is not logged in, navigate to sign-in page
                navigate("/signin");
            }
        });
        // console.log(user.permissions);
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
            <h2>Welcome to the Admin User Dashboard, {user && user.firstName}!</h2>
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

export default UserDashboard;
