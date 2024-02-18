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

class Horarios extends ResourceController
{
    protected $modelName  = 'App\Models\HorarioModel';
    protected $format     = 'json';
    protected $table      = 'horarios';
    protected $primaryKey = 'id_horario';

    public function index()
    {
        $horarioModel = new \App\Models\HorarioModel();

        $data = [
            'dia'           => $this->request->getPost('dia'),
            'hora_apertura' => $this->request->getPost('horaApertura'),
            'hora_cierre'   => $this->request->getPost('horaCierre'),
        ];

        $dia = $data['dia'];

        // Verifica si el día ya tiene horario registrado
        $existingHorario = $horarioModel->where('dia', $dia)->first();

        if (empty($existingHorario)) {
            // El día no tiene horario registrado, procede con la inserción
            $horarioModel->insert($data);
            $idHorario = $horarioModel->insertID(); // Obtener el ID del horario recién registrado

            return $this->respond([
                'code'       => 200,
                'data'       => $data,
                'idHorario'  => $idHorario,
                'mensaje'    => 'Horario registrado con éxito',
            ]);
        } else {
            // El día ya tiene horario registrado, devuelve un error
            return $this->respond([
                'code'       => 500,
                'data'       => $existingHorario,
                'mensaje'    => 'Ya existe un horario para este día',
            ]);
        }
    }
}
