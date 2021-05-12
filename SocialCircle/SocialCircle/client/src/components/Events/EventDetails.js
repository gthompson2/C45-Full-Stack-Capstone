import React, { useEffect, useContext, useState } from "react";
import { Card, CardImg, CardBody, Button } from "reactstrap";
import { EventContext } from "../../providers/EventProvider";
import { EventGroupContext } from "../../providers/EventGroupProvider";
import { useParams, Link, useHistory } from "react-router-dom";

export const EventDetails = () => {
    const { eventObj, getEventById } = useContext(EventContext);
    const { eventGroups, getEventGroupsByEvent, addEventGroup, deleteEventGroup } = useContext(EventGroupContext);

    const history = useHistory();

    const { id } = useParams();

    const user = JSON.parse(sessionStorage.getItem("userProfile"));

    const enableButton = user !== null && user.id === eventObj.userId;

    let isRSVPd = null


    eventGroups.filter((eventGroup) => {
        if (eventGroup.userId === user.id) {
            isRSVPd = eventGroup.id
        }
    })

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


    const addAnEventGroup = (eventGroupObj) => {
        addEventGroup(eventGroupObj)
            .then(history.go())
    }

    const deleteAnEventGroup = (groupId) => {
        deleteEventGroup(groupId)
            .then(history.go())


    }

    useEffect(() => {
        getEventById(parseInt(id))
        getEventGroupsByEvent(parseInt(id))
    }, []);

    useEffect(() => {
        getEventGroupsByEvent(parseInt(id))
    }, []);

    return (
        <Card className="m-4">
            <p className="text-left px-2">
            </p>
            <CardBody>
                <p>
                    <strong>{eventObj.name}</strong>
                </p>
                <p>Date: {new Date(eventObj.date).toLocaleDateString('en-US')}</p>
                <p>Time: {new Date(eventObj.date).toLocaleTimeString('en-US')}</p>
                <p>Address: {eventObj.address}</p>
                <p>Description: {eventObj.description}</p>
                <section>
                    <p>RSVPs: {eventGroups.length}</p>
                    <div>{isRSVPd ? <Button className="b" color="danger" onClick={() => { deleteAnEventGroup(isRSVPd) }}>Cancel RSVP</Button>
                        : <Button className="b" onClick={() => { addAnEventGroup({ userId: user.id, eventId: parseInt(id) }) }}>RSVP</Button>}
                    </div>
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