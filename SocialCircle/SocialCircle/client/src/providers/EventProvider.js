import React, { useState, useContext } from "react";
import { UserProfileContext } from "./UserProfileProvider";

export const EventContext = React.createContext();

export const PostProvider = (props) => {
    const { getToken } = useContext(UserProfileContext);
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [eventObj, setEvent] = useState({});

    const getAllEvents = () => {
        //the proxy that was set up in package.json will be handling the first part of the URL
        return getToken()
            .then((token) =>
                fetch("/api/event", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((res) => res.json())
            )
            .then(setEvents);
    }

    const getEventById = (id) => {
        return getToken().then((token) =>
            fetch(`/api/event/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json())
        )
            .then(setEvent)
    }

    const getEventToEdit = (id) => {
        return getToken().then((token) =>
            fetch(`/api/event/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json())
        )
    }

    // fetching filtered posts belonging to the current user
    // using the user's Id
    const getMyEvents = (userId) => {
        return getToken()
            .then((token) =>
                fetch(`/api/event/MyEvents/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((resp) => resp.json())
            )
            .then(setMyEvents);
    }

    const getEventsByActivity = (activityId) => {
        return getToken()
            .then((token) =>
                fetch(`/api/event/EventsByActivity/${activityId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((resp) => resp.json())
            )
            .then(setEvents);
    }
    const getMyEventsByActivity = (userId, activityId) => {
        return getToken()
            .then((token) =>
                fetch(`/api/event/MyEventsByActivity/${userId}/${activityId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((resp) => resp.json())
            )
            .then(setMyEvents)
    }

    const addEvent = (eventObj) => {
        return getToken().then((token) =>
            fetch("/api/event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(eventObj),
            })
        );
    }

    const editEvent = (eventObj) => {
        return getToken()
            .then((token) =>
                fetch(`/api/event/${eventObj.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(eventObj),
                })
            )
    }

    const deleteEvent = (id) => {
        return getToken()
            .then((token) =>
                fetch(`/api/event/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then(getAllEvents)
            )
    }

    return (
        <EventContext.Provider
            value={{
                events,
                getAllEvents,
                eventObj,
                getEventById,
                getEventToEdit,
                myEvents,
                getMyEvents,
                setEvent,
                getEventsByActivity,
                getMyEventsByActivity,
                addEvent,
                editEvent,
                deleteEvent
            }}
        >
            {props.children}
        </EventContext.Provider>
    )
}
export default PostProvider;