import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserProfileContext, UserProfileProvider } from "../providers/UserProfileProvider";
import Login from "./Login/Login"
import Register from "./Login/Register"
import Hello from "./Hello";
import "./appViews.css";
import EventProvider from "../providers/EventProvider";
import EventList from "./Events/EventList";
import MyEventList from "./Events/MyEventList";
import EventForm from "./Events/EventForm";
import EventDetails from "./Events/EventDetails";
import ActivityProvider from "../providers/ActivityProvider";

export default function ApplicationViews() {
    const { isLoggedIn } = useContext(UserProfileContext);

    return (
        <main>
            <Switch>

                <Route path="/" exact>
                    {isLoggedIn ? <Hello /> : <Redirect to="/login" />}
                </Route>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/register">
                    <Register />
                </Route>

                <Route path="/events" exact>
                    <EventProvider>
                        <ActivityProvider>
                            {isLoggedIn ? <EventList /> : <Redirect to="/login" />}
                        </ActivityProvider>
                    </EventProvider>
                </Route>

                <Route path="/myEvents" exact>
                    <EventProvider>
                        <ActivityProvider>
                            {isLoggedIn ? <MyEventList /> : <Redirect to="/login" />}
                        </ActivityProvider>
                    </EventProvider>
                </Route>

                <Route path="/events/:id(\d+)" exact>
                    <EventProvider>
                        {isLoggedIn ? <EventDetails /> : <Redirect to="/login" />}
                    </EventProvider>
                </Route>

                <Route path="/events/add" exact>
                    <EventProvider>
                        <ActivityProvider>
                            {isLoggedIn ? <EventForm /> : <Redirect to="/login" />}
                        </ActivityProvider>
                    </EventProvider>

                </Route>

                <Route path="/events/edit/:id(\d+)" exact>
                    <EventProvider>
                        <ActivityProvider>
                            {isLoggedIn ? <EventForm /> : <Redirect to="/login" />}
                        </ActivityProvider>
                    </EventProvider>
                </Route>

                {/* <Route exact path="/events/delete/:id(\d+)">
                    <EventDelete />
                </Route> */}

            </Switch>
        </main>
    );
};