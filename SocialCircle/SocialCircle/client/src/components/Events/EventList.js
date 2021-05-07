import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../providers/EventProvider";
import { ActivityContext } from "../../providers/ActivityProvider";
import Event from "./Event";

export const EventList = () => {
    const { events, getAllEvents, getEventsByActivity } = useContext(EventContext);
    const { activities, getAllActivities } = useContext(ActivityContext);

    useEffect(() => {
        getAllEvents()
            .then(getAllActivities())
    }, []);

    const filterEventsByActivity = (event) => {
        const activityId = parseInt(event)
        if (activityId !== 0) {
            getEventsByActivity(activityId);
        } else {
            getAllEvents();
        }

    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <select className="activity-select" id="activityId" onChange={(e) => { filterEventsByActivity(e.target.value) }}>
                    <option value="0">All Activities</option>
                    {activities.map((activity) => {
                        return <option key={activity.id} value={activity.id}>{activity.name}</option>
                    })}
                </select>
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