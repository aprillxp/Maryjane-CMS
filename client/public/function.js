// const BASE_URL = "https://maryjane.gavril.my.id"; // <-- for production
const BASE_URL = "http://localhost:3000"; // for local running

function doRegister() {
  const username = $("#register-username").val();
  const email = $("#register-email").val();
  const password = $("#register-password").val();
  const phone = $("#register-phone").val();
  const userAddress = $("#register-address").val();

  $.ajax(`${BASE_URL}/register`, {
    method: "POST",
    data: {
      username,
      email,
      password,
      phoneNumber: phone,
      address: userAddress,
    },
  })
    .done(() => {
      Swal.fire("Nice!", "Register Succes", "success");
      $("#register-username").val("");
      $("#register-email").val("");
      $("#register-password").val("");
      $("#register-phone").val("");
      $("#register-address").val("");
    })
    .fail((err) => {
      Swal.fire({
        title: "Poor kid!",
        text: `${err.responseJSON.message}`,
        icon: "error",
        confirmButtonText: "Okay",
      });
    });
}

function doLogin() {
  const email = $("#login-email").val();
  const password = $("#login-password").val();

  $.ajax(`${BASE_URL}/login`, {
    method: "post",
    data: {
      email,
      password,
    },
  })
    .done((res) => {
      Swal.fire("Nice!", "Login Succes", "success");
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("username", res.username);
      $("#username").html(`${res.username}`);
      $("#login-section").hide();
      $("#home-section").show();
      fetchData();
      productCount();
      categoryCount();
      fetchCategory();
    })
    .fail((err) => {
      Swal.fire({
        title: "Poor kid!",
        text: `${err.responseJSON.message}`,
        icon: "error",
        confirmButtonText: "Okay",
      });
    });
}

function addProduct() {
  const name = $("#product-name").val();
  const category = $("#product-category").val();
  const description = $("#product-desc").val();
  const stock = $("#product-stock").val();
  const price = $("#product-price").val();
  const imgUrl = $("#product-image").val();

  $.ajax(`${BASE_URL}/products`, {
    method: "post",
    data: {
      name,
      category,
      description,
      stock,
      price,
      imgUrl,
    },
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done(() => {
      Swal.fire("Nice!", "Product just added", "success");
      $("#new-product-section").hide();
      $("#product-section").show();
      fetchData();
    })
    .fail((err) => {
      console.log(err);
    });
}

function addCategory() {
  const name = $("#category-name").val();
  $.ajax(`${BASE_URL}/categories`, {
    method: "post",
    data: {
      name,
    },
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done(() => {
      Swal.fire("Nice!", "Category just added", "success");
      $("#new-category-section").hide();
      $("#category-section").show();
      fetchCategory();
      fetchData();
    })
    .fail((err) => {
      console.log(err);
    });
}

function productCount() {
  $.ajax(`${BASE_URL}/products`, {
    method: "get",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((data) => {
      let productCount = `
    <h6 class="card-title card-number" id="total-product">
    ${data.length}
    </h6>`;
      $("#total-product").html(productCount);
    })
    .fail((err) => {
      console.log(err.responseJSON.message);
    });
}

function fetchData() {
  $.ajax(`${BASE_URL}/products`, {
    method: "get",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((data) => {
      let htmlReplace = "";

      data.forEach((el, i) => {
        const role = localStorage.getItem("role");
        let deleteButton = "";
        if (
          role === "Staff" &&
          el.User.email !== localStorage.getItem("email")
        ) {
          deleteButton = `<td></td>`;
        } else {
          deleteButton = `
            <td>
            <a class="ms-3 delete-product" onclick="doDelete(${el.id})">
            <span class="icon material-symbols-outlined text-danger">delete</span>
            </a>
            </td>`;
        }

        htmlReplace += `
          <tr>
            <td scope="row">${i + 1}</td>
            <td class="fw-bold">${el.name}</td>
            <td>
            <img
            src="${el.imgUrl}"
            class="img-fluid"
            />
            </td>
            <td>${el.description}</td>
            <td>${el.stock}</td>
            <td class="fw-bold">$ ${el.price}</td>
            <td>${el.User.email}</td>
            <td>
            <a href="#" class="ms-3 delete-product" onclick="doDelete(${
              el.id
            })">
            <span class="icon material-symbols-outlined text-danger">delete</span>
            </a>
            </td>
            </tr>
            `;
      });

      $("#table-product").html(htmlReplace);
    })
    .fail((err) => {
      console.log(err.responseJSON.message);
    });
}

function categoryCount() {
  $.ajax(`${BASE_URL}/categories`, {
    method: "get",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  }).done((data) => {
    let categoryCount = `
    <h6 class="card-title card-number" id="total-category">
    ${data.length}
    </h6>
    `;
    $("#total-category").html(categoryCount);
  });
}

function fetchCategory() {
  $.ajax(`${BASE_URL}/categories`, {
    method: "get",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  }).done((data) => {
    let htmlReplaceCategories = "";
    data.forEach((el, i) => {
      htmlReplaceCategories += `
      <tr>
      <td scope="row">${i + 1}</td>
      <td class="fw-bold">${el.name}</td>
      <td>
        <a href="" class="ms-3"
          ><span
            class="icon material-symbols-outlined text-danger"
            >delete</span
          ></a
        >
      </td>
    </tr>
      `;
    });
    let htmlOption = `<option value="" selected disabled>
    -- Select Category --
    </option>`;
    data.forEach((el) => {
      htmlOption += `

    <option value="${el.id}">${el.name}</option>
      `;
    });
    $("#product-category").html(htmlOption);
    $("#table-category").html(htmlReplaceCategories);
  });
}

function doLogout() {
  localStorage.clear();
  $("#login-section").show();
  $("#home-section").hide();
}

function doDelete(id) {
  $.ajax(`${BASE_URL}/products/${id}`, {
    method: "delete",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done(() => {
      Swal.fire("Great!", "Product successfully deleted", "success");
      fetchData();
    })
    .fail((err) => {
      Swal.fire({
        title: "Poor kid!",
        text: `${err.responseJSON.message}, you can't delete this item`,
        icon: "error",
        confirmButtonText: "Okay",
      });
    });
}
