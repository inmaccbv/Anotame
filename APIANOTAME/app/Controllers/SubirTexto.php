<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Allow: GET, POST, OPTIONS, PUT, DELETE');

$method = $_SERVER['REQUEST_METHOD'];

// Si es una solicitud OPTIONS, simplemente muere sin ejecutar nada más
if ($method == 'OPTIONS') {
    die();
}

class SubirTexto extends ResourceController
{
    protected $modelName  = 'App\Models\TextoModel';
    protected $format     = 'json';
    protected $table      = 'texto';
    protected $primaryKey = 'id_texto';

    public function index()
    {
        // Obtener los datos del cuerpo de la solicitud en lugar de $_POST
        $data = $this->request->getJSON(true);

        // Validar que se proporcionaron los datos necesarios
        if (empty($data['nomLocal']) || empty($data['texto'])) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Se requieren datos válidos.',
            ]);
        }

        // Agregar otros campos necesarios aquí

        // Intentar realizar la inserción
        if ($this->model->insert($data)) {
            // Obtener el ID de inserción
            $id_texto = $this->model->insertID();

            return $this->respond([
                'code'       => 200,
                'data'       => $data,
                'idUsuario'  => $id_texto,
                'authorized' => 'SI',
                'texto'      => 'Texto subido con éxito',
            ]);
        } else {
            // La inserción falló, devuelve un error
            return $this->respond([
                'code'       => 500,
                'data'       => $data,
                'authorized' => 'NO',
                'texto'      => 'Error al enviar, el texto ya existe.',
            ]);
        }
    }
}
