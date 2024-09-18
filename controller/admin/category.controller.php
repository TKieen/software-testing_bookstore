<?php
include_once('../../model/connect.php');
include_once('../../model/admin/category.model.php');
if (isset($_POST['function'])) {
  $function = $_POST['function'];
  switch ($function) {
    case 'delete':
      deleteCategory();
      break;
    case 'create':
      createCategory();
      break;
    case 'edit':
      editCategory();
      break;
  }
}
function deleteCategory()
{
  if (isset($_POST['id'])) {
    $id = $_POST['id'];
    $delete_result = category_delete($id);
    echo $delete_result;
  }
}
function createCategory()
{
  if (isset($_POST['field'])) {
    echo category_create($_POST['field']);
  }
}
function editCategory()
{
  if (isset($_POST['field'])) {
    echo category_edit($_POST['field']);
  }
}
