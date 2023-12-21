const logIdeaBtn = document.querySelector(".log-idea");
const newIdeaTitleElement = document.getElementById("idea-title");
const newIdeaDescriptionElement = document.getElementById("idea-description");
const ideaList = document.querySelector(".idea-list"); //niet nodig ?
const lastTitle = document.querySelector(".last-idea-title");
const lastDescription = document.querySelector(".last-idea-description");

logIdeaBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const newTitle = newIdeaTitleElement.value;
  const newDescription = newIdeaDescriptionElement.value;

  try {
    const response = await fetch("http://127.0.0.1:3000/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("Idea logged successfully:", data.message);
      displayLastIdea();
    } else {
      console.error("Failed to log the idea:", data.message);
    }
  } catch (error) {
    console.error("Error logging the idea:", error);
  }
  lastIdeaAdded();
  newIdeaTitleElement.value = "";
  newIdeaDescriptionElement.value = "";
});

async function lastIdeaAdded() {
  try {
    const response = await fetch("http://127.0.0.1:3000");
    const data = await response.json();
    return data[data.length - 1];
  } catch (err) {
    console.log(err);
  }
}

async function displayLastIdea() {
  const lastIdea = await lastIdeaAdded();

  if (lastIdea) {
    const title = await lastIdea.title;
    const description = await lastIdea.description;
    lastTitle.textContent = title;
    lastDescription.textContent = description;
    console.log(title, description);
  }
}

displayLastIdea();
