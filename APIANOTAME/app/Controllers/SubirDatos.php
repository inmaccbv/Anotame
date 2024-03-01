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

class SubirDatos extends ResourceController
{
    protected $modelName  = 'App\Models\DatosModel';
    protected $format     = 'json';
    protected $table      = 'datos';
    protected $primaryKey = 'id_datos';

    public function index()
    {
        // Obtener los datos del cuerpo de la solicitud en lugar de $_POST
        $data = $this->request->getJSON(true);
    
        // Validar que se proporcionaron los datos necesarios
        if (empty($data['nomLocal']) || empty($data['direccion']) || empty($data['telf1']) || empty($data['telf2']) || empty($data['id_user']) || empty($data['id_empresa'])) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Se requieren datos válidos.',
            ]);
        }
    
        try {
            // Verificar si ya existe un registro con el mismo id_empresa
            $existingData = $this->model
                ->where('id_empresa', $data['id_empresa'])
                ->first();
    
            if ($existingData) {
                // Si existe, actualiza los datos existentes en lugar de insertar nuevos
                $this->model->update($existingData['id_datos'], $data);
    
                return $this->respond([
                    'code'       => 200,
                    'data'       => $data,
                    'idUsuario'  => $existingData['id_datos'],
                    'authorized' => 'SI',
                    'texto'      => 'Datos actualizados con éxito',
                ]);
            } else {
                // Si no existe, intenta realizar la inserción
                if ($this->model->insert($data)) {
                    // Obtener el ID de inserción
                    $id_datos = $this->model->insertID();
    
                    return $this->respond([
                        'code'       => 200,
                        'data'       => $data,
                        'idUsuario'  => $id_datos,
                        'authorized' => 'SI',
                        'texto'      => 'Datos subidos con éxito',
                    ]);
                } else {
                    // La inserción falló, devuelve un error
                    return $this->respond([
                        'code'       => 500,
                        'data'       => $data,
                        'authorized' => 'NO',
                        'texto'      => 'Error al enviar, los datos ya existen.',
                    ]);
                }
            }
        } catch (\Exception $e) {
            log_message('error', 'Error en index: ' . $e->getMessage());
            return $this->respond([
                'code'       => 500,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error interno del servidor: ' . $e->getMessage(),
            ]);
        }
    }
    

    public function borrarDatos()
    {
        $db5 = \Config\Database::connect();
        $builder = $db5->table('datos');
    
        // Obtiene el id para poder eliminarlo
        $id_datos = filter_var($this->request->getPost('id_datos'), FILTER_VALIDATE_INT);

        if ($id_datos === false || $id_datos === null) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: El ID proporcionado no es válido.',
            ]);
        }
    
        // Log de inicio de eliminación
        log_message('debug', 'Intento de eliminar dato con ID: ' . $id_datos);

        try {
            // Actualizar los datos en la base de datos
            $builder->where('id_datos', $id_datos);
            $builder->delete();

            // Log después de intentar eliminar
            log_message('debug', 'Eliminación de dato completada.');

            // Metodo affectedRows() es para comprobar si se eliminó al menos una fila y devuelve una respuesta
            if ($db5->affectedRows() > 0) {
                return $this->respond([
                    'code'       => 200,
                    'data'       => $id_datos,
                    'authorized' => 'SI',
                    'texto'      => 'Dato eliminado correctamente'
                ]);
            } else {
                // Log si no se eliminó nada
                log_message('error', 'No se ha podido eliminar el dato.');

                return $this->respond([
                    'code'       => 500,
                    'data'       => $id_datos,
                    'authorized' => 'NO',
                    'texto'      => 'No se ha podido eliminar el dato'
                ]);
            }
        } catch (\Exception $e) {
            log_message('error', 'Error en borrarDatos: ' . $e->getMessage());
            return $this->respond([
                'code'       => 500,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error interno del servidor: ' . $e->getMessage(),
            ]);
        }
    }    

    


    public function obtenerDatosByEmpresa()
    {
        // Obtener el id_empresa de la URL
        $id_empresa = $this->request->getGet('id_empresa');
    
        // Validar que se proporcionó el id_empresa
        if (empty($id_empresa)) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Se requiere el ID de la empresa.',
            ]);
        }
    
        // Puedes realizar la consulta en la base de datos para obtener los datos relacionados con la empresa
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM datos WHERE id_empresa = ?", [$id_empresa]);
    
        // Devolver la respuesta en formato JSON
        return $this->respond([
            'code'       => 200,
            'data'       => $query->getResult(),
            'authorized' => 'SI',
            'texto'      => 'Datos obtenidos con éxito.',
        ]);
    }
    

}
