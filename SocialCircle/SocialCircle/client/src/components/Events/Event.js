import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "./Event.css";

export const Event = ({ event }) => {

    const user = JSON.parse(sessionStorage.getItem("userProfile"));

    const enableButton = user !== null && user.id === event.userId;

    const isCompleted = Date.parse(event.date < Date.now())

    const buttonForUser = () => {
        return (
            <Button className="b">
                <Link className="a" to={`/event/edit/${event.id}`}>
                    Edit
            </Link>
            </Button>
        );
    };

    const deleteForUser = () => {
        return (
            <Button className="b">
                <Link className="a" to={`/event/delete/${event.id}`}>
                    Delete
            </Link>
            </Button>
        );
    };

    return (
        <Card className="m-4">
            <p className="text-left px-2">
                {/* Posted by: {event.userProfile.displayName}  */}
                {/* This won't work unless we modify the API to include userProfile with Events */}
            </p>
            <CardBody>
                <p>
                    <Link to={`/event/${event.id}`}>
                        <strong>{event.name}</strong>
                    </Link>
                </p>
                <p>Host: {event.userProfile.displayName}</p>
                <p>Activity: {event.activity.name}</p>
                <p>Date: {event.date}</p>
                <p>Address: {event.address}</p>
                <section className="c">
                    <div>{enableButton ? buttonForUser() : null}</div>
                    <div>{enableButton ? deleteForUser() : null}</div>
                </section>
                <section className="d">
                    <h4>{isCompleted ? `Completed` : ``}</h4>
                </section>
            </CardBody>
        </Card>
    );
}

export default Event;