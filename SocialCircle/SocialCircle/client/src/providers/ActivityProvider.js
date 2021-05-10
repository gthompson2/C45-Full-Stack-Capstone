import React, { useState, useContext } from "react";
import { UserProfileContext } from "./UserProfileProvider";

export const ActivityContext = React.createContext();

export const ActivityProvider = (props) => {
    const { getToken } = useContext(UserProfileContext);
    const [activities, setActivities] = useState([]);

    const getAllActivities = () => {
        //the proxy that was set up in package.json will be handling the first part of the URL
        return getToken()
            .then((token) =>
                fetch("/api/activity", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((res) => res.json())
            )
            .then(setActivities);
    }

    return (
        <ActivityContext.Provider
            value={{
                activities,
                setActivities,
                getAllActivities
            }}
        >
            {props.children}
        </ActivityContext.Provider>
    )
}

export default ActivityProvider;
