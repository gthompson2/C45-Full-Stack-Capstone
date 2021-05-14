import React, { useState, useContext, useEffect } from "react";
import {
    Form,
    FormGroup,
    Card,
    CardBody,
    Label,
    Input,
    Button,
} from "reactstrap";
import { EventContext } from "../../providers/EventProvider";
import { ActivityContext } from "../../providers/ActivityProvider";
import { useHistory, useParams } from "react-router-dom";

// Both Create and Edit routes to this form
export const EventForm = () => {

    const { addEvent, editEvent, getEventToEdit } = useContext(EventContext);
    const { activities, getAllActivities } = useContext(ActivityContext); // Needed for Activity select

    const history = useHistory();

    // If routed from edit, an ID will be provided
    const eventId = parseInt(useParams().id);

    // Used to set the userId key for evenObj
    const currentUserId = (JSON.parse(sessionStorage.getItem('userProfile'))).id

    // Assists in setting date value
    let dateString = new Date;

    /**
     * day and time are added to eventObj for this function because the  
     * form has two different input fields for the day and time portions
     * of the date value. The date fragments are held here so that they 
     * are updated along with the rest of the object as a user edits the
     * form.
     * 
     * Once the save button is clicked, day and time are joined as a single
     * string in the dateString variable and assigned to the date key; the 
     * day and time keys are then deleted
     */
    const [eventObj, setEvent] = useState({
        id: "",
        userId: "",
        date: "",
        day: "",
        time: "",
        address: "",
        description: "",
        activityId: "",
        name: ""
    })

    const saveEvent = (e) => {
        e.preventDefault();

        // User input must be tested for bad values before being sent to the API
        const day = eventObj.day;
        const time = eventObj.time;
        const address = eventObj.address;
        const activityId = eventObj.activityId;
        const name = eventObj.name;

        // Ensure that all necessary form components have been filled
        if (day === "" || time === "" || address === "" || activityId === "" || name === "") {
            window.alert("Please fill out all form components.")

            // The day portion of date must be in the correct format
        } else if (!(day.includes("/"))) {
            window.alert("Please enter a valid date in mm/dd/yyyy format.")
        } else if (day.includes("/")) {
            const [month, day2, year] = day.split("/")

            // day subsections must be integers
            if (!parseInt(month) || !parseInt(day2) || !parseInt(year)) {
                window.alert("Please enter a valid date in mm/dd/yyy format.")

                // day subsections must correspond to valid day and month values
            } else if (parseInt(month) > 12 || parseInt(month) < 1 || parseInt(day) > 31 || parseInt(day2) < 1) {
                window.alert("Please enter a valid date in mm/dd/yyy format.")

                // If eventId is not null, the user is editing an event 
            } else if (eventId) {
                // day and time values are combined into a single dateString,
                // and their keys are deleted from eventObj
                dateString = (`${eventObj.day} ${eventObj.time}`)
                delete eventObj.day
                delete eventObj.time

                editEvent({
                    id: eventObj.id,
                    userId: eventObj.userId,
                    date: (new Date(dateString).toISOString()), // Format date so that it can be successfully passed to the API
                    address: eventObj.address,
                    description: eventObj.description,
                    activityId: parseInt(eventObj.activityId),
                    name: eventObj.name

                    // User is returned to the event details page
                }).then(() => history.push(`/myEvents`))

                // If eventId is null, the user is creating an event
            } else {
                dateString = (`${eventObj.day}, ${eventObj.time}`)
                delete eventObj.day
                delete eventObj.time

                addEvent({
                    userId: currentUserId,
                    date: (new Date(dateString).toISOString()),
                    address: eventObj.address,
                    description: eventObj.description,
                    activityId: parseInt(eventObj.activityId),
                    name: eventObj.name
                }).then(() => {

                    // The user is returned to a list of their created events
                    history.push("/myEvents")
                })
            }
        }
    }

    // If a form input field is altered, the state of the 
    // corresponding key-value pair on eventObj is updated
    const handleInputChange = (e) => {
        const newEvent = { ...eventObj }
        let selectedVal = e.target.value
        if (e.target.id.includes("id")) {
            selectedVal = parseInt(selectedVal)
        }
        newEvent[e.target.id] = selectedVal
        setEvent(newEvent)
    }

    // If an event is being edited, the initial state of eventObj is set based on 
    // the event being altered
    useEffect(() => {
        getAllActivities();
        if (eventId) {
            getEventToEdit(eventId)
                .then((eventObj) => {
                    // This zombie code still needs testing
                    // Need to convert the current dateTime format to a locale string and then split
                    const dateFormat = (Date.parse(eventObj.date))
                    const dateFormat2 = (new Date(dateFormat)).toLocaleString('en-US')
                    const [initDay, initTime] = dateFormat2.split(",")
                    eventObj.day = initDay
                    eventObj.time = initTime
                    setEvent(eventObj);
                });
        }
    }, []);

    return (
        <div className="container pt-4">
            <div className="row justify-content-center">
                <Card className="col-sm-12 col-lg-6">
                    <CardBody>
                        <h3 className="postForm__title">
                            {eventId ? <> Edit Event </> : <>New Event</>}
                        </h3>
                        <Form>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input
                                    id="name"
                                    value={eventObj.name}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="description">Description</Label>
                                <br />
                                <Input
                                    type="textarea"
                                    value={eventObj.description}
                                    rows="5"
                                    id="description"
                                    onChange={handleInputChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="address">Address</Label>
                                <br />
                                <Input
                                    type="textarea"
                                    value={eventObj.address}
                                    rows="5"
                                    id="address"
                                    onChange={handleInputChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="day">Date</Label>
                                <Input
                                    value={eventObj.day}
                                    name="day"
                                    id="day"
                                    placeholder="mm/dd/yyyy"
                                    onChange={handleInputChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="time">Time</Label>
                                <Input
                                    type="select"
                                    value={eventObj.time}
                                    name="time"
                                    id="time"
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select a Time</option>
                                    <option value="6:00:00 AM UTC">6:00 AM</option>
                                    <option value="7:00:00 AM UTC">7:00 AM</option>
                                    <option value="8:00:00 AM UTC">8:00 AM</option>
                                    <option value="9:00:00 AM UTC">9:00 AM</option>
                                    <option value="10:00:00 AM UTC">10:00 AM</option>
                                    <option value="11:00:00 AM UTC">11:00 AM</option>
                                    <option value="12:00:00 PM UTC">12:00 PM</option>
                                    <option value="1:00:00 PM UTC">1:00 PM</option>
                                    <option value="2:00:00 PM UTC">2:00 PM</option>
                                    <option value="3:00:00 PM UTC">3:00 PM</option>
                                    <option value="4:00:00 PM UTC">4:00 PM</option>
                                    <option value="5:00:00 PM UTC">5:00 PM</option>
                                    <option value="6:00:00 PM UTC">6:00 PM</option>
                                    <option value="7:00:00 PM UTC">7:00 PM</option>
                                    <option value="8:00:00 PM UTC">8:00 PM</option>
                                    <option value="9:00:00 PM UTC">9:00 PM</option>
                                    <option value="10:00:00 PM UTC">10:00 PM</option>
                                    <option value="11:00:00 PM UTC">11:00 PM</option>
                                    <option value="12:00:00 AM UTC">12:00 AM</option>
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="activityId">Activity</Label>

                                <Input
                                    type="select"
                                    value={eventObj.activityId}
                                    name="activityId"
                                    id="activityId"
                                    onChange={handleInputChange}
                                >
                                    <option value="0">Select an Activity</option>
                                    {activities.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Form>
                        <Button color="info" onClick={saveEvent}>
                            {eventId ? <> Save Changes </> : <>Add Event</>}
                        </Button>
                        <Button color="danger" href='/myEvents/'>Cancel</Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
export default EventForm;