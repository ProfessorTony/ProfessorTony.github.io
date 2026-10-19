/*
   New Perspectives on HTML5 and CSS3, 8th Edition
   Tutorial 7
   Tutorial Case


   Filename: rb_formsubmit.js

   Purpose: The purpose of this program is to simply report on a
            successful completition of a valid Web form.

            When the form is submitted, the onsubmit event handler
            verifies that the form data is complete and valid.
            An alert box is displayed notifying the user.

            The event function returns a value of false so that the
            student does not have to continually retype test values
            in the survey form.


*/

// Wait until the document is loaded so its form element is available to script.
window.onload = function() {
   // forms is the document's collection of forms; this page has one, at index 0.
   document.forms[0].onsubmit = function() {
      // checkValidity() asks the browser to evaluate built-in constraints such
      // as required, type="email", pattern, min, and max. For an ordinary user
      // submission, the browser checks constraints before firing submit, so
      // this handler normally runs only for valid data and the check is
      // redundant. It is useful as an example of querying validity in script;
      // novalidate or formnovalidate can change the normal submission flow.
      if (this.checkValidity()) alert("No invalid data detected. Will retain data for further testing.");

      // Returning false cancels the normal submission, regardless of validity.
      // This tutorial behavior keeps entered values available for repeated
      // tests; a real application should submit valid values to its server.
      return false;
   };
};