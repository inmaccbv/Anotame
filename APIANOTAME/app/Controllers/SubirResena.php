<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

// No es necesario repetir estas líneas en cada controlador. Considera un middleware o configuración global.
header('Access-Control-Allow-Origin: *');
header(
    'Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method'
);
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Allow: GET, POST, OPTIONS, PUT, DELETE');

$method = $_SERVER['REQUEST_METHOD'];

// Si es una solicitud OPTIONS, simplemente muere sin ejecutar nada más
if ($method == 'OPTIONS') {
    die();
}

class SubirResena extends ResourceController
{
    protected $modelName = 'App\Models\ReviewsModel';
    protected $format = 'json';
    protected $table = 'reviews';
    protected $primaryKey = 'id_reviews';

    public function index()
    {
        try {
            // Log de la solicitud para ver qué datos se están recibiendo
            $request_data = $this->request->getJSON();
            log_message('info', 'Request Data: ' . json_encode($request_data));

            // Obtener los valores correctamente
            $calificacion = $request_data->calificacion;
            $comentario = $request_data->comentario;
            $id_cliente = $request_data->id_cliente;

            // Verificar si la calificación es numérica o cadena
            if (!is_numeric($calificacion) && !is_string($calificacion)) {
                return $this->respond([
                    'code' => 422,
                    'authorized' => 'NO',
                    'texto' =>
                        'Error de validación: La calificación debe ser un número o una cadena.',
                    'request_data' => $request_data,
                ]);
            }

            // Verificar si el comentario es una cadena
            if (!is_string($comentario)) {
                return $this->respond([
                    'code' => 422,
                    'authorized' => 'NO',
                    'texto' =>
                        'Error de validación: El comentario debe ser una cadena.',
                    'request_data' => $request_data,
                ]);
            }

            // Verificar si el id_user es numérico
            if (!is_numeric($id_cliente)) {
                return $this->respond([
                    'code' => 422,
                    'authorized' => 'NO',
                    'texto' =>
                        'Error de validación: El id_cliente debe ser un número.',
                    'request_data' => $request_data,
                ]);
            }

            $data = [
                'calificacion' => $calificacion,
                'comentario' => $comentario,
                'id_cliente' => $id_cliente,
            ];

            // Insertar los datos en la base de datos
            $db = \Config\Database::connect();
            $this->model->insert($data);

            // Obtener el ID de la reseña recién insertada
            $idResena = $db->insertID();

            // Devolver una respuesta exitosa
            return $this->respond([
                'code' => 200,
                'authorized' => 'SI',
                'texto' => 'Reseña subida con éxito',
                'idResena' => $idResena, // Envía el ID de la reseña al cliente
                'request_data' => $request_data,
            ]);
        } catch (\Exception $e) {
            return $this->respond([
                'code' => 500,
                'authorized' => 'NO',
                'texto' => 'Error al enviar: ' . $e->getMessage(),
                'request_data' => $request_data,
            ]);
        }
    }

    public function obtenerResenas()
    {
        $db4 = \Config\Database::connect();

        $query = $db4->query('SELECT * FROM reviews');

        return $this->respond($query->getResult());
    }

    public function obtenerDetallesCliente()
    {
        $db = \Config\Database::connect();
    
        // Modifica la consulta para incluir un JOIN con la tabla de clientes
        $query = $db->query("SELECT reviews.*, clientes.nombre as nombre_cliente 
                             FROM reviews 
                             JOIN clientes ON reviews.id_cliente = clientes.id_cliente");
    
        return $this->respond($query->getResult());
    }
    
}
