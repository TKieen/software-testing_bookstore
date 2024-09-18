<?php
include_once('../../model/connect.php');
include_once('../../model/admin/supplier.model.php');
if (isset($_POST['function'])) {
  $function = $_POST['function'];
  switch ($function) {
    case 'delete':
      deleteSupplier();
      break;
    case 'create':
      createSupplier();
      break;
    case 'edit':
      editSupplier();
      break;
  }
}
function deleteSupplier()
{
  if (isset($_POST['id'])) {
    $id = $_POST['id'];
    $delete_result = supplier_delete($id);
    echo $delete_result;
  }
}
function createSupplier()
{
  if (isset($_POST['field'])) {
    echo supplier_create($_POST['field']);
  }
}
function editSupplier()
{
  if (isset($_POST['field'])) {
    echo supplier_edit($_POST['field']);
  }
}
