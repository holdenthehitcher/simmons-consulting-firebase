import React, { useState } from "react";
import { auth, firestore } from "../firebase/firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        permissions: "user",
        company: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            console.log(userCredential);
            const user = userCredential.user;
            // Store additional user data in Firestore
            await addDoc(collection(firestore, "users"), {
                uid: user.uid,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                emailValidated: false,
                permissions: formData.permissions,
                company: formData.company,
                active: true, 
                
                quizAssignments: [],
            });
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                permissions: "user",
                company: "",
            });
            alert("User registered successfully!");
        } catch (error) {
            console.error("Error registering user:", error.message);
            alert("Error registering user: " + error.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type='text' name='firstName' value={formData.firstName} onChange={handleChange} required />
                </label>
                <label>
                    Last Name:
                    <input type='text' name='lastName' value={formData.lastName} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type='email' name='email' value={formData.email} onChange={handleChange} required />
                </label>
                <label>
                    Password:
                    <input type='password' name='password' value={formData.password} onChange={handleChange} required />
                </label>
                <label>
                    Permissions:
                    <select name='permissions' value={formData.permissions} onChange={handleChange}>
                        <option value='admin'>Admin</option>
                        <option value='superadmin'>Super Admin</option>
                        <option value='user'>User</option>
                    </select>
                </label>
                <label>
                    Company:
                    <input type='text' name='company' value={formData.company} onChange={handleChange} />
                </label>
                <button type='submit'>Register</button>
            </form>
        </div>
    );
};

export default Register;
