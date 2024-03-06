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

    public function getUsuariosPorIdEmpresa()
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
            ]);
        }

        // Puedes realizar la consulta en la base de datos para obtener los textos relacionados con la empresa
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM usuarios WHERE id_empresa = ?", [$id_empresa]);

        // Devolver la respuesta en formato JSON
        return $this->respond([
            'code'       => 200,
            'data'       => $query->getResult(),
            'authorized' => 'SI',
            'texto'      => 'Textos obtenidos con éxito.',
        ]);
    }


    public function getEmpleadosPorEmpresa()
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
            ]);
        }

        // Puedes realizar la consulta en la base de datos para obtener los textos relacionados con la empresa
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM reservas WHERE id_empresa = ?", [$id_empresa]);

        // Devolver la respuesta en formato JSON
        return $this->respond([
            'code'       => 200,
            'data'       => $query->getResult(),
            'authorized' => 'SI',
            'texto'      => 'Textos obtenidos con éxito.',
        ]);
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

    public function getUserAndEmpresaByEmail()
    {
        $email = $this->request->getVar('email');  // Obtener el correo electrónico del cuerpo POST

        $db = \Config\Database::connect();
        $builder = $db->table('usuarios');
        $builder->select('id_user, nombre, apellido, email, rol, id_empresa');
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

    public function getIdEmpresaPorEmail()
    {
        // Obtener el email del cuerpo de la solicitud
        $email = $this->request->getPost('email'); // Cambiar a getPost

        // Validar que se proporcionó el email
        if (empty($email)) {
            return $this->respond([
                'code'       => 400,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'Error: Se requiere el email.',
            ]);
        }

        // Puedes realizar la consulta en la base de datos para obtener el id_empresa relacionado con el email
        $db = \Config\Database::connect();
        $query = $db->query("SELECT id_empresa FROM usuarios WHERE email = ?", [$email]);

        // Obtener el resultado de la consulta
        $result = $query->getRow();

        // Verificar si se encontró un resultado
        if ($result) {
            return $this->respond([
                'code'       => 200,
                'data'       => ['id_empresa' => $result->id_empresa],
                'authorized' => 'SI',
                'texto'      => 'ID de empresa obtenido con éxito.',
            ]);
        } else {
            return $this->respond([
                'code'       => 404,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'No se encontró ninguna empresa asociada al email proporcionado.',
            ]);
        }
    }

    public function getEmpleados()
    {
        $db4 = \Config\Database::connect();

        $query = $db4->query("SELECT * FROM usuarios");

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

    public function userData()
    {
        // Obtiene el id del usuario desde la solicitud POST
        $idUsuario = $this->request->getPost('id_user');

        $db = \Config\Database::connect();

        $builder = $db->table('usuarios');
        $builder->select('id_user, nombre, apellido, email, rol, id_empresa');  // Asegúrate de incluir id_empresa
        $builder->where('id_user', $idUsuario);
        $query = $builder->get()->getRow();

        if ($query) {
            // Ahora, obtén información de la empresa utilizando id_empresa
            $builderEmpresa = $db->table('empresas');
            $builderEmpresa->select('id_empresa, empresa');
            $builderEmpresa->where('id_empresa', $query->id_empresa);
            $empresaData = $builderEmpresa->get()->getRow();

            return $this->respond([
                'code'       => 200,
                'data'       => [
                    'id_user' => $query->id_user,
                    'id_empresa' => $query->id_empresa,
                    'nombre' => $query->nombre,
                    'apellido' => $query->apellido,
                    'email' => $query->email,
                    'rol' => $query->rol,
                    'empresa' => $empresaData,
                ],
                'authorized' => 'SI',
                'texto'      => 'Datos del usuario y la empresa obtenidos correctamente'
            ]);
        } else {
            return $this->respond([
                'code'       => 500,
                'data'       => null,
                'authorized' => 'NO',
                'texto'      => 'No se ha podido obtener los datos del usuario y la empresa'
            ]);
        }
    }
}
