console.log('Front-end code are starting.');

const deleteEmailBtn = document.getElementById('delete-email-btn');

const deleteEmail = function (id) {
  if (id) {
    fetch("/emails/" + id, {
      method: "DELETE",
    }).then(function (response) {
      if (response.ok) {
        location.reload();
        alert('Delete the email successfully');
      } else {
        alert(new Error('Something went wrong'));
      }
    });
  }
}

const handleDelete = function (element) {
  const id = element.id;
  const confirmation = confirm('Are you sure to delete the email?');
  if (confirmation) {
    deleteEmail(id);
  }
};