import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../providers/EventProvider";
import { ActivityContext } from "../../providers/ActivityProvider";
import Event from "./Event";
import { Button } from 'reactstrap';

export const MyEventList = () => {
    // MyEventList displays all the current user's events in the database, and allows them to be filtered
    // activity type
    const { myEvents, getMyEvents, getMyEventsByActivity } = useContext(EventContext);
    const { activities, getAllActivities } = useContext(ActivityContext);

    const userProfile = sessionStorage.getItem('userProfile')
    const userId = (JSON.parse(userProfile)).id

    useEffect(() => {
        getMyEvents(userId)
            .then(getAllActivities())
    }, []);

    /**
     * On initial page load, the activity filter select is set to an option with a value of 0,
     * which bypasses the activity filter entirely. Each time the select is changed, this 
     * method is called. If the id of the option selected corresponds to the id of an Activity,
     * the events are filtered based on that activity and the current user's id. 
     * Otherwise, all the current user's events are returned
     */
    const filterEventsByActivity = (event) => {
        const activityId = parseInt(event)
        if (activityId !== 0) {
            getMyEventsByActivity(userId, activityId)
        } else {
            getMyEvents(userId)
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
                    {myEvents.map((event) => {

                        return <Event key={event.id} event={event} />
                    })}
                </div>
                <div>
                    <Button color="success" href="/events/add">Host Event</Button>
                </div>
            </div>
        </div>
    );

}
export default MyEventList;