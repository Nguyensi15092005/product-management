// Permissions
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    let permissions = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");

    rows.forEach(row => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      if (name == "id") {
        inputs.forEach(input => {
          const id = input.value
          permissions.push({
            id: id,
            permissions: []
          });
        })
      }
      else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          // console.log(name)
          // console.log(index)
          // console.log(checked)

          if (checked) {
            permissions[index].permissions.push(name)
          }
        })
      }
    })
    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector("#form-change-permissions");
      const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
      inputPermissions.value = JSON.stringify(permissions);
      formChangePermissions.submit();
    }
  })
}

// End Permissions

// Permissions checked
const dataRoles = document.querySelector("[data-roles]");
if (dataRoles) {
  const roles = JSON.parse(dataRoles.getAttribute("data-roles"));

  const tablePermissions = document.querySelector("[table-permissions]");

  roles.forEach((role, index) => {
    const permissions = role.permissions;

    permissions.forEach(permission => {
      const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
      const input = row.querySelectorAll("input")[index];
      input.checked = true;
    })

  });
}

// End Permissions checked

