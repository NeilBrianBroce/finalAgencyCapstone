import {initializeApp} from '../node_modules/firebase/app'
import { getFirestore, collection, getDocs, addDoc, getDoc, query, where, orderBy, doc, deleteDoc, setDoc } from '../node_modules/firebase/firestore';
import Chart from 'chart.js/auto';

export function displayFunctions() {
    const { v4: uuidv4 } = require('uuid');
    const moment = require('moment');

  // Initialize Firebase
  const firebaseConfig = {
      apiKey: "AIzaSyAUWz7jfrt46iBvAnZ-AESn8kNmqtbTlmw",
      authDomain: "callarboat-19b3b.firebaseapp.com",
      databaseURL: "https://callarboat-19b3b-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "callarboat-19b3b",
      storageBucket: "callarboat-19b3b.appspot.com",
      messagingSenderId: "68894973461",
      appId: "1:68894973461:web:008be388c45659cb7d781c", 
      measurementId: "G-F86YXR2HNM"
    }

    const app = initializeApp(firebaseConfig);
    // Initialize Firestore
    const db = getFirestore(app); // pass the app instance to getFirestore

  // Reference to Firebase collections
  const bookedTicketCollection = collection(db, 'Medallion-BookedTicket');
  const paymentsCollection = collection(db, 'Payments');
  const vesselRouteCollection = collection(db, 'Vessel_Route');
  const vesselScheduleCollection = collection(db, 'Vessel_Schedule');
  const notificationsCollection = collection(db, 'Notifications');
// Function to fetch and display total bookings
function getTotalBookings() {
    getDocs(bookedTicketCollection)
    .then((querySnapshot) => {
      // Get the number of documents
      const count = querySnapshot.size;
      document.getElementById('totalBookings').innerText = count;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  
  // Function to fetch and display total earnings
  function getTotalEarnings() {
    getDocs(paymentsCollection)
    .then((querySnapshot) => {
      // Get the number of documents
      let totalEarnings = 0;
      querySnapshot.forEach((doc) => {
        totalEarnings += doc.data().Total; // Assuming there is an 'amount' field in the Payments collection
      });
      document.getElementById('totalEarnings').innerText = totalEarnings;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  
  function drawBookingAnalysisChart() {
    getDocs(bookedTicketCollection)
    .then((querySnapshot) => {
      
      const monthlyCounts = {
        '01': 0, '02': 0, '03': 0, '04': 0, '05': 0, '06': 0,
        '07': 0, '08': 0, '09': 0, '10': 0, '11': 0, '12': 0
      };

      querySnapshot.forEach((doc) => {
        const timestamp = doc.data().Date; 
        const date = new Date(timestamp.toDate()); 
        const monthKey = (date.getMonth() + 1).toString().padStart(2, '0');
        if (monthlyCounts[monthKey] !== undefined) {
          monthlyCounts[monthKey]++;
        }
      });

      const labels = Object.keys(monthlyCounts).sort(); 
      const data = labels.map((label) => monthlyCounts[label]);
      const ctx = document.getElementById('monthlyChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Booked Tickets Per Month',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  
  // Function to fetch and display trips table
  function displayTripsTable() {
    // const tripsTableBody = document.getElementById('tripsTable').getElementsByTagName('tbody')[0];
  
    // // Fetch data from Vessel_Route and Vessel_Schedule collections
    // Promise.all([
    //   vesselRouteCollection.get(),
    //   vesselScheduleCollection.get(),
    // ]).then(([routeSnapshot, scheduleSnapshot]) => {
    //   routeSnapshot.forEach((routeDoc) => {
    //     const routeData = routeDoc.data();
    //     const scheduleDoc = scheduleSnapshot.docs.find((scheduleDoc) => scheduleDoc.id === routeDoc.id);
    //     const scheduleData = scheduleDoc ? scheduleDoc.data() : {};
  
    //     const row = tripsTableBody.insertRow(-1);
    //     row.insertCell(0).innerText = routeData.tripName || 'N/A';
    //     row.insertCell(1).innerText = routeData.startDate || 'N/A';
    //     row.insertCell(2).innerText = routeData.endDate || 'N/A';
    //     row.insertCell(3).innerText = scheduleData.departureTime || 'N/A';
    //     row.insertCell(4).innerText = scheduleData.arrivalTime || 'N/A';
  
    //     // Add any additional columns as needed
    //   });
    // });

    const tripsTableBody = document.getElementById('tripsTable');
    getDocs(vesselScheduleCollection)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data(); 
        console.log("vesselScheduleCollection", data)
      });

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  
  // Function to fetch and display notifications
  function displayNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    getDocs(notificationsCollection)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const message = doc.data().message;
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerText = message; // Assuming there is a 'message' field in the Notifications collection
        notificationsList.appendChild(li);
      });

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  
  // Execute the functions when the page loads
  window.onload = function () {
    getTotalBookings();
    getTotalEarnings();
    drawBookingAnalysisChart();
    displayTripsTable();
    displayNotifications();
  };
  
  // Add click event listener to logo-details
  $('.logo-details').click(function () {
    $('#sidebar').toggleClass('close');
    $('.navbar').toggleClass('navbar-collapsed');
  });

}