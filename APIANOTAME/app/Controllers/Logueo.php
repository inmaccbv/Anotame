<?php

namespace App\Controllers;

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

class Logueo extends ResourceController
{
    protected $modelName = 'App\Models\LogueoModel';
    protected $format = 'json';
    protected $table = 'usuarios';
    protected $primaryKey = 'id_user';

    public function index()
    {
        $db = \Config\Database::connect();

        $password = hash('sha512', $this->request->getPost('password'));
        // $password = $this->request->getPost('password');
        $rol = $this->request->getPost('rol');


        $data = [
            'email'    => $this->request->getPost('email'),
            'password' => $password,
        ];


        $builder = $db->table('usuarios');
        $builder->select('rol');
        $builder->where($data);
        $query = $builder->get()->getResultArray();

        if (count($query) > 0) {

            return $this->respond([
                'code'       => 200,
                'data'       => $query,
                'authorized' => 'SI',
                'texto'      => 'LOGUEADO CORRECTAMENTE',
            ]);
        } else {

            return $this->respond([
                'code'       => 500,
                'data'       => $query,
                // 'data'       => $password,
                'authorized' => 'NO',
                'texto'      => 'NINGUN USUARIO CON ESOS DATOS',
            ]);
        }
    }

    public function getUserByEmail()
    {
        $email = $this->request->getVar('email');  // Obtener el correo electrónico del cuerpo POST

        $db = \Config\Database::connect();
        $builder = $db->table('usuarios');
        $builder->select('id_user, nombre, apellido, email, rol');
        $builder->where('email', $email);  // Utilizar el correo electrónico en la consulta
        $query = $builder->get()->getRow();

        if ($query) {
            return $this->respond([
                'code'       => 200,
                'data'       => $query,
                'authorized' => 'SI',
                'texto'      => 'Datos del usuario obtenidos correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido obtener los datos del usuario'
            ]);
        }
    }

    public function getEmpleados()
    {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT * FROM usuarios");

        return $this->respond($query->getResult());
    }

    public function getEmpleadosConDatos()
    {
        $db = \Config\Database::connect();

        $query = $db->query("SELECT usuarios.*, empresas.nombre AS empresa, provincias.provincia AS provincia
                            FROM usuarios
                            LEFT JOIN empresas ON usuarios.id_empresa = empresas.id
                            LEFT JOIN provincias ON usuarios.id_provincia = provincias.id");

        return $this->respond($query->getResult());
    }

    public function borrarEmpleado()
    {

        $db5 = \Config\Database::connect();

        $builder = $db5->table('usuarios');

        // Obtiene el id para poder eliminarlo
        $id_user = $this->request->getPost('id_user');

        // Actualizar los datos en la base de datos
        $builder->where('id_user', $id_user);
        $builder->delete();

        // Metodo affectedRows() es para comprobar si se elimino al menos una fila y devuelve una respuesta
        if ($db5->affectedRows() > 0) {
            return $this->respond([
                'code'       => 200,
                'data'       => $id_user,
                'authorized' => 'SI',
                'texto'      => 'Empleado eliminado correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => $id_user,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido eliminar al empleado'
            ]);
        }
    }
}
