import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // Check if user is already signed in
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Redirect user to dashboard if already signed in
                navigate("/dashboard");
            }
        });
        return unsubscribe;
    }, [navigate]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            // Sign in user with email and password
            await signInWithEmailAndPassword(auth, email, password);
            // User signed in, navigate to dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error("Error signing in:", error.message);
            // Handle sign-in error
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn}>
                <label>
                    Email:
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type='submit'>Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
