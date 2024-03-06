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

class SubirTexto extends ResourceController
{
    protected $modelName  = 'App\Models\TextoModel'; 
    protected $format     = 'json'; 
    protected $table      = 'texto';
    protected $primaryKey = 'id_texto';

    public function index()
    {
        // Obtengo los datos del cuerpo de la solicitud en formato JSON
        $data = $this->request->getJSON(true);

        // Validación de datos necesarios, como nomLocal, texto, id_user e id_empresa
        if (empty($data['nomLocal']) || empty($data['texto']) || empty($data['id_user']) || empty($data['id_empresa'])) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Se requieren datos válidos.',
            ]);
        }

        // Verifico si ya existe un texto para la misma empresa
        $existingText = $this->model
            ->where('id_empresa', $data['id_empresa'])
            ->first();

        if ($existingText) {
            // Si existe, actualizo el texto existente en lugar de insertar uno nuevo
            $this->model->update($existingText['id_texto'], $data);

            return $this->respond([
                'code'       => 200,
                'data'       => $data,
                'id_texto'  => $existingText['id_texto'],
                'authorized' => 'SI',
                'texto'      => 'Texto actualizado con éxito',
            ]);
        } else {
            // Si no existe, intento realizar la inserción
            if ($this->model->insert($data)) {
                // Obtengo el ID de inserción
                $id_texto = $this->model->insertID();

                return $this->respond([
                    'code'       => 200,
                    'data'       => $data,
                    'id_texto'  => $id_texto,
                    'authorized' => 'SI',
                    'texto'      => 'Texto subido con éxito',
                ]);
            } else {
                // Si la inserción falla, devuelvo un error
                return $this->respond([
                    'code'       => 500,
                    'data'       => $data,
                    'authorized' => 'NO',
                    'texto'      => 'Error al enviar, el texto ya existe.',
                ]);
            }
        }
    }

    // Método para obtener textos por empresa
    public function getTextosByEmpresa()
    {
        // Obtengo el id_empresa de la solicitud
        $id_empresa = $this->request->getGet('id_empresa'); // Cambio a getGet

        // Validación de que se proporcionó el id_empresa
        if (empty($id_empresa)) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Se requiere el ID de la empresa.',
            ]);
        }

        // Consulta en la base de datos para obtener textos relacionados con la empresa
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM texto WHERE id_empresa = ?", [$id_empresa]);

        // Devuelvo la respuesta en formato JSON
        return $this->respond([
            'code'       => 200,
            'data'       => $query->getResult(),
            'authorized' => 'SI',
            'texto'      => 'Textos obtenidos con éxito.',
        ]);
    }
}
