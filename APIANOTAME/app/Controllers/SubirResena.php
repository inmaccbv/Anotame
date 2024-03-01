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

class SubirResena extends ResourceController
{
    protected $modelName = 'App\Models\ReviewsModel';
    protected $format = 'json';
    protected $table = 'reviews';
    protected $primaryKey = 'id_reviews';

    // Controlador para subir una nueva reseña
    public function index()
    {
        try {
            // Registro de la solicitud para depuración
            $request_data = $this->request->getJSON();
            log_message('info', 'Request Data: ' . json_encode($request_data));

            // Obtención de valores de la solicitud
            $calificacion = $request_data->calificacion;
            $comentario = $request_data->comentario;
            $id_cliente = $request_data->id_cliente;
            $id_empresa = $request_data->id_empresa;

            // Validación de datos
            if (!is_numeric($calificacion) && !is_string($calificacion)) {
                return $this->respond([
                    'code' => 422,
                    'authorized' => 'NO',
                    'texto' => 'Error de validación: La calificación debe ser un número o una cadena.',
                    'request_data' => $request_data,
                ]);
            }

            if (!is_string($comentario)) {
                return $this->respond([
                    'code' => 422,
                    'authorized' => 'NO',
                    'texto' => 'Error de validación: El comentario debe ser una cadena.',
                    'request_data' => $request_data,
                ]);
            }

            if (!is_numeric($id_cliente) || !is_numeric($id_empresa)) {
                return $this->respond([
                    'code' => 422,
                    'authorized' => 'NO',
                    'texto' => 'Error de validación: Los IDs deben ser números.',
                    'request_data' => $request_data,
                ]);
            }

            // Datos a insertar en la base de datos
            $data = [
                'calificacion' => $calificacion,
                'comentario' => $comentario,
                'id_cliente' => $id_cliente,
                'id_empresa' => $id_empresa,
            ];

            // Inserción en la base de datos
            $db = \Config\Database::connect();
            $this->model->insert($data);

            // ID de la reseña recién insertada
            $idResena = $db->insertID();

            // Respuesta exitosa
            return $this->respond([
                'code' => 200,
                'authorized' => 'SI',
                'texto' => 'Reseña subida con éxito',
                'idResena' => $idResena,
                'request_data' => $request_data,
            ]);
        } catch (\Exception $e) {
            // Manejo de errores
            return $this->respond([
                'code' => 500,
                'authorized' => 'NO',
                'texto' => 'Error al enviar: ' . $e->getMessage(),
                'request_data' => $request_data,
            ]);
        }
    }

    // Controlador para agregar respuesta a una reseña
    public function agregarRespuesta()
    {
        try {
            // Información de la solicitud
            $request_data = $this->request->getJSON();
            log_message('info', 'Request Data: ' . json_encode($request_data));

            // Validación de datos
            $id_reviews = $request_data->id_reviews;
            $respuesta = $request_data->respuesta;

            if (!is_numeric($id_reviews) || !is_string($respuesta)) {
                return $this->respond([
                    'code' => 422,
                    'authorized' => 'NO',
                    'texto' => 'Error de validación: Los datos proporcionados no son válidos.',
                    'request_data' => $request_data,
                ]);
            }

            // Actualización de la reseña con la respuesta
            $data = ['respuesta' => $respuesta];
            $this->model->set($data)->update($id_reviews);

            // Respuesta exitosa
            return $this->respond([
                'code' => 200,
                'authorized' => 'SI',
                'texto' => 'Respuesta agregada con éxito.',
                'request_data' => $request_data,
            ]);
        } catch (\Exception $e) {
            // Manejo de errores
            return $this->respond([
                'code' => 500,
                'authorized' => 'NO',
                'texto' => 'Error al agregar respuesta: ' . $e->getMessage(),
                'request_data' => $request_data,
            ]);
        }
    }

    // Controlador para obtener reseñas por ID de empresa
    public function getResenasPorEmpresa()
    {
        // Obtener el id_empresa de la solicitud
        $id_empresa = $this->request->getGet('id_empresa');

        // Validar que se proporcionó el id_empresa
        if (empty($id_empresa)) {
            return $this->respond([
                'code' => 400,
                'data' => null,
                'authorized' => 'NO',
                'texto' => 'Error: Se requiere el ID de la empresa.',
            ]);
        }

        // Consulta en la base de datos para obtener reseñas relacionadas con la empresa
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM reviews WHERE id_empresa = ?", [$id_empresa]);

        // Respuesta en formato JSON
        return $this->respond([
            'code' => 200,
            'data' => $query->getResult(),
            'authorized' => 'SI',
            'texto' => 'Reseñas obtenidas con éxito.',
        ]);
    }

    // Controlador para obtener todas las reseñas
    public function getReviews()
    {
        $db = \Config\Database::connect();
        $query = $db->query('SELECT * FROM reviews');
        return $this->respond($query->getResult());
    }

    // Controlador para obtener todas las reseñas (para el admin)
    public function obtenerResenas()
    {
        $db = \Config\Database::connect();
        $query = $db->query('SELECT * FROM reviews');
        return $this->respond($query->getResult());
    }

    // Controlador para obtener detalles del cliente junto con las reseñas
    public function obtenerDetallesCliente()
    {
        $db = \Config\Database::connect();

        // Modificación de la consulta para incluir un JOIN con la tabla de clientes
        $query = $db->query("SELECT reviews.*, clientes.nombre as nombre_cliente 
                             FROM reviews 
                             JOIN clientes ON reviews.id_cliente = clientes.id_cliente");

        return $this->respond($query->getResult());
    }
}
