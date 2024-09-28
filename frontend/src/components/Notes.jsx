import React from "react";
import "../styles/Notes.css";
import { toast } from 'react-toastify';

function Note({ note, onDelete }) {
    const formattedDate = new Date(note.created_at).toLocaleString("en-US");
    const startDate = new Date(note.start_date).toLocaleString("en-US");

    return (
        <div className="note-container">
            {note.photo && (
                <img 
                    src={note.photo} 
                    alt={`Photo for ${note.title}`} 
                    className="note-photo"
                />
            )}
            <div className="note-detail">
                <p className="note-detail-icon"><strong className="note-price">${Number(note.price).toFixed(2)}</strong><strong className="note-category">{note.category}</strong>
                              {note.is_expired && (  <strong className="note-expired">Expired</strong>
                )}</p>
                <p className="note-title">{note.title}</p>
                <p className="note-excerpt">{note.excerpt}</p>
                <p className="note-location"><strong>Location:</strong> {note.location}</p>
                <p className="note-dates"><strong>Starts At:</strong> {startDate}</p>



                {onDelete && (
                    <button className="delete-button" onClick={() => onDelete(note.id)}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default Note;


