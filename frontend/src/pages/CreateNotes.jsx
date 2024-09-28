import React, { useState,useRef} from "react";
import api from "../api";
import "../styles/CreateNotes.css"; // Import the new CSS file
import { toast } from 'react-toastify';
import '../styles/CustomToastify.css'

function CreateNotes() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("technology");
    const [excerpt, setExcerpt] = useState("");
    const [photo, setPhoto] = useState(null);
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [duration, setDuration] = useState("00:00");  // Duration as HH:MM
    const [price, setPrice] = useState(0);


    const createNote = (e) => {
        e.preventDefault();
        const now = new Date();
        const selectedStartDate = new Date(startDate);
        
        if (selectedStartDate < now) {
             toast.success("Start date and time cannot be in the past.");
            return;
        }
    
        const [hours, minutes] = duration.split(":").map(Number);
        if (hours === 0 && minutes === 0) {
             toast.success("Duration cannot be 00:00. Please set a valid duration.");
            return;
        }
        const endDate = new Date(selectedStartDate);
        endDate.setHours(endDate.getHours() + hours);
        endDate.setMinutes(endDate.getMinutes() + minutes);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("excerpt", excerpt);
        formData.append("content", content);
        formData.append("photo", photo);
        formData.append("location", location);
        formData.append("start_date", startDate);
        formData.append("end_date", endDate.toISOString()); // Send end date as ISO string
        formData.append("price", price);

        api
            .post("/api/notes/", formData)
            .then((res) => {
                if (res.status === 201) {
                     toast.success("Event created!");
                    setTitle(""); 
                    setContent("");
                    setCategory("technology");
                    setExcerpt("");
                    setPhoto(null);
                    setLocation("");
                    setStartDate("");
                    setDuration("00:00");  // Reset duration
                    setPrice(0);

                } else {
                     toast.success("Failed to create note.");
                }
            })
            .catch(err => {
                // Default error message
                let errorMessage = `Error creating note: ${err.response?.data || err.message}`;
                
                // Check for specific errors in response data for each field
                if (err.response?.data) {
                    const errors = err.response.data;
                    if (errors.title) {
                        errorMessage = `Title error: ${errors.title[0]}`;
                    } else if (errors.category) {
                        errorMessage = `Category error: ${errors.category[0]}`;
                    } else if (errors.excerpt) {
                        errorMessage = `Excerpt error: ${errors.excerpt[0]}`;
                    } else if (errors.content) {
                        errorMessage = `Content error: ${errors.content[0]}`;
                    } else if (errors.photo) {
                        errorMessage = `Photo error: Upload a Photo`;
                    } else if (errors.location) {
                        errorMessage = `Location error: ${errors.location[0]}`;
                    } else if (errors.start_date) {
                        errorMessage = `Start Date error: ${errors.start_date[0]}`;
                    } else if (errors.end_date) {
                        errorMessage = `End Date error: ${errors.end_date[0]}`;
                    } else if (errors.price) {
                        errorMessage = `Price error: ${errors.price[0]}`;
                    }
                }

                 toast.success(errorMessage);
            });
    };

    return (
        <div className="container">
            <div className="notes-form-container">
                <h2 className="notes-form-header">Create a New Event</h2>
                <form onSubmit={createNote}>
                    <label>Title:</label>
                    <input
                        className="notes-form-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <br />
                    <label>Category:</label>
                    <select className="notes-form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="world">World</option>
                        <option value="environment">Environment</option>
                        <option value="technology">Technology</option>
                        <option value="design">Design</option>
                        <option value="culture">Culture</option>
                        <option value="business">Business</option>
                        <option value="politics">Politics</option>
                        <option value="travel">Travel</option>
                    </select>
                    <br />
                    <label>Excerpt:</label>
                    <input
                        className="notes-form-input"
                        type="text"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        required
                    />
                    <br />
                    <label>Content:</label>
                    <textarea
                        className="notes-form-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                    <br />
                    <label>Photo:</label>
                    <input
                        className="notes-form-file-input"
                        type="file"
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                    <br />
                    <label>Location:</label>
                    <input
                        className="notes-form-input"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <br />
                    <label>Start Date:</label>
                    <input
                        className="notes-form-date"
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    <br />
                    <label>Duration (HH:MM):</label>
                    <input
                        className="notes-form-duration"
                        type="time"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                    <br />
                    <label>Price:</label>
                    <input
                        className="notes-form-price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                    />
                    <br />
                    <button className="notes-form-button" type="submit">
                        Create Note
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateNotes;