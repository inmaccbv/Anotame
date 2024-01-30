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

class RegistroCliente extends ResourceController
{
    protected $modelName  = 'App\Models\ClienteModel';
    protected $format     = 'json';
    protected $table      = 'clientes';
    protected $primaryKey = 'id_cliente';

    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('clientes');

        $data = [
            'nombre'    => $this->request->getPost('nombre'),
            'apellido'  => $this->request->getPost('apellido'),
            'email'     => $this->request->getPost('email'),
            'telf'     => $this->request->getPost('telf'),
            'password'  => hash('sha512', $this->request->getPost('password')),
            'rol'       => $this->request->getPost('rol')
        ];
    
        $builder->select('email');
        $builder->where('email', $data['email']); // Verifica si el correo ya existe
        $query = $builder->get()->getResultArray();

        if (empty($query)) {

            $this->model->insert($data);
            $idUsuario = $db->insertID(); 

            return $this->respond([
                'code'       => 200,
                'data'       => $data,
                'idUsuario'  => $idUsuario,
                'authorized' => 'SI',
                'texto'      => 'Registro cliente realizado con exito',
            ]);

            //enviar email al cliente
        } else {

            return $this->respond([
                'code'       => 500,
                'data'       => $query,
                'authorized' => 'NO',
                'texto'      => 'Cliente ya existe',
            ]);
        }
    }

    public function getClientes() {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT * FROM clientes");

        return $this->respond($query->getResult());
    }

}