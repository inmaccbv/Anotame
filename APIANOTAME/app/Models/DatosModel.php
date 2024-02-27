<?php

namespace App\Models;

use CodeIgniter\Model;

class DatosModel extends Model {
    protected $table = 'datos';
    protected $primaryKey = 'id_datos';
    protected $allowedFields = [
        'nomLocal',
        'direccion',
        'telf1',
        'telf2',
        'id_empresa',
        'id_user',
    ];
}