import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserProfileContext, UserProfileProvider } from "../providers/UserProfileProvider";
import Login from "./Login/Login"
import Register from "./Login/Register"
import Hello from "./Hello";
import "./appViews.css";
import EventProvider from "../providers/EventProvider";
import EventList from "./Events/EventList";

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

                <Route path="/events">
                    <EventProvider>
                        {isLoggedIn ? <EventList /> : <Redirect to="/login" />}
                    </EventProvider>
                </Route>

            </Switch>
        </main>
    );
};