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

    public function addReserva()
    {
        // Conexión a la base de datos
        $db = \Config\Database::connect();
        $builder = $db->table('reservas');

        // Obtención de la fecha y hora actual
        $fechaCreacionActual = date('Y-m-d H:i:s');

        // Conversión de la fechaHoraReserva a formato adecuado
        $fechaHoraReserva = date('Y-m-d H:i:s', strtotime($this->request->getPost('fechaHoraReserva')));

        // Obtención del ID del cliente
        $id_cliente = $this->getIdCliente($this->request->getPost('nombre'));

        // Verificación de existencia del cliente
        if ($id_cliente === null) {
            return $this->respond(['error' => 'Cliente no encontrado'], 404);
        }

        // Construcción del array de datos
        $data = [
            'numPax'            => $this->request->getPost('numPax'),
            'fechaHoraReserva'  => $fechaHoraReserva,
            'notasEspeciales'   => $this->request->getPost('notasEspeciales'),
            'estadoReserva'     => $this->request->getPost('estadoReserva'),
            'fechaCreacion'     => $fechaCreacionActual,
            'id_cliente'        => $id_cliente,
        ];

        // Obtención del modelo
        $reservasModel = new ReservasModel(); // o puedes cargarlo mediante inyección de dependencias

        // Inserción de datos en la base de datos
        $reservasModel->insert($data);
        $id_reserva = $db->insertID();

        // Respuesta exitosa
        return $this->respond([
            'code'       => 200,
            'data'       => $data,
            'id_reserva'  => $id_reserva,
            'authorized' => 'SI',
            'texto'      => 'Reserva realizada con éxito',
        ]);
    }

    public function getIdCliente()
    {
        $db4 = \Config\Database::connect();
        $query = $db4->query("SELECT * FROM clientes");
        return $this->respond($query->getResult());
    }

    public function verificarCliente()
    {
        $termino = $this->request->getGet('termino');

        if ($termino) {
            $db4 = \Config\Database::connect();
            $query = $db4->query("SELECT id_cliente, nombre, email, telf FROM clientes WHERE nombre LIKE '%$termino%' OR email LIKE '%$termino%' OR telf LIKE '%$termino%';");
        } else {
            $db4 = \Config\Database::connect();
            $query = $db4->query("SELECT * FROM clientes");
        }

        return $this->respond($query->getResult());
    }

    public function getReservasPorCliente()
    {
        $nombre = $this->request->getGet('nombre');
        $id_cliente = $this->getIdClienteFromDatabase($nombre);

        if ($id_cliente === null) {
            return $this->respond(['error' => 'Cliente no encontrado'], 404);
        }

        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM reservas WHERE id_cliente = $id_cliente");
        $reservas = $query->getResult();

        return $this->respond(['reservas' => $reservas]);
    }

    public function getIdClienteFromDatabase($nombre)
    {
        $db = \Config\Database::connect();
        $nombre = $db->escape($nombre);
        $query = $db->query("SELECT id_cliente FROM clientes WHERE nombre = $nombre");

        $result = $query->getResult();

        if (!empty($result)) {
            return $result[0]->id_cliente;
        } else {
            return null;
        }
    }

    public function getReservas()
    {
        $db4 = \Config\Database::connect();
        $query = $db4->query("SELECT * FROM reservas");
        return $this->respond($query->getResult());
    }
}
