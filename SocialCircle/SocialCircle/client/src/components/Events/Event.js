import React, { useContext } from "react";
import { Card, CardBody, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { EventContext } from "../../providers/EventProvider";
import "./Event.css";

export const Event = ({ event }) => {

    const { deleteEvent } = useContext(EventContext);

    // need the user data to determine whether or not the current user created the
    // event; if so, edit and delete buttons are enabled
    const user = JSON.parse(sessionStorage.getItem("userProfile"));
    const enableButton = user !== null && user.id === event.userId;

    const isCompleted = Date.parse(event.date) < (Date.now())

    // edit button is provided here; delete button is located in the JSX 
    // in a ternary, and routes to a confirmation page
    const buttonForUser = () => {
        return (
            <Button className="b">
                <Link className="a" to={`/events/edit/${event.id}`}>
                    Edit
            </Link>
            </Button>
        );
    };

    return (
        <Card className="m-4">
            <p className="text-left px-2">
            </p>
            <CardBody>
                <p>
                    <Link to={`/events/${event.id}`}>
                        <strong>{event.name}</strong>
                    </Link>
                </p>
                <p>Host: {event.userProfile.displayName}</p>
                <p>Activity: {event.activity.name}</p>
                <p>Date: {new Date(event.date).toLocaleDateString('en-US')}</p>
                <p>Time: {new Date(event.date).toLocaleTimeString('en-US')}</p>
                <p>Address: {event.address}</p>
                <section className="d">
                    <strong>{isCompleted ? `Completed` : ``}</strong>
                </section>
                <section className="c">
                    <div>{enableButton ? buttonForUser() : null}</div>
                    <div>{enableButton ? <Button className="b">
                        <Link className="a" to={`/events/delete/${event.id}`}>
                            Delete
                                            </Link>
                    </Button> : null}</div>
                </section>
            </CardBody>
        </Card>
    );
}

export default Event;