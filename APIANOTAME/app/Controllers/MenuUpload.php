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

    public function do_uploadMenu()
    {
        $db = \Config\Database::connect();

        helper(['form', 'url']);

        try {
            // Obtener el archivo de la solicitud
            $file = $this->request->getFile('menu_img');

            // Verificar si el archivo es válido y no se ha movido
            if ($file->isValid() && !$file->hasMoved()) {
                // Mover el archivo a la carpeta de destino
                $file->move(FCPATH . 'uploads');

                // Datos para la inserción en la base de datos
                $data = [
                    'menu_img' => $file->getName()
                ];

                // Insertar datos en la base de datos
                $this->model->insert($data);

                $url = base_url('uploads/' . $file->getName());

                // Respuesta exitosa
                return $this->respond([
                    'code'       => 200,
                    'data'       => $data,
                    'authorized' => 'SI',
                    'texto'      => 'Archivo subido correctamente',
                    'url'        => $url
                ]);
                
            } else {
                // Respuesta en caso de error al mover el archivo
                return $this->respond([
                    'code'       => 500,
                    'data'       => null,
                    'authorized' => 'NO',
                    'texto'      => 'No se ha podido subir archivo'
                ]);
            }
        } catch (\Exception $e) {
            // Respuesta en caso de excepción
            log_message('error', 'Error en la carga de archivos: ' . $e->getMessage());
            return $this->respond([
                'code'       => 500,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error interno del servidor'
            ]);
        }
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