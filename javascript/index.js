//Subscribing to newsletter
async function addSubscribeEmailToDB(email) {
    try {

        // Section to call GET request to check if email is already subscribed
        const endpoint = "https://tiny-stroopwafel-d335b2.netlify.app/subscribeMail"

        const checkResponse = await fetch(endpoint, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        const existingEmails = await checkResponse.json();
        console.log(existingEmails);
        const existingEmailList = existingEmails.map(user => user.email.toLowerCase());

        if (existingEmailList.includes(email)) {
            alert("This email is already subscribed.");
            return;
        }

        // Section to call POST request to add email to database if the email is not already subscribed
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        })

        const data = await response.json()
        console.log(data)
        if (response.ok) {
            alert("You have successfully subscribed to our newsletter.")

            document.getElementById("email").value = "";
        }
        else {
            alert("An error occurred.")
        }
    }
    catch (error) {
        console.error("Error:", error)
        alert("An error occurred.")
    }
}

// Section to add event listener to form submission
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("cta-form").addEventListener("submit", function (event) {
        event.preventDefault()

        const email = document.getElementById("email").value.trim()
        if (!email) {
            alert("Please enter a valid email.")
            return
        }

        addSubscribeEmailToDB(email)
    });
});

//Contact Us form
async function addContactRequestToDB(fullName,email,phone,message) {
    try {

        const endpoint = "https://tiny-stroopwafel-d335b2.netlify.app/contactUs"

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullName,email,phone,message }),
        })

        const data = await response.json()
        console.log(data)
        if (response.ok) {
            alert("Message successfully sent.")
            document.getElementById("contact-form").reset();
        }
        else {
            alert("An error occurred.")
        }
    }
    catch (error) {
        console.error("Error:", error)
        alert("An error occurred.")
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault()

        const fullName = document.getElementById("full-name").value
        if (!fullName) {
            alert("Please enter a valid name.")
            return
        }

        const email = document.getElementById("email").value.trim()
        if (!email) {
            alert("Please enter a valid email.")
            return
        }

        const phone = document.getElementById("number").value.trim()
        if (!phone) {
            alert("Please enter a valid phone.")
            return
        }

        const message = document.getElementById("message").value
        if (!message) {
            alert("Please enter a valid message.")
            return
        }

        addContactRequestToDB(fullName,email,phone,message)
    });
});
