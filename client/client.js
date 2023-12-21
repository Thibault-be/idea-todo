const body = document.querySelector("body");

(async () => {
  const ideas = async (req, res) => {
    try {
      const ideas = await fetch("http://127.0.0.1:3000/");
      const data = await ideas.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  const ideaList = await ideas();

  const ideaItem = (idea) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("idea-wrapper");

    const deleteHref = document.createElement("a");
    deleteHref.classList.add(`delete`);
    deleteHref.classList.add(`${idea.id}`);
    const deleteImg = document.createElement("img");
    deleteImg.setAttribute("src", "./img/trashcan.svg");
    deleteHref.appendChild(deleteImg);

    deleteHref.addEventListener("click", () => {
      removeIdea(deleteHref);
    });

    const editHref = document.createElement("a");
    //editHref.setAttribute("href", "./update.html");
    editHref.classList.add("edit");
    editHref.classList.add(`${idea.id}`);
    const editImg = document.createElement("img");
    editImg.setAttribute("src", "./img/edit.svg");
    editHref.appendChild(editImg);

    const title = document.createElement("h3");
    title.classList.add("idea-title");
    title.textContent = idea.title;

    const ideaDescription = document.createElement("p");
    title.classList.add("idea-description");

    ideaDescription.textContent = idea.description;

    wrapper.appendChild(editHref);
    wrapper.appendChild(deleteHref);
    wrapper.appendChild(title);
    wrapper.appendChild(ideaDescription);
    body.appendChild(wrapper);

    editHref.addEventListener("click", () => {
      editIdea(editHref);
    });
  };

  ideaList.forEach((idea) => {
    ideaItem(idea);
  });
})();

async function removeIdea(deleteHref) {
  //obtain database id
  const databaseID = Array.from(deleteHref.classList)
    .join("")
    .replace("delete", "");

  //remove element from DOM
  deleteHref.parentElement.remove();

  //remove element from database
  try {
    const response = await fetch(`http://127.0.01:3000/${databaseID}`, {
      method: "DELETE",
    });
    deleteHref.parentElement.remove();
  } catch (err) {
    console.log(err);
  }
}

function editIdea(editHref) {
  //grab the dialog
  const modal = document.querySelector("dialog");
  modal.showModal();

  //grab h3
  const titleToUpdate = editHref.parentElement.children[2];
  const modalTitle = document.querySelector("#modal-title");
  modalTitle.value = titleToUpdate.textContent;

  //grab p
  const descriptionToUpdate = editHref.parentElement.children[3];
  const modalDescription = document.querySelector("#modal-description");
  modalDescription.value = descriptionToUpdate.textContent;

  const cancelBtn = document.querySelector("#cancel-btn");
  cancelBtn.addEventListener("click", () => {
    modal.close();
  });

  const saveBtn = document.querySelector("#save-btn");
  saveBtn.addEventListener("click", async () => {
    titleToUpdate.textContent = modalTitle.value;
    descriptionToUpdate.textContent = modalDescription.value;

    modal.close();

    //updates nog sturen naar database
    const databaseID = Array.from(editHref.classList)
      .join("")
      .replace("edit", "");

    console.log(titleToUpdate.textContent);

    try {
      const response = await fetch(`http://127.0.0.1:3000/${databaseID}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: titleToUpdate.textContent,
          description: descriptionToUpdate.textContent,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  });
}

// async function editIdea(editHref) {
//   //obtain the database idea

//   //const updatedTitle =
//   //const updatedDescription =

//   const databaseID = Array.from(editHref.classList)
//     .join("")
//     .replace("edit", "");

//   try {
//     const response = await fetch(`127.0.0.1:3000/${databaseID}`, {
//       method: "PATCH",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify({
//         title: updatedTitle,
//         description: updatedDescription,
//       }),
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }
