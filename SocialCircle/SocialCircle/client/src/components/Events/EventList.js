import React, { useContext, useEffect } from "react";
import { EventContext } from "../../providers/EventProvider";
import Event from "./Event";

export const EventList = () => {
    const { events, getAllEvents } = useContext(EventContext);

    useEffect(() => {
        getAllEvents();
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="cards-column">
                    {events.map((event) => {

                        return <Event key={event.id} event={event} />
                    })}
                </div>
            </div>
        </div>
    );

}
export default EventList;