import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserProfileContext } from "./UserProfileProvider";

export const EventGroupContext = React.createContext();

export const EventGroupProvider = (props) => {
    const { getToken } = useContext(UserProfileContext);
    const [eventGroups, setEventGroups] = useState([]);
    const history = useHistory();

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
        return getToken().then((token) =>
            fetch(`/api/eventGroup/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(eventGroupObj),
            })
        ).then(history.go(-1))

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
            ).then(history.go(-1))
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