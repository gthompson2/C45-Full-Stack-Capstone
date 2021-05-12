import React, { useEffect, useContext, useState } from "react";
import { Card, CardImg, CardBody, Button } from "reactstrap";
import { EventContext } from "../../providers/EventProvider";
import { useParams, Link } from "react-router-dom";

export const EventDetails = () => {
    const { eventObj, getEventById } = useContext(EventContext);

    const { id } = useParams();

    const user = JSON.parse(sessionStorage.getItem("userProfile"));

    const enableButton = user !== null && user.id === eventObj.userId;

    const isCompleted = Date.parse(eventObj.date < Date.now())

    const buttonForUser = () => {
        return (
            <Button className="b">
                <Link className="a" to={`/events/edit/${eventObj.id}`}>
                    Edit
            </Link>
            </Button>
        );
    };

    const deleteForUser = () => {
        return (
            <Button className="b">
                <Link className="a" to={`/events/delete/${eventObj.id}`}>
                    Delete
            </Link>
            </Button>
        );
    };

    useEffect(() => {
        console.log(id)
        getEventById(parseInt(id))
            .then(console.log("Event Object: ", eventObj))
    }, []);

    return (
        <Card className="m-4">
            <p className="text-left px-2">
                {/* Hosted by: {eventObj.userProfile.displayName} */}
                {/* This won't work unless we modify the API to include userProfile with Events */}
            </p>
            <CardBody>
                <p>
                    <strong>{eventObj.name}</strong>
                </p>
                {/* <p>Activity: {eventObj.activity.name}</p> */}
                <p>Date: {new Date(eventObj.date).toLocaleDateString('en-US')}</p>
                <p>Time: {new Date(eventObj.date).toLocaleTimeString('en-US')}</p>
                <p>Address: {eventObj.address}</p>
                <p>Description: {eventObj.description}</p>
                <section>
                    {/* RSVPs go here */}
                </section>
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

export default EventDetails;