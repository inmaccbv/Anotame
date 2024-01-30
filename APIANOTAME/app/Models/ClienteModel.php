<?php namespace App\Models;

use CodeIgniter\Model;

class ClienteModel extends Model
{
    protected $table            = 'clientes';
    protected $primaryKey       = 'id_cliente';
    protected $allowedFields    = [
        'nombre',
        'apellido',
        'email',
        'telf',
        'password',
        'rol',
    ];
}