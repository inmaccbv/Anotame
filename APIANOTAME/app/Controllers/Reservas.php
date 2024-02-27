<?php

namespace App\Controllers;

use App\Models\ReservasModel;
use CodeIgniter\RESTful\ResourceController;

// Configuración para permitir CORS
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

    // Método para procesar la solicitud de creación de reserva
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

            // Extracción de datos de la solicitud
            $fechaHoraReserva = $request_data->fechaHoraReserva;
            $fechaCreacion = $request_data->fechaCreacion;
            $numPax = $request_data->numPax;
            $notasEspeciales = $request_data->notasEspeciales;
            $estadoReserva = $request_data->estadoReserva;
            $id_cliente = $request_data->id_cliente;
            $id_empresa = $request_data->id_empresa;


            $data = [
                'fechaHoraReserva' => $fechaHoraReserva,
                'fechaCreacion' => $fechaCreacion,
                'numPax' => $numPax,
                'notasEspeciales' => $notasEspeciales,
                'estadoReserva' => $estadoReserva,
                'id_cliente' => $id_cliente,
                'id_empresa' => $id_empresa,
            ];

            // Insertar los datos en la base de datos
            $db = \Config\Database::connect();
            $this->model->insert($data);

            // Obtener el ID de la reserva recién insertada
            $idReserva = $db->insertID();

            // Respuesta exitosa
            return $this->respond([
                'code' => 200,
                'authorized' => 'SI',
                'texto' => 'Reserva realizada con éxito',
                'idReserva' => $idReserva,
                'datos_solicitud' => $request_data,
            ]);
        } catch (\Exception $e) {
            // Respuesta en caso de error
            return $this->respond([
                'code' => 500,
                'authorized' => 'NO',
                'texto' => 'Error al realizar la reserva: ' . $e->getMessage(),
                'datos_solicitud' => $request_data,
            ]);
        }
    }

    public function getReservasPorEmpresa()
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
        $query = $db->query("SELECT * FROM reservas WHERE id_empresa = ?", [$id_empresa]);
    
        // Devolver la respuesta en formato JSON
        return $this->respond([
            'code'       => 200,
            'data'       => $query->getResult(),
            'authorized' => 'SI',
            'texto'      => 'Textos obtenidos con éxito.',
        ]);
    }

    // Método para editar el estado de una reserva
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

            // Respuesta exitosa
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

    // Método para obtener todas las reservas
    public function obtenerReservas()
    {
        $db = \Config\Database::connect();

        $query = $db->query('SELECT * FROM reservas');

        return $this->respond($query->getResult());
    }

    // Método para obtener detalles de todas las reservas con información de clientes
    public function obtenerDetallesReserva()
    {
        $db = \Config\Database::connect();

        // Ajusta la consulta según cómo quieras relacionar los detalles de las reservas con los clientes u otras tablas
        $query = $db->query("SELECT reservas.*, clientes.nombre as nombre_cliente 
                             FROM reservas 
                             JOIN clientes ON reservas.id_cliente = clientes.id_cliente");

        return $this->respond($query->getResult());
    }

    // Método para obtener todos los clientes
    public function getIdCliente()
    {
        $db4 = \Config\Database::connect();
        $query = $db4->query('SELECT * FROM clientes');
        return $this->respond($query->getResult());
    }

    // Método para obtener todas las reservas nuevamente (repetición, probable error)
    public function getReservas()
    {
        $db4 = \Config\Database::connect();
        $query = $db4->query('SELECT * FROM reservas');
        return $this->respond($query->getResult());
    }

    // Método para borrar una reserva
    public function borrarReserva()
    {
        $db5 = \Config\Database::connect();

        $builder = $db5->table('reservas');

        $id_reserva = $this->request->getPost('id_reserva');

        // Actualizar los datos en la base de datos
        $builder->where('id_reserva', $id_reserva);
        $builder->delete();

        // Método affectedRows() es para comprobar si se eliminó al menos una fila y devuelve una respuesta
        if ($db5->affectedRows() > 0) {
            return $this->respond([
                'code'       => 200,
                'data'       => $id_reserva,
                'authorized' => 'SI',
                'texto'      => 'Reserva eliminada correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => $id_reserva,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido eliminar la reserva'
            ]);
        }
    }
}
