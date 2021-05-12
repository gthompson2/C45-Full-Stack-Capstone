import React, { useEffect, useContext, useState } from "react";
import { Card, CardImg, CardBody, Button } from "reactstrap";
import { EventContext } from "../../providers/EventProvider";
import { useParams, Link, useHistory } from "react-router-dom";

export const EventDelete = () => {
    const { eventObj, getEventById, deleteEvent } = useContext(EventContext);

    const history = useHistory();

    const eventId = parseInt(useParams().id);

    useEffect(() => {
        getEventById(eventId);
    }, [])

    const deletion = () => {
        deleteEvent(eventObj.id)
            .then(() => {
                history.push("/myEvents")
            })
    }

    return (
        <div className="container pt-4">
            <div className="row justify-content-center">
                <Card className="col-sm-12 col-lg-6">
                    <CardBody>
                        <h3>Are you sure you want to delete the event {eventObj.name} along with all RSVPs?</h3>
                        <Button className="a" onClick={() => { deletion() }}>Yes</Button>
                        <Button>
                            <Link className="a" to={`/myEvents/`}>
                                No
                            </Link>
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default EventDelete;