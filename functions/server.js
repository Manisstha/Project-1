const https = require("https");

const dbUrl = "https://mid-project-manish.netlify.app/public/db.json";

// Function to fetch data from db.json
const readData = () => {
  return new Promise((resolve, reject) => {
    https
      .get(dbUrl, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject("Error parsing JSON");
          }
        });
      })
      .on("error", (err) => {
        reject("Error fetching db.json: " + err.message);
      });
  });
};

// Function to handle requests
exports.handler = async (event) => {
  const { path, httpMethod, body } = event;

  // Parse API path
  const pathParts = path.split("/").filter(Boolean);
  const entity = pathParts[1]; // projects, subscribeMail, contactUs
  const uuid = pathParts[2] || null; // Optional UUID

  try {
    let data = await readData(); // Fetch fresh data from db.json

    if (httpMethod === "GET") {
      if (entity === "projects") {
        if (uuid) {
          const project = data.projects.find((p) => p.uuid == uuid);
          if (project) return { statusCode: 200, body: JSON.stringify(project) };
          return { statusCode: 404, body: JSON.stringify({ message: "Project not found" }) };
        }
        return { statusCode: 200, body: JSON.stringify(data.projects) };
      }
    } else if (httpMethod === "POST") {
      if (entity === "subscribeMail") {
        const newSubscription = JSON.parse(body);
        newSubscription.id = Date.now().toString();
        data.subscribeMail.push(newSubscription);

        return { statusCode: 201, body: JSON.stringify(newSubscription) };
      } else if (entity === "contactUs") {
        const newContact = JSON.parse(body);
        newContact.id = Date.now().toString();
        data.contactUs.push(newContact);

        return { statusCode: 201, body: JSON.stringify(newContact) };
      }
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error", error }) };
  }

  return { statusCode: 404, body: JSON.stringify({ message: "Not Found" }) };
};
