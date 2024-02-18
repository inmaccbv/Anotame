<?php namespace App\Models;

use CodeIgniter\Model;

class LogueoModel extends Model {
    protected $table = 'usuarios';
    protected $primaryKey = 'id_user';
    protected $allowedFields = [
      'nombre',
      'apellido',
      'email',
      'password',
      'rol',
      'id_empresa',
    ];
}