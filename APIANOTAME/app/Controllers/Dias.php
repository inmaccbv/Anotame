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

class Dias extends ResourceController {
   protected $modelName  = 'App\Models\DiasModel';
   protected $format     = 'json';
   protected $table      = 'dias';
   protected $primaryKey = 'dia';


    public function getDias() {
        $db = \config\Database::connect();

        $query = $db->query("SELECT * FROM dias");

        return $this->respond($query->getResult());
    }
}

