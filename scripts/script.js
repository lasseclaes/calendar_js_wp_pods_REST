//alert("hey")
//there are - always - some things I don't like too much about this script. Buttons are added in the HTML, and then disabled here. I'd rather add them as link on a need to basis, but I don't have time for the CSS right now - and I wont to make a JS point with this

window.addEventListener('DOMContentLoaded', init);

const datalink = "https://lasseclaes.com/20f/2nd_sem_int/funah/wp-json/wp/v2/online_event?_embed";
//var currentEvent =

function init() {
  disableButtons();
  fetchEventsForCalendar();
}

function disableButtons() {
  //let count = 0;
  const btns = document.querySelectorAll("button");
  //console.log(btns)
  btns.forEach(btn => {
    btn.disabled = true;
    //count += 1;
    //console.log(count);
    //document.querySelector("h1//").textContent = count;
  })
}

function fetchEventsForCalendar() {
  fetch(datalink)
    .then(res => res.json())
    .then(handleData);
}

function handleData(events) {
  events.forEach(addToCalendar); //looping through all bikes - or events...
}

function addToCalendar(event) {
  console.log(event);
  //console.log(event.start_date_and_time); //e.g. 2020-05-15 20:00:00
  const datetime = event.start_date_and_time.split(" ");
  console.log(datetime[0]); //Array(2)
  /* 0: "2020-05-20"
  1: "20:00:00" */
  // const selector = '[datetime=]' +
  const thisBtn = document.querySelector("[datetime='" + datetime[0] + "']").parentElement;
  console.log("HEY");
  console.log(thisBtn);
  thisBtn.disabled = false;
  //thisBtn.dataset.id = "event-" + event.id; //two ways... readable in HTML
  //thisBtn.theId = event.id; //just attaching at as a new property, plain number to avoid string
  thisBtn.dataset.id = event.id;
  thisBtn.eventInfo = event; //attaching the event-info to the btn
  thisBtn.addEventListener('click', showEventInformation);
}

function showEventInformation(evt) {
  console.log("CLICK");
  console.log(evt.target.eventInfo);
  //console.log(evt.target.dataset.id);
  const myData = evt.target.eventInfo;

  const h2 = document.querySelector('article h2');
  h2.textContent = myData.title.rendered;

  const dayname = document.querySelector('.dayname');

  //translate date format
  const dateInJS = new Date(myData.start_date_and_time);
  console.log(dateInJS);
  console.log(dateInJS.getDay());
  console.log(getDayName(dateInJS.getDay()));
  //which numnber is it
  //dayname.textContent = getDayName()
  dayname.textContent = getDayName(dateInJS.getDay());

  //dates
  const daynumber = document.querySelector('.daynumber');
  daynumber.textContent = getOrdinalNum(dateInJS.getDate()); //dateInJS.getDate()

  const month = document.querySelector('.month');
  month.textContent = getMonthName(dateInJS.getMonth());

  const year = document.querySelector('.year');
  year.textContent = dateInJS.getFullYear();

  const venue = document.querySelector('.online-venue');
  const a = document.createElement('a');
  a.href = "online-venue.html?id=" + myData.online_venue[0];
  a.textContent = myData._embedded["wp:term"][1][0].name;
  venue.innerHTML = '';
  venue.appendChild(a);

  const eventInfo = document.querySelector('.event-info');
  eventInfo.innerHTML = myData.content.rendered;

  const people = document.querySelector('.people');
  people.innerHTML = '';
  myData.person.forEach(pers => {
    //console.log(perso);
    const li = document.createElement('li');
    const aP = document.createElement('a');
    aP.href = "person-page.html?id=" + myData.person[0];
    aP.textContent = myData._embedded["wp:term"][2][0].name;
    li.appendChild(aP);
    people.appendChild(li);
  });
  const img = document.querySelector('img');
  console.log(myData._embedded["wp:featuredmedia"][0].media_details.sizes.full);
  img.src = myData._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
}

//https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_date_weekday - rewritten as a function
function getDayName(number) {
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  return weekday[number];
}

//https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_date_getmonth - rewritten as a function
function getMonthName(number) {
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  return month[number];
}

//stolen from https://stackoverflow.com/questions/15397372/javascript-new-date-ordinal-st-nd-rd-th
function getOrdinalNum(n) {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
}
