title: Error Handling
----
view: reference
----
excerpt:

Expecting the unexpected is an important part of program architecture. In this
section we'll go over all the ways programs can fail, and how to efficiently
handle errors in Choo.
----
text:

Expecting the unexpected is an important part of program architecture. In this
section we'll go over all the ways programs can fail, and how to efficiently
handle errors in Choo.

## Types of Errors
Generally errors can be split up in two types:
- __Expected Errors:__ these are errors that can be handled by the system. For
  example when dealing with incorrect user input.
- __Unexpected Errors:__ these are errors that cannot be handled by the system.
  These are also commonly referred to as "exceptions". This can for example
  occur when calling a method that doesn't exist (e.g. `cannot call 'foo' of
  undefined`).

There's a difference in how we should deal with errors depending what kind of
error we're dealing with. If an error is expected, we might want to retry the
action. Or perhaps inform the user that their action could not be processed.

Unexpected errors usually indicate a system failure. This category of errors
usually indicates that there's an error in the programming, and the system might
need to be (partially) restarted.

## Communicating Errors
When an error occurs in your system, you'll usually receive an error message and
stack trace. These are great to help programmers debug errors, but not so much
for the users of the system. This means we'll need to find a way to translate
our internal computer errors to something that's useful for our users.

Communicating errors is more of an art than an exact science. They only happen
when something goes wrong - and if it's not clear what's happening, it's easy to
frustrate users. When thinking about errors, we should take a pause and think
about how we want to approach it:

- Are we dealing with a critical failure, or something that's not as important?
- Should we interrupt whatever the user is doing, or do we want to be more
  subtle?
- When the error occurs, how much context will the user have?
- Is the error something that's silently failed in the background, or will this
  happen in the middle of another task?
- What's the tone of voice we want to use - are our users casual or more
  serious?
- Which language will our users be speaking?

In short: there's a lot to consider about errors, and it requires time and
attention to get right.

## Interface Patterns
Before we can start thinking of how to program errors, we should think of how we
want to display them. Depending on the situation, we might want to display an
error differently. Let's go over some common patterns.

### Console
When developing an application, you'll probably want to output all errors and
events to your console.

### Labels
One of the least intrusive ways to show an error is using a label. Labels are
elements that appear next to another element. This is for example quite common
with forms.

These errors often indicate some form of validation failure, and should include
a brief, actionable message.

### Notification Trays
Notification trays are commonly used for application-level feedback. The
notification tray is usually not only used for errors, but for all sorts of
system-wide notifications.

There can be many different levels of notifications, but usually you'll at least
want to have an "error" notification, and an "info" notification.

Notification trays are particularly useful to display asynchronous errors. For
example if an HTTP request fails, you could display a notification in the tray,
and specific feedback on the form.

Similarly if an HTTP request succeeds, you could show a notification for success
(for example: "Settings updated!").

### Modals
Modals are designed to demand attention. If a modal is used to display an error,
it means the situation is dire and should prevent every other action on the page
from occurring.

Because of the intensity of a modal, they are also the most likely of all UI
patterns to frustrate people. Using modals to display errors should typically
only be used as a last resort in case of critical failure.

### Servers
"Telemetry" is an important part to consider for applications. When an error
occurs, there might be cases where you phone home to be notified of a system
failure. This area is very closely related to analytics.

Always make sure that the data you're sending to your servers matches your
user's expectations. You might want to take a moment to ponder about your
application's privacy model. Privacy is an important topic, because getting it
wrong might at best result in unhappy users, and at worst in litigation. But in
all cases, us programmers have a moral obligation to try our best!

## Programming Patterns
Handling errors in applications typically involves three parts:
- __the error source:__ is the point in code where the error originates from.
  This can be a failed HTTP request, incorrect input, or perhaps a socket
  event.
- __the error mapping:__ takes the raw error from the error source, and
  transforms it into something we can display. This should contain information
  that is clear & actionable for a user.
- __the error display:__ takes the error, and acts upon it. This can be on a
  screen, but can just as well be in the console or part of a server request.

<!-- todo from here onward -->

### Error Sources
- use `new Error()`
- have a trace

### Mapping Errors
- keep original message
- new message
- think about i18n
- keep errors local to where they come from

### Error Display
- show message
- think about how to structure your log levels
- think what needs to be logged locally
