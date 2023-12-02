import React, { useState } from "react";

import "./Modal.css";

export const Modal = ({ closeModal, onSubmit, defaultValue }) => {
    // console.log(defaultValue);
    const [formState, setFormState] = useState(
        defaultValue
    );
    const [errors, setErrors] = useState("");

    const validateForm = () => {
        if (formState.id && formState.name && formState.email && formState.role) {
            setErrors("");
            return true;
        } else {
            let errorFields = [];
            for (const [key, value] of Object.entries(formState)) {
                if (!value) {
                    errorFields.push(key);
                }
            }
            setErrors(errorFields.join(", "));
            return false;
        }
    };

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        // console.log(formState);

        onSubmit(formState);

        closeModal();
    };

    return (
        <div
            className="modal-container"
            onClick={(e) => {
                if (e.target.className === "modal-container") closeModal();
            }}
        >
            <div className="modal">
                <form>
                    <div className="form-group">
                        <label htmlFor="id">Id</label>
                        <input name="id" onChange={handleChange} value={formState.id} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input name="name" onChange={handleChange} value={formState.name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input name="email" type="email" onChange={handleChange} value={formState.email} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            name="role"
                            onChange={handleChange}
                            value={formState.role}
                        >
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    {errors && <div className="error">{`Please include: ${errors}`}</div>}
                    <button type="submit" className="btn" onClick={handleSubmit}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};