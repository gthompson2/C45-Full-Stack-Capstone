import React, { useState, useContext } from "react";
import { UserProfileContext } from "./UserProfileProvider";

export const EventGroupContext = React.createContext();

export const EventGroupProvider = (props) => {
    const { getToken } = useContext(UserProfileContext);
    const [eventGroups, setEventGroups] = useState([]);

    const getEventGroupsByEvent = (id) => {
        return getToken().then((token) =>
            fetch(`/api/eventGroup/GetEventGroupsByEvent/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json())
        )
            .then(setEventGroups)
    }

    const addEventGroup = (eventGroupObj) => {
        console.log("EventGroup at provider: ", eventGroupObj)
        return getToken().then((token) =>
            fetch(`/api/eventGroup/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(eventGroupObj),
            })
        )
    }

    const deleteEventGroup = (id) => {
        return getToken()
            .then((token) =>
                fetch(`/api/eventGroup/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            ) // getEventGroupsByEvent() needs to be called after this
    }

    return (
        <EventGroupContext.Provider
            value={{
                eventGroups,
                getEventGroupsByEvent,
                addEventGroup,
                deleteEventGroup
            }}
        >
            {props.children}
        </EventGroupContext.Provider>
    )
}
export default EventGroupProvider;