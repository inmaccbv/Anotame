<?php namespace App\Models;

use CodeIgniter\Model;

class LogueoModelCliente extends Model {
    protected $table = 'clientes';
    protected $primaryKey = 'id_cliente';
    protected $allowedFields = [
      'nombre',
      'apellido',
      'email',
      'password',
      'rol',
    ];
}