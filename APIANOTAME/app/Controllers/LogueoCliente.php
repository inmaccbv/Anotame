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

class LogueoCliente extends ResourceController
{
    protected $modelName = 'App\Models\ClienteModel';
    protected $format = 'json';
    protected $table = 'clientes';
    protected $primaryKey = 'id_cliente';

    public function index()
    {
        $db = \Config\Database::connect();

        $password = hash('sha512', $this->request->getPost('password'));
        $rol = $this->request->getPost('rol');

        $data = [
            'email'    => $this->request->getPost('email'),
            'password' => $password,
        ];

        $builder = $db->table('clientes');
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
        $builder = $db->table('clientes');
        $builder->select('id_cliente, nombre, apellido, email, rol');
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

    public function getUserAndEmpresaByEmail()
    {
        $email = $this->request->getVar('email');  // Obtener el correo electrónico del cuerpo POST

        $db = \Config\Database::connect();
        $builder = $db->table('clientes');
        $builder->select('id_cliente, nombre, apellido, email, rol, id_empresa');
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

    public function getClientes()
    {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT * FROM clientes");

        return $this->respond($query->getResult());
    }

    public function borrarCliente()
    {

        $db5 = \Config\Database::connect();

        $builder = $db5->table('clientes');

        $id_cliente = $this->request->getPost('id_cliente');

        // Actualizar los datos en la base de datos
        $builder->where('id_cliente', $id_cliente);
        $builder->delete();

        // Metodo affectedRows() es para comprobar si se elimino al menos una fila y devuelve una respuesta
        if ($db5->affectedRows() > 0) {
            return $this->respond([
                'code'       => 200,
                'data'       => $id_cliente,
                'authorized' => 'SI',
                'texto'      => 'Cliente eliminado correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => $id_cliente,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido eliminar al cliente'
            ]);
        }
    }

}

