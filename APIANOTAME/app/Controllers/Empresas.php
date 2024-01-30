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

class Empresas extends ResourceController
{

    protected $modelName  = 'App\Models\EmpresaModel';
    protected $format     = 'json';
    protected $table      = 'empresas';
    protected $primaryKey = 'id_empresa';

    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('empresas');

        $data = [
            'cif'        => $this->request->getPost('cif'),
            'empresa'    => $this->request->getPost('empresa'),
            'direccion'  => $this->request->getPost('direccion'),
            'provincia'  => $this->request->getPost('provincia'),
            'ciudad'     => $this->request->getPost('ciudad'),
            'cPostal'    => $this->request->getPost('cPostal')
        ];

        $builder->select('cif');
        $builder->where('cif', $data['cif']); // Verifica si el correo ya existe
        $query = $builder->get()->getResultArray();
    
        if (empty($query)) {

            $this->model->insert($data);


            return $this->respond([
                'code'       => 200,
                'data'       => $data,
                'authorized' => 'SI',
                'texto'      => 'Registro de empresa realizado con exito',
            ]);
        } else {

            return $this->respond([
                'code'       => 500,
                'data'       => $query,
                'authorized' => 'NO',
                'texto'      => 'La empresa ya existe',
            ]);
        }


        $builder = $db->table('provincias');

        $data2 = [
            'provincia' => $this->request->getPost('provincia'),

        ];



        $builder = $db->table('provincias');
        $builder->join('empresas', 'empresas.id_empresa = provincias.id_empresa');
        $builder->where($data2);
        $query0 = $builder->get()->getResultArray();

        return $this->respond($query0);
    }

    public function getEmpresas()
    {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT * FROM empresas");

        return $this->respond($query->getResult());
    }

    public function borrarEmpresa()
    {

        $db5 = \Config\Database::connect();

        $builder = $db5->table('empresas');

        $id_empresa = $this->request->getPost('id_empresa');

        // Actualizar los datos en la base de datos
        $builder->where('id_empresa', $id_empresa);
        $builder->delete();

        // Metodo affectedRows() es para comprobar si se elimino al menos una fila y devuelve una respuesta
        if ($db5->affectedRows() > 0) {
            return $this->respond([
                'code'       => 200,
                'data'       => $id_empresa,
                'authorized' => 'SI',
                'texto'      => 'Empresa eliminada correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => $id_empresa,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido eliminar a la empresa'
            ]);
        }
    }

    protected $modelName2  = 'App\Models\ProvinciasModel';
    protected $format2     = 'json';
    protected $table2      = 'provincias';
    protected $primaryKey2 = 'id_provincia';

    public function getProvincias()
    {
        $db2 = \config\Database::connect();

        $query2 = $db2->query("SELECT * FROM provincias");

        return $this->respond($query2->getResult());
    }
}