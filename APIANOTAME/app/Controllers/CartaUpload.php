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

    public function do_upload()
    {
        $db = \Config\Database::connect();

        helper(['form', 'url']);

        $file = $this->request->getFile('carta_img');

        if ($file->isValid() && !$file->hasMoved()) {
            $file->move(FCPATH . 'uploads');

            $data = [
                'carta_img' => $file->getName()
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
                'texto'      => 'Imagen eliminada correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => $id_carta,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido eliminar la imagen'
            ]);
        }
    }
}