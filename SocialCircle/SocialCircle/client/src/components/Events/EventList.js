import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../providers/EventProvider";
import { ActivityContext } from "../../providers/ActivityProvider";
import Event from "./Event";

export const EventList = () => {
    // EventList displays all events in the database, and allows them to be filtered
    // activity type
    const { events, getAllEvents, getEventsByActivity } = useContext(EventContext);
    const { activities, getAllActivities } = useContext(ActivityContext);

    useEffect(() => {
        getAllEvents()
            .then(getAllActivities())
    }, []);

    /**
     * On initial page load, the activity filter select is set to an option with a value of 0,
     * which bypasses the activity filter entirely. Each time the select is changed, this 
     * method is called. If the id of the option selected corresponds to the id of an Activity,
     * the events are filtered based on that activity. Otherwise, all events are returned
     */
    const filterEventsByActivity = (event) => {
        const activityId = parseInt(event)
        if (activityId !== 0) {
            getEventsByActivity(activityId)
        } else {
            getAllEvents()
        }

    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div>
                    <select className="activity-select" id="activityId" onChange={(e) => { filterEventsByActivity(e.target.value) }}>
                        <option value="0">All Activities</option>
                        {activities.map((activity) => {
                            return <option key={activity.id} value={activity.id}>{activity.name}</option>
                        })}
                    </select>
                </div>
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