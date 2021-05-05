USE [SocialCircle];
GO

set identity_insert [Activity] on
insert into [Activity] ([Id], [Name]) 
values (1, 'Sports'), (2, 'Outdoors'), (3, 'Workout'), (4, 'Social'), (5, 'Video Games'),
	   (6, 'Movie'), (7, 'Food')
set identity_insert [Activity] off

set identity_insert [Event] on
insert into [Event] (Id, UserId, [Name], [Date], [Address], [Description], [ActivityId]) values (1, 1, '4 Mile Hike', '2021-05-29', '2500 Old Hickory Boulevard Nashville, TN, 37221', '4 mile hike through the Percy Warner red dot trail', 2);
insert into [Event] (Id, UserId, [Name], [Date], [Address], [Description], [ActivityId]) values (2, 2, 'Pedal Tavern Ride', '2021-06-20', '1504 Demonbreun St Nashville, TN, 37203', 'Need 3 more people for a full Pedal Tavern party through downtown Nashville', 4);
set identity_insert [Event] off

set identity_insert [UserProfile] on
insert into UserProfile (Id, DisplayName, FirstName, LastName, Email, CreateDateTime, FirebaseUserId) values (1, 'Joe', 'Joe', 'Schmoe', 'jschmoe@gmail.com', '2021-05-04', 'aA1gJZHYWKPUKm4q0dfMG5dWnbl2');
insert into UserProfile (Id, DisplayName, FirstName, LastName, Email, CreateDateTime, FirebaseUserId) values (2, 'Jim', 'Jim', 'Halpbert', 'jhalpbert@gmail.com', '2021-05-04', 'PXYYNY6Z4mW0FFWQlUEp36cA5Mo2');
set identity_insert [UserProfile] off

