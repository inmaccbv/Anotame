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

class CartaUpload extends ResourceController
{

    protected $modelName = 'App\Models\CartaModel';
    protected $format = 'json';
    protected $table = 'carta';
    protected $primaryKey = 'id_carta';

    public function index()
    {
        $db = \Config\Database::connect();
    
        helper(['form', 'url']);
    
        $id_user = $this->request->getPost('id_user');
        $id_empresa = $this->request->getPost('id_empresa');
    
        // Verifica que id_user e id_empresa tengan valores antes de continuar
        if (empty($id_user) || empty($id_empresa)) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Falta el ID de usuario o de empresa.',
            ]);
        }
    
        $file = $this->request->getFile('carta_img');
    
        if ($file->isValid() && !$file->hasMoved()) {
            error_log('Ruta de destino: ' . FCPATH  . 'uploads'); 
            $file->move(FCPATH  . 'uploads');

            $data = [
                'carta_img'  => $file->getName(),
                'id_user'    => $id_user,
                'id_empresa' => $id_empresa,
            ];
    
            $this->model->insert($data);
    
            $url = base_url('uploads/' . $file->getName());
    
            return $this->respond([
                'code'       => 200,
                'data'       => $data,
                'authorized' => 'SI',
                'texto'      => 'Archivo subido correctamente',
                'url'        => $url
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido subir archivo'
            ]);
        }
    }

    public function getCartasByEmpresa()
    {
        // Obtener el id_empresa del cuerpo de la solicitud
        $id_empresa = $this->request->getGet('id_empresa'); // Cambiar a getGet
    
        // Validar que se proporcionó el id_empresa
        if (empty($id_empresa)) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Se requiere el ID de la empresa.',
            ], 400, 'application/json');
        }
    
        // Puedes realizar la consulta en la base de datos para obtener los textos relacionados con la empresa
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM carta WHERE id_empresa = ?", [$id_empresa]);
    
        // Devolver la respuesta en formato JSON
        return $this->respond([
            'code'       => 200,
            'data'       => $query->getResult(),
            'authorized' => 'SI',
            'texto'      => 'Textos obtenidos con éxito.',
        ], 200, 'application/json');
    }

    public function getImg()
    {
        $db4 = \Config\Database::connect();
    
        $query = $db4->query("SELECT id_carta, carta_img FROM carta");
    
        return $this->respond($query->getResult());
    }

    public function borrarImg()
    {

        $db5 = \Config\Database::connect();

        $builder = $db5->table('carta');

        // Obtiene el id para poder eliminarlo
        $id_carta = $this->request->getPost('id_carta');

        // Actualizar los datos en la base de datos
        $builder->where('id_carta', $id_carta);
        $builder->delete();

        // Metodo affectedRows() es para comprobar si se elimino al menos una fila y devuelve una respuesta
        if ($db5->affectedRows() > 0) {
            return $this->respond([
                'code'       => 200,
                'data'       => $id_carta,
                'authorized' => 'SI',
                'texto'      => 'Empleado eliminado correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => $id_carta,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido eliminar al empleado'
            ]);
        }
    }    
}