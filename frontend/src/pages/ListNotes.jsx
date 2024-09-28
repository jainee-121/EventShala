import React, { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Notes";
import Modal from "../pages/Modal"; // Import Modal component
import { useNavigate } from "react-router-dom";
import '../styles/ListNotes.css'
import { toast } from 'react-toastify';
import '../styles/CustomToastify.css'

function ListNotes() {
    const [notes, setNotes] = useState([]);
    const [searchSlug, setSearchSlug] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchSlug);
    const [selectedEvent, setSelectedEvent] = useState(null); // State to manage the selected event for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal open/close state
    const navigate = useNavigate();

    useEffect(() => {
        getCategories();
        getAllNotes();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchSlug);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchSlug]);

    useEffect(() => {
        getAllNotes();
    }, [debouncedSearchTerm, category]);

    const getAllNotes = () => {
        api.get("/api/notes/", {
            params: { slug: debouncedSearchTerm, category: category }
        })
        .then((res) => setNotes(res.data))
        .catch((err) => {
            if (err.response && err.response.status === 401) {
                 toast.success("You are not authorized. Please log in.");
            } else {
                 toast.success("Error fetching notes: ", err);
            }
        });
    };

    const getCategories = () => {
        setCategories([
            { value: '', label: 'All Categories' },
            { value: 'world', label: 'World' },
            { value: 'environment', label: 'Environment' },
            { value: 'technology', label: 'Technology' },
            { value: 'design', label: 'Design' },
            { value: 'culture', label: 'Culture' },
            { value: 'business', label: 'Business' },
            { value: 'politics', label: 'Politics' },
            { value: 'travel', label: 'Travel' },
        ]);
    };

    const handleSearchChange = (e) => {
        setSearchSlug(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const bookNote = (id) => {
        api.post(`/api/notes/book/${id}/`)
        .then(() => {
             toast.success("Note booked successfully!");
            setSearchSlug('');
            setCategory('');
            getAllNotes();
        })
        .catch((err) =>  toast.success("Error booking note: ", err));
    };

    const openModal = (note) => {
        setSelectedEvent(note);
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null); // Close the modal and reset selected event
    };

    return (
        <div className="ListNotes-container">
            <h2 className="ListNotes-name">All Events</h2>
            <input className="ListNotes-slug"
                type="text"
                placeholder="Search by slug"
                value={searchSlug}
                onChange={handleSearchChange}
            />
            <select className="ListNotes-cat" value={category} onChange={handleCategoryChange}>
                {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
            <div className="notes-list">
                {notes.length > 0 ? (
                    notes.map(note => (
                        <div className="note-page" key={note.id}>
                            <Note note={note} />
                            <div className="note-button-group">
                                <button className="book-button" onClick={() => bookNote(note.id)}>Book</button>
                                <button className="detail-button" onClick={() => openModal(note)}>Details</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="No-event">No Events</p>
                )}
            </div>
            {/* Render Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} event={selectedEvent} />
        </div>
    );
}

export default ListNotes;
