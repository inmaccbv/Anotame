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

class MenuUpload extends ResourceController
{

    protected $modelName = 'App\Models\MenuUploadModel';
    protected $format = 'json';
    protected $table = 'menu';
    protected $primaryKey = 'id_menu';

    public function index()
    {
        $db = \Config\Database::connect();
    
        helper(['form', 'url']);
    
        $id_user = $this->request->getPost('id_user');
        $id_empresa = $this->request->getPost('id_empresa');
        $dia = $this->request->getPost('dia'); // Nueva línea para obtener el día
    
        // Verifica que id_user, id_empresa y dia tengan valores antes de continuar
        if (empty($id_user) || empty($id_empresa) || empty($dia)) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Faltan ID de usuario, empresa o día.',
            ]);
        }
    
        $file = $this->request->getFile('menu_img');
    
        if ($file->isValid() && !$file->hasMoved()) {
            error_log('Ruta de destino: ' . FCPATH  . 'uploads'); 
            $file->move(FCPATH  . 'uploads');

            $data = [
                'menu_img'  => $file->getName(),
                'id_user'   => $id_user,
                'id_empresa'=> $id_empresa,
                'dia'       => $dia,
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

    public function getMenusByEmpresa()
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
        $query = $db->query("SELECT * FROM menu WHERE id_empresa = ?", [$id_empresa]);
    
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

        $query = $db4->query("SELECT id_menu, menu_img FROM menu");

        return $this->respond($query->getResult());
    }

    public function borrarImg()
    {

        $db5 = \Config\Database::connect();

        $builder = $db5->table('menu');

        $id_menu = $this->request->getPost('id_menu');

        // Actualizar los datos en la base de datos
        $builder->where('id_menu', $id_menu);
        $builder->delete();

        // Metodo affectedRows() es para comprobar si se elimino al menos una fila y devuelve una respuesta
        if ($db5->affectedRows() > 0) {
            return $this->respond([
                'code'       => 200,
                'data'       => $id_menu,
                'authorized' => 'SI',
                'texto'      => 'Imagen eliminada correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => $id_menu,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido eliminar la imagen'
            ]);
        }
    }
}