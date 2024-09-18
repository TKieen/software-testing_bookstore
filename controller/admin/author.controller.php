<?php
include_once('../../model/connect.php');
include_once('../../model/admin/author.model.php');
if (isset($_POST['function'])) {
  $function = $_POST['function'];
  switch ($function) {
    case 'delete':
      deleteAU();
      break;
    case 'create':
      create();
      break;
    case 'edit':
      edit();
      break;
  }
}
function deleteAU()
{
  if (isset($_POST['id'])) {
    $id = $_POST['id'];
    $delete_result = author_delete($id);
    echo $delete_result;
  }
}
function create()
{
  if (isset($_POST['field'])) {
    echo author_create($_POST['field']);
  }
}
function edit()
{
  if (isset($_POST['field'])) {
    echo author_edit($_POST['field']);
  }
} 


