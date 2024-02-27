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

        // Validar que se proporcionaron los datos necesarios, incluyendo idUsuario e idEmpresa
        if (empty($data['nomLocal']) || empty($data['texto']) || empty($data['id_user']) || empty($data['id_empresa'])) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Se requieren datos válidos.',
            ]);
        }

        // Agregar otros campos necesarios aquí

        // Puedes acceder a idUsuario e idEmpresa como $data['idUsuario'] y $data['idEmpresa'] respectivamente

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

    public function getTexto()
    {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT * FROM texto");

        return $this->respond($query->getResult());
    }

    public function getTextosByEmpresa()
    {
        // Obtener el id_empresa del cuerpo de la solicitud
        $id_empresa = $this->request->getGet('id_empresa'); // Cambiar a getGet

        // Validar que se proporcionó el id_empresa
        if (empty($id_empresa)) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Se requiere el ID de la empresa.',
            ]);
        }

        // Puedes realizar la consulta en la base de datos para obtener los textos relacionados con la empresa
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM texto WHERE id_empresa = ?", [$id_empresa]);

        // Devolver la respuesta en formato JSON
        return $this->respond([
            'code'       => 200,
            'data'       => $query->getResult(),
            'authorized' => 'SI',
            'texto'      => 'Textos obtenidos con éxito.',
        ]);
    }
}
