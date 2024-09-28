import React, { useEffect, useState } from "react";
import api from "../api"; // Adjust the path as necessary
import { useParams } from "react-router-dom";
import "../styles/Order.css"; // Import the CSS file

function Order() {
    const { noteId } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get(`/api/notes/${noteId}/orders/`);
                setOrders(response.data);
            } catch (err) {
                setError("Error fetching orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [noteId]);

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="order-container">

            {/* Static Header Row */}
            <div className="order-header">
                <p>Order ID</p>
                <p className="header-title">Event Title</p>
                <p>Buyer</p>
                <p>Date</p>
            </div>

            {/* Order details */}
            {orders.length > 0 ? (
                orders.map(order => (
                    <div className="order-item" key={order.id}>
                        <p>{order.id}</p>
                        <p className="note-title">{order.note.title}</p>
                        <p>{order.author.username}</p>
                        <p>{new Date(order.date_created).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p className="No-event">No orders found for this Event.</p>
            )}
        </div>
    );
}

export default Order;
