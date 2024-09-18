var filter_form = document.querySelector(".admin__content--body__filter");
function getFilterFromURL() {
  filter_form.querySelector("#authorName").value = (urlParams['name'] != null) ? urlParams['name'] : "";
  filter_form.querySelector("#authorId").value = (urlParams['id'] != null) ? urlParams['id'] : "";
  filter_form.querySelector("#authorEmail").value = (urlParams['email'] != null) ? urlParams['email'] : "";
  filter_form.querySelector("#statusSelect").value = (urlParams['status'] != null) ? urlParams['status'] : "active";

}
function pushFilterToURL() {
  var filter = getAUFilterFromForm();
  var url_key = {
    "author_name": "name",
    "author_id": "id",
    "author_email": "email",
    "author_status":"status"
  }
  var url = "";
  Object.keys(filter).forEach(key => {
    url += (filter[key] != null && filter[key] != "") ? `&${url_key[key]}=${filter[key]}` : "";
  });
  return url;
}
function getAUFilterFromForm() {
  return {
    "author_name": filter_form.querySelector("#authorName").value,
    "author_id": filter_form.querySelector("#authorId").value,
    "author_email": filter_form.querySelector("#authorEmail").value,
    "author_status": filter_form.querySelector("#statusSelect").value,

  }

}

// Load the jquery
var script = document.createElement("SCRIPT");
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName("head")[0].appendChild(script);
var search = location.search.substring(1);
urlParams = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) })
var number_of_item = urlParams['item'];
var current_page = urlParams['pag'];
var orderby = urlParams['orderby'];
var order_type = urlParams['order_type'];
if (current_page == null) {
    current_page = 1;
}
if (number_of_item == null) {
    number_of_item = 5;
}
if (orderby == null) {
    orderby = "";
}
if (order_type != "ASC" && order_type != "DESC") {
    order_type = "ASC";
}
function checkReady() {
  return new Promise(async function (resolve) {
    while (!window.jQuery) {
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    resolve();
  })
}
async function loadForFirstTime() {
  await checkReady();
  getFilterFromURL();
  loadItem();
}
function pagnationBtn() {
  // pagnation
  document.querySelectorAll('.pag').forEach((btn) => btn.addEventListener('click', function () {
    current_page = btn.innerHTML;
    loadItem();
  }));
  if (document.getElementsByClassName('pag-pre').length > 0)
    document.querySelector('.pag-pre').addEventListener('click', function () {
      current_page = Number(document.querySelector('span.active').innerHTML) - 1;
      loadItem(number_of_item, current_page);
    });
  if (document.getElementsByClassName('pag-con').length > 0)
    document.querySelector('.pag-con').addEventListener('click', function () {
      current_page = Number(document.querySelector('span.active').innerHTML) + 1;

      loadItem();
    });
}
function loadItem() {
  var filter = getAUFilterFromForm();
  $.ajax({
    url: '../controller/admin/pagnation.controller.php',
    type: "post",
    dataType: 'html',
    data: {
      number_of_item: number_of_item,
      current_page: current_page,
      function: "getRecords",
      filter: filter
    }
  }).done(function (result) {
    if (current_page > parseInt(result)) current_page = parseInt(result)
    if (current_page < 1) current_page = 1;
    $.ajax({
      url: '../controller/admin/pagnation.controller.php',
      type: "post",
      dataType: 'html',
      data: {
        number_of_item: number_of_item,
        current_page: current_page,
        function: "render",
        orderby: orderby,
        order_type: order_type,
        filter: filter
      }
    }).done(function (result) {

      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?page=' + urlParams['page'] + '&item=' + number_of_item + '&current_page=' + current_page;
      newurl += pushFilterToURL();
      window.history.pushState({ path: newurl }, '', newurl);
      $('.result').html(result);
      pagnationBtn();
      filterBtn();
      js();
    })
  })
};
document.addEventListener("DOMContentLoaded", () => {
  loadForFirstTime()
});

function filterBtn() {
  $(".body__filter--action__filter").click((e) => {
    current_page = 1;
    e.preventDefault();
    loadItem();
  })
  $(".body__filter--action__reset").click((e) => {
    current_page = 1;
    status_value = "active";
    $.ajax({
      url: '../controller/admin/pagnation.controller.php',
      type: "post",
      dataType: 'html',
      data: {
        number_of_item: number_of_item,
        current_page: current_page,
        function: "render",
        orderby: orderby,
        order_type: order_type,
        filter: {
          author_status: status_value
      }
      }
    }).done(function (result) {
      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?page=' + urlParams['page'] + '&item=' + number_of_item + '&current_page=' + current_page;
      window.history.pushState({ path: newurl }, '', newurl);
      $('.result').html(result);
      pagnationBtn();
      js();
    })
  })
}

const js = function () {
  if (orderby != "" && order_type != "") document.querySelector("[data-order=" + "'" + orderby + "']").innerHTML+=(order_type=="ASC")?' <i class="fas fa-sort-up">':' <i class="fas fa-sort-down">';
  else document.querySelector("[data-order]").innerHTML+=(order_type=="ASC")?' <i class="fas fa-sort-up">':' <i class="fas fa-sort-down">';
  document.querySelector(".result").querySelectorAll("th").forEach((th) => {
      if (th.hasAttribute("data-order")) th.addEventListener("click", () => {
          if (orderby == "") orderby = document.querySelector("[data-order]").getAttribute("data-order");
          if (orderby == th.getAttribute("data-order") && order_type == "ASC") {
              order_type = "DESC";
          }
          else {
              order_type = "ASC"
          }
          orderby = th.getAttribute("data-order");
          loadItem();
      })
  });
  const addHtml = `
  <div class="form">
    <h2>Thêm Tác Giả</h2>
    <div class="input-field">
      <label for="addAuthorName">Tên tác giả</label>
      <input type="text" id="addAuthorName">
    </div>
    <div class="input-field">
      <label for="addAuthorEmail">Email</label>
      <input type="email" id="addAuthorEmail">
    </div>
  </div>
`;

  // Lấy các phần tử cần thiết từ DOM
  const addAuthorModal = document.getElementById('addAuthorModal');
  const addModalContent = document.querySelector(".addModal-content .form");
  const openModalBtn = document.querySelector('.body__filter--action__add');
  const addButton = document.getElementById("addButton");
  const closeAddIcon = document.querySelector(".addModal-content .close i");


  openModalBtn.addEventListener('click', function () {
    addModalContent.innerHTML = addHtml;
    addAuthorModal.style.display = "block";
  });

  closeAddIcon.addEventListener('click', function () {
    addAuthorModal.style.display = "none";
  });

  addButton.addEventListener('click', function (e) {
    e.preventDefault(); 

    const name = document.getElementById("addAuthorName").value.trim();
    const email = document.getElementById("addAuthorEmail").value.trim();

    if (name === '' || email === '') {
      alert("Vui lòng điền đầy đủ thông tin tên và email.");
      return; 
    }

    $.ajax({
      url: '../controller/admin/author.controller.php',
      type: "post",
      dataType: 'html',
      data: {
        function: "create",
        field: {
          name: name,
          email: email,
        }
      }
    }).done(function (result) {
      loadItem();
      $("#sqlresult").html(result);
    });

    addAuthorModal.style.display = "none";
  });







  const editModal = document.getElementById("editModal");
  const editModalContent = document.querySelector(".editModal-content .form");
  const editFunctionButton = document.querySelector(".editFunctionButton");
  const editAuthorButton = document.querySelector(".editAuthorButton");
  const closeEditIcon = document.querySelector(".editModal-content .close i");
  const saveButton = document.getElementById("saveButton");


  const deleteModal = document.getElementById("deleteModal");
  const deleteModalContent = document.querySelector(".deleteModal-content .form");
  const closeDeleteIcon = document.querySelector(".deleteModal-content .close i");


  const editHtml = `
    <div class="form">
      <h2>Chỉnh sửa thông tin tác giả</h2>
      <form id="form">
        <div class="input-field">
          <label for="editAuthorId">Mã tác giả</label>
          <input type="text" id="editAuthorId" readonly>
        </div>
        <div class="input-field">
          <label for="editAuthorName">Tên tác giả</label>
          <input type="text" id="editAuthorName">
        </div>
        <div class="input-field">
          <label for="editAuthorEmail">Email</label>
          <input type="email" id="editAuthorEmail">
        </div>
      </form>
    </div>`;

  const deleteHtml = `
    <h2>Xác nhận xóa thông tin tác giả</h2>
    <form id="form">
      <label for="editAuthorId">Mã tác giả</label>
      <div id="author-delete-id"></div>
      <label for="editAuthorName">Tên tác giả</label>
      <div id="author-delete-name"></div>
      <label for="editAuthorEmail">Email</label>

      <div id="author-delete-email"></div>
      
    </form>`;

  editAuthorButton.addEventListener("click", () => {
    editModalContent.innerHTML = editHtml;
    editModal.style.display = "block";
    editFunctionButton.classList.remove("d-none");
    editAuthorButton.classList.add("d-none");
  });

  closeEditIcon.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
  });

  var edit_btns = document.getElementsByClassName("actions--edit");
  for (var i = 0; i < edit_btns.length; i++) {
    edit_btns[i].addEventListener('click', function () {
      editModalContent.innerHTML = editHtml;
      editModal.style.display = "block";
      var authorId = this.parentNode.parentNode.querySelector(".id").innerHTML;
      var authorName = this.parentNode.parentNode.querySelector(".name").innerHTML;
      var authorEmail = this.parentNode.parentNode.querySelector(".email").innerHTML;
      document.getElementById("editAuthorId").value = authorId;
      document.getElementById("editAuthorName").value = authorName;
      document.getElementById("editAuthorEmail").value = authorEmail;


      saveButton.addEventListener('click', function (e) {
        e.preventDefault();
        $.ajax({
          url: '../controller/admin/author.controller.php',
          type: "post",
          dataType: 'html',
          data: {
            function: "edit",
            field: {
              id: authorId,
              name: editModal.querySelector('#editAuthorName').value,
              email: editModal.querySelector('#editAuthorEmail').value,
            }
          }
        }).done(function (result) {
          loadItem();
          $("#sqlresult").html(result);

        });
        editModal.style.display = "none";
      });
    });
  };



  const del_btns = document.getElementsByClassName("actions--delete");
  for (let i = 0; i < del_btns.length; i++) {
    del_btns[i].addEventListener("click", () => {
      deleteModalContent.innerHTML = deleteHtml;
      deleteModal.style.display = "block";
      let selected_content = del_btns[i].parentNode.parentNode;
      document.querySelector("#author-delete-id").textContent = selected_content.querySelector(".id").innerHTML;;
      document.querySelector("#author-delete-name").textContent = selected_content.querySelector(".name").innerHTML;
      document.querySelector("#author-delete-email").textContent = selected_content.querySelector(".email").innerHTML;

      const btnConfirmDelete = document.querySelector("#del-confirm");
      btnConfirmDelete.addEventListener("click", (e) => {
        e.preventDefault();
        var $id = $('#author-delete-id').html();
        $.ajax({
          url: '../controller/admin/author.controller.php',
          type: 'post',
          dataType: 'html',
          data: {
            function: 'delete',
            id: $id
          }
        }).done(function (result) {

          loadItem(); 
          $("#sqlresult").html(result); 
          deleteModal.style.display = "none";
          deleteModal.classList.remove('show');
        })
      });

    });



    closeEditIcon.addEventListener("click", () => {
      editModal.style.display = "none";
    });
    closeDeleteIcon.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
      if (event.target === editModal) {
        editModal.style.display = "none";
      }
    });

   

    
  };




  closeDeleteIcon.addEventListener("click", () => {
    deleteModal.style.display = "none";
  });
  const btnCancelDelete = document.querySelector("#deleteModal .del-cancel");
  btnCancelDelete.addEventListener("click", () => {
    deleteModal.style.display = "none";

  });

}
