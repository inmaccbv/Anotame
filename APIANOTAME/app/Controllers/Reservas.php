<?php

namespace App\Controllers;

use App\Models\ReservasModel;
use CodeIgniter\RESTful\ResourceController;

header('Access-Control-Allow-Origin: *');
header(
    'Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method'
);
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Allow: GET, POST, OPTIONS, PUT, DELETE');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'OPTIONS') {
    die();
}

class Reservas extends ResourceController
{
    protected $modelName = 'App\Models\ReservasModel';
    protected $format = 'json';
    protected $table = 'reservas';
    protected $primaryKey = 'id_reserva';

    public function index()
    {
        try {
            // Log de la solicitud para ver qué datos se están recibiendo
            $request_data = $this->request->getJSON();
            log_message(
                'info',
                'Datos de la solicitud de reserva: ' .
                    json_encode($request_data)
            );

            // Aquí asumo que la reserva tiene un formato similar con campos como fechaHoraReserva, numPax, etc.
            $fechaHoraReserva = $request_data->fechaHoraReserva;
            $fechaCreacion = $request_data->fechaCreacion;
            $numPax = $request_data->numPax;
            $notasEspeciales = $request_data->notasEspeciales;
            $estadoReserva = $request_data->estadoReserva;
            $id_cliente = $request_data->id_cliente;

            // Aquí puedes agregar las validaciones que consideres necesarias, similar a cómo se hizo en el controlador de reseñas

            $data = [
                'fechaHoraReserva' => $fechaHoraReserva,
                'fechaCreacion' => $fechaCreacion,
                'numPax' => $numPax,
                'notasEspeciales' => $notasEspeciales,
                'estadoReserva' => $estadoReserva,
                'id_cliente' => $id_cliente,
            ];

            // Insertar los datos en la base de datos
            $db = \Config\Database::connect();
            $this->model->insert($data);

            // Obtener el ID de la reserva recién insertada
            $idReserva = $db->insertID();

            // Devolver una respuesta exitosa
            return $this->respond([
                'code' => 200,
                'authorized' => 'SI',
                'texto' => 'Reserva realizada con éxito',
                'idReserva' => $idReserva,
                'datos_solicitud' => $request_data,
            ]);
        } catch (\Exception $e) {
            return $this->respond([
                'code' => 500,
                'authorized' => 'NO',
                'texto' => 'Error al realizar la reserva: ' . $e->getMessage(),
                'datos_solicitud' => $request_data,
            ]);
        }
    }

    public function editarEstadoReserva()
    {
        try {
            // Obtener el cuerpo de la solicitud y decodificarlo como un array asociativo
            $request_data = json_decode(file_get_contents('php://input'), true);
    
            // Obtener el ID de la reserva y el nuevo estado desde el array asociativo
            $id_reserva = $request_data['id_reserva'];
            $nuevoEstado = $request_data['estadoReserva'];
    
            // Log de la solicitud para editar el estado de la reserva
            log_message('info', 'Datos de la solicitud para editar estado de reserva: ' . json_encode($request_data));
    
            // Actualizar el estado en la base de datos
            $db = \Config\Database::connect();
            $builder = $db->table('reservas');
            $builder->set('estadoReserva', $nuevoEstado);
            $builder->where('id_reserva', $id_reserva);
            $builder->update();
    
            // Agregar log después de actualizar el estado en la base de datos
            log_message('info', 'Estado de reserva actualizado con éxito.');
    
            // Devolver una respuesta exitosa
            return $this->respond([
                'code' => 200,
                'authorized' => 'SI',
                'texto' => 'Estado de reserva actualizado con éxito',
                'idReserva' => $id_reserva,
                'nuevoEstado' => $nuevoEstado,
            ]);
        } catch (\Exception $e) {
            // Agregar log en caso de error
            log_message('error', 'Error al actualizar el estado de la reserva: ' . $e->getMessage());
    
            return $this->respond([
                'code' => 500,
                'authorized' => 'NO',
                'texto' => 'Error al actualizar el estado de la reserva: ' . $e->getMessage(),
            ]);
        }
    }
    

    public function obtenerReservas()
    {
        $db = \Config\Database::connect();

        $query = $db->query('SELECT * FROM reservas');

        return $this->respond($query->getResult());
    }

    public function obtenerDetallesReserva()
    {
        $db = \Config\Database::connect();

        // Aquí deberías ajustar la consulta según cómo quieras relacionar los detalles de las reservas, por ejemplo, con los clientes o cualquier otra tabla relevante
        $query = $db->query("SELECT reservas.*, clientes.nombre as nombre_cliente 
                             FROM reservas 
                             JOIN clientes ON reservas.id_cliente = clientes.id_cliente");

        return $this->respond($query->getResult());
    }

    public function getIdCliente()
    {
        $db4 = \Config\Database::connect();
        $query = $db4->query('SELECT * FROM clientes');
        return $this->respond($query->getResult());
    }

    public function getReservas()
    {
        $db4 = \Config\Database::connect();
        $query = $db4->query('SELECT * FROM reservas');
        return $this->respond($query->getResult());
    }
}
