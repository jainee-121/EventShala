import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Note from "../components/Notes";
import Modal from "../pages/Modal"; // Import Modal component
import '../styles/MyProfile.css';
import { toast } from 'react-toastify';
import '../styles/CustomToastify.css'


function MyProfile() {
    const [notes, setNotes] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // State to manage selected event for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal open/close state

    useEffect(() => {
        getNotes();
        getTickets();
    }, []);

    const getNotes = () => {
        api.get("/api/notes/mine/")
        .then((res) => res.data)
        .then((data) => setNotes(data))
        .catch((err) =>  toast.success("Error fetching notes: ", err));
    };

    const getTickets = () => {
        api.get("/api/notes/tickets/")
        .then((res) => res.data)
        .then((data) => setTickets(data))
        .catch((err) =>  toast.success("Error fetching tickets: ", err));
    };

    const deleteNote = (id, isExpired) => {
        if (isExpired) {
             toast.success("This event has expired. You can't delete it.");
            return;
        }
        api.delete(`/api/notes/delete/${id}/`)
        .then((res) => {
            if (res.status === 204) {
                 toast.success("Note deleted!");
                getNotes();
                getTickets();
            } else {
                 toast.success("Failed to delete note.");
            }
        })
        .catch((err) =>  toast.success("Error deleting note: ", err));
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
        <div className="container">
            <h2 className="name">Welcome to Your Profile.</h2>
            <Link className="detail-link" to="/createnotes">
                <button className="create-note">Create a New Event</button>
            </Link>

            <h3 className="detail-name">Events Organised</h3>
            <div className="notes-list">
                {notes.length > 0 ? (
                    notes.map(note => (
                        <div key={note.id}>
                            <Note note={note} onDelete={(id) => deleteNote(id, note.is_expired)} />
                            <div className="note-button-group">
                                <Link className="link-to-button" to={`/notes/${note.id}/orders/`}>
                                    <button className="view-order">Orders</button>
                                </Link>
                                <button className="detail-button" onClick={() => openModal(note)}>Details</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="No-event">No Events</p>
                )}
            </div>

            <h3 className="detail-name">My Tickets</h3>
            <div className="notes-list">
                {tickets.length > 0 ? (
                    tickets.map(ticket => (
                        <div key={ticket.id}>
                            <Note note={ticket} />
                            <div className="note-button-group">
                            <button className="detail-button-ticket" onClick={() => openModal(ticket)}>Details</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="No-event">No Tickets</p>
                )}
            </div>
            {/* Render Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} event={selectedEvent} />
        </div>
    );
}

export default MyProfile;
