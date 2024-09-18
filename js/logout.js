$(document).ready(function () {
  $(".btnDangXuat").click(function () {
    $.ajax({
      type: "post",
      url: "controller/logout.controller.php",
      dataType: "html",
      data: {
        logoutRequest: true,
      },
    }).done(function (result) {
      window.location.href = "index.php?page=signup";
      alert("Bạn đã đăng xuất thành công!");
    });
  });
});
