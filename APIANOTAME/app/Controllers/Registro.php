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

class Registro extends ResourceController
{
    protected $modelName  = 'App\Models\UserModel';
    protected $format     = 'json';
    protected $table      = 'usuarios';
    protected $primaryKey = 'id_user';
    
    public function index()
    {
        try {
            $db = \Config\Database::connect();
            $builder = $db->table('usuarios');
        
            $data = [
                'nombre'    => $this->request->getPost('nombre'),
                'apellido'  => $this->request->getPost('apellido'),
                'email'     => $this->request->getPost('email'),
                'password'  => hash('sha512', $this->request->getPost('password')),
                'rol'       => $this->request->getPost('rol'),
                'empresa'   => $this->request->getPost('empresa'),
            ];
        
            $builder->select('email');
            $builder->where('email', $data['email']); // Verifica si el correo ya existe
            $query = $builder->get()->getResultArray();
        
            if (empty($query)) {
                // El correo no existe, procede con el registro
                $this->model->insert($data);
                $idUsuario = $db->insertID(); // Obtener el ID del usuario recién registrado
        
                return $this->respond([
                    'code'       => 200,
                    'data'       => $data,
                    'idUsuario'  => $idUsuario, // Envía el ID del usuario al cliente
                    'authorized' => 'SI',
                    'texto'      => 'Registro realizado con éxito',
                ]);
            } else {
                // El correo ya existe, devuelve un error
                return $this->respond([
                    'code'       => 500,
                    'data'       => $query,
                    'authorized' => 'NO',
                    'texto'      => 'Usuario ya existe',
                ]);
            }
        } catch (\Exception $e) {
            log_message('error', $e->getMessage());
            return $this->respond([
                'code'       => 500,
                'authorized' => 'NO',
                'texto'      => 'Error en el servidor al procesar la solicitud',
            ]);
        }
    }

    public function getEmpleados() {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT * FROM usuarios");

        return $this->respond($query->getResult());
    }

    public function getRol() {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT id_user, rol FROM usuarios");

        return $this->respond($query->getResult());
    }

    public function getEmpresas() {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT id_empresa, empresa FROM empresas");

        return $this->respond($query->getResult());
    }
}