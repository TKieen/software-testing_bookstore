<?php
include_once('../../model/connect.php');
include_once('../../model/admin/publisher.model.php');
if (isset($_POST['function'])) {
  $function = $_POST['function'];
  switch ($function) {
    case 'delete':
      deletePublisher();
      break;
    case 'create':
      createPublisher();
      break;
    case 'edit':
      editPublisher();
      break;
  }
}
function deletePublisher()
{
  if (isset($_POST['id'])) {
    $id = $_POST['id'];
    $delete_result = publisher_delete($id);
    echo $delete_result;
  }
}
function createPublisher()
{
  if (isset($_POST['field'])) {
    echo publisher_create($_POST['field']);
  }
}
function editPublisher()
{
  if (isset($_POST['field'])) {
    echo publisher_edit($_POST['field']);
  }
}
