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
            'cPostal'    => $this->request->getPost('cPostal'),
            'tipoLocal'  => $this->request->getPost('tipoLocal'),
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

    public function obtenerUltimaEmpresa() {
        try {
            $db = \Config\Database::connect();
            $builder = $db->table('empresas');
            
            // Ordena por id_empresa de forma descendente para obtener la última
            $builder->orderBy('id_empresa', 'DESC');
            $builder->limit(1);
    
            $query = $builder->get();
            $result = $query->getRow();
    
            if ($result) {
                return $this->respond([
                    'code' => 200,
                    'data' => $result,
                ]);
            } else {
                return $this->respond([
                    'code' => 404,
                    'error' => 'No se encontró ninguna empresa.',
                ]);
            }
        } catch (\Exception $e) {
            return $this->respond([
                'code' => 500,
                'error' => $e->getMessage(),
            ]);
        }
    }
    

    public function getEmpresas()
    {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT * FROM empresas");

        return $this->respond($query->getResult());
    }

    public function borrarEmpresa()
    {
        $db = \Config\Database::connect();
    
        $id_empresa = $this->request->getPost('id_empresa');
    
        // Verificar si hay reviews asociadas a la empresa
        $reviews = $db->table('reviews')->where('id_empresa', $id_empresa)->get()->getResult();
    
        // Si hay reviews asociadas, eliminarlas primero
        if (!empty($reviews)) {
            $db->table('reviews')->where('id_empresa', $id_empresa)->delete();
        }
    
        // Eliminar la empresa
        $db->table('empresas')->where('id_empresa', $id_empresa)->delete();
    
        // Verificar si se eliminaron filas en ambas tablas
        if ($db->affectedRows() > 0) {
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
    
    public function getEmpleadosPorEmpresa($idUsuario)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('usuarios u');
        $builder->select('u.*, e.*');
        $builder->join('empresas e', 'e.id_empresa = u.id_empresa');
        $builder->where('u.id_user', $idUsuario); // Cambiado de 'ID_USUARIO' a 'id_user' según la consulta SQL
    
        $query = $builder->get();
    
        return $this->respond($query->getResult());
    }
    
    

    

    public function setEmpresaSeleccionada()
    {

        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: Content-Type");
        
        $id_empresa = $this->request->getPost('id_empresa');
        
        // Registro de depuración
        log_message('debug', 'ID de empresa recibido: ' . $id_empresa);
    
        // Puedes almacenar la información en la sesión del usuario, por ejemplo
        $session = session();
        $session->set('id_empresa', $id_empresa);
    
        // Devuelve la respuesta como JSON
        return $this->response->setJSON([
            'code'       => 200,
            'id_empresa' => $id_empresa,
            'authorized' => 'SI',
            'texto'      => 'Empresa seleccionada correctamente',
        ]);
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