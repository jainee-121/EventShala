// Modal.js
import React from 'react';
import '../styles/modal.css'; // Add your own styles
import { toast } from 'react-toastify';

function Modal({ isOpen, onClose, event }) {

    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Close</button>
                {event && (
                    <div>
                        {event.photo && <img src={event.photo} alt={`Photo for ${event.title}`} className="modal-photo" />}
                        <h2 className="note-title">{event.title}</h2>
                        <p className="note-excerpt"> {event.content}</p>
                        <p ><strong className="note-price">${Number(event.price).toFixed(2)}</strong><strong className="note-category">{event.category}</strong>
                              {event.is_expired && (  <strong className="note-expired">Expired</strong>)}</p>
                        <p className="note-location"><strong>Location:</strong> {event.location}</p>
                        <p className="note-dates"><strong>Starts At:</strong> {new Date(event.start_date).toLocaleString()}</p>
                        <p className="note-dates"><strong>Ends At:</strong> {new Date(event.end_date).toLocaleString()}</p>
                        <p className="note-date"><strong>Created On:</strong> {new Date(event.created_at).toLocaleString()}</p> {/* Added Created On */}
                        <p className="note-date" ><strong>Created By:</strong> {event.author?.username}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;
