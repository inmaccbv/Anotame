<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Allow: GET, POST, OPTIONS, PUT, DELETE');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'OPTIONS') {
    die();
}

class Provincias extends ResourceController {
   protected $modelName  = 'App\Models\ProvinciasModel';
   protected $format     = 'json';
   protected $table      = 'provincias';
   protected $primaryKey = 'id_provincia';


    public function getProvincias() {
        $db = \config\Database::connect();

        $query = $db->query("SELECT * FROM provincias");

        return $this->respond($query->getResult());
    }
}