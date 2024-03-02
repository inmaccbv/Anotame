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
        try {
            // Registro de la solicitud para depuración
            $request_data = $this->request->getJSON();
            log_message('info', 'Request Data: ' . json_encode($request_data));

            // Obtención de valores de la solicitud
            $dia = $request_data->dia;
            $hora_apertura = $request_data->horaApertura;
            $hora_cierre = $request_data->horaCierre;
            $id_user = $request_data->id_user;
            $id_empresa = $request_data->id_empresa;

            // Validación de datos
            if (!is_string($dia) || !is_string($hora_apertura) || !is_string($hora_cierre) || !is_numeric($id_user) || !is_numeric($id_empresa)) {
                return $this->respond([
                    'code' => 422,
                    'authorized' => 'NO',
                    'texto' => 'Error de validación: Verifique los tipos de datos proporcionados.',
                    'request_data' => $request_data,
                ]);
            }

            // Datos a insertar o actualizar en la base de datos
            $data = [
                'dia' => $dia,
                'hora_apertura' => $hora_apertura,
                'hora_cierre' => $hora_cierre,
                'id_user' => $id_user,
                'id_empresa' => $id_empresa,
            ];

            // Verificar si el día proporcionado no es nulo
            if ($dia !== null) {
                // Verificar si ya existe un horario para este día y empresa
                $existingHorario = $this->model
                    ->where('dia', $dia)
                    ->where('id_empresa', $id_empresa)
                    ->first();

                if (!empty($existingHorario)) {
                    // Si existe, actualiza el horario existente en lugar de insertar uno nuevo
                    $this->model->update($existingHorario['id_horario'], $data);

                    // Respuesta exitosa
                    return $this->respond([
                        'code' => 200,
                        'authorized' => 'SI',
                        'data' => $data,
                        'idHorario' => $existingHorario['id_horario'],
                        'mensaje' => 'Horario actualizado con éxito',
                    ]);
                } else {
                    // Si no existe, procede con la inserción
                    $this->model->insert($data);
                    $idHorario = $this->model->insertID();

                    // Respuesta exitosa
                    return $this->respond([
                        'code' => 200,
                        'authorized' => 'SI',
                        'data' => $data,
                        'idHorario' => $idHorario,
                        'mensaje' => 'Horario registrado con éxito',
                    ]);
                }
            } else {
                // El valor de 'dia' es nulo, devuelve un error
                return $this->respond([
                    'code' => 500,
                    'authorized' => 'NO',
                    'mensaje' => 'El valor del día es nulo',
                ]);
            }
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

    public function obtenerHorasByEmpresa()
    {
        try {
            $request_data = $this->request->getGet();
            log_message('info', 'Request Data: ' . json_encode($request_data));
    
            $id_empresa = $request_data['id_empresa'];
    
            // Validar datos
            if (!is_numeric($id_empresa)) {
                return $this->respond([
                    'code' => 422,
                    'authorized' => 'NO',
                    'texto' => 'Error de validación: Verifique los tipos de datos proporcionados.',
                    'request_data' => $request_data,
                ]);
            }
    
            // Obtener horarios asociados a la empresa
            $horarios = $this->model->where('id_empresa', $id_empresa)->findAll();
    
            return $this->respond([
                'code' => 200,
                'authorized' => 'SI',
                'data' => $horarios,
                'mensaje' => 'Horarios obtenidos con éxito',
            ]);
        } catch (\Exception $e) {
            // Manejo de errores
            return $this->respond([
                'code' => 500,
                'authorized' => 'NO',
                'texto' => 'Error al obtener horarios: ' . $e->getMessage(),
                'request_data' => $request_data,
            ]);
        }
    }
    

    public function getHorarios()
    {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT * FROM horarios");

        return $this->respond($query->getResult());
    }

    public function borrarHorario()
    {

        $db5 = \Config\Database::connect();

        $builder = $db5->table('horarios');

        $id_horario = $this->request->getPost('id_horario');

        // Actualizar los datos en la base de datos
        $builder->where('id_horario', $id_horario);
        $builder->delete();

        // Metodo affectedRows() es para comprobar si se elimino al menos una fila y devuelve una respuesta
        if ($db5->affectedRows() > 0) {
            return $this->respond([
                'code'       => 200,
                'data'       => $id_horario,
                'authorized' => 'SI',
                'texto'      => 'Horario eliminado correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => $id_horario,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido eliminar el horario'
            ]);
        }
    }
}
