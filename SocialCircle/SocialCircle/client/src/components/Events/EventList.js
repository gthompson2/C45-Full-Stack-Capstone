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

    // useEffect(() => {

    // }, [filteredEvents])

    const filterEventsByActivity = (event) => {
        const activityId = parseInt(event)
        if (activityId !== 0) {
            getEventsByActivity(activityId)
        } else {
            getAllEvents()
        }

    }

    /**
     * 
     * TODO: filter events based on if they are set to take place before or after the current date/time
     * 
     * To transfer date from string format to milliseconds, use Date.parse(<dateObj>)
     * To transfer date from milliseconds to string format, use <dateObj>.toLocaleString()
     * 
     * For each event, transfer the date to milliseconds and compare it to Date.now()
     * 
     * 1: When the page loads, dateFilter is assigned a value of 0
     * 2: When the date dropdown is changed, changeDateFilter is triggered, which will 
     * assign dateFilter a value based on the dropdown
     * 3: Once changeDateFilter runs, it calls filterEventsByDate, which fills the filteredEvents
     * array with Events based on the value of dateFilter
     *      1: upcoming events
     *      2: completed events
     *      3: all events
     * 4: filteredEvents is then used to generate event cards
     * 5: Any time filterEventsByActivity is run, filterEventsByDate must also run
     * so that both filters are used each time
     *  
     */


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