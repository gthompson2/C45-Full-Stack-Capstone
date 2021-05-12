import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../providers/EventProvider";
import { ActivityContext } from "../../providers/ActivityProvider";
import Event from "./Event";
import { Button } from 'reactstrap';

export const MyEventList = () => {
    const { myEvents, getMyEvents, getMyEventsByActivity } = useContext(EventContext);
    const { activities, getAllActivities } = useContext(ActivityContext);

    const userProfile = sessionStorage.getItem('userProfile')
    const userId = (JSON.parse(userProfile)).id
    //const userId = currentUser.id

    useEffect(() => {
        getMyEvents(userId)
            .then(getAllActivities())
    }, []);


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